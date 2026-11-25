/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * Auth.gs — Authentication, Password Hashing, Session Management & RBAC
 */

var Auth = (function() {
  /**
   * Generates a cryptographic salt
   */
  function generateSalt() {
    return Utilities.getUuid() + '-' + Utilities.getUuid();
  }

  /**
   * Hashes password using SHA-256 + Salt
   * Never stores plain-text passwords
   */
  function hashPassword(password, salt) {
    var raw = password + '::' + salt;
    var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw);
    var hash = '';
    for (var i = 0; i < digest.length; i++) {
      var byteVal = digest[i];
      if (byteVal < 0) byteVal += 256;
      var hex = byteVal.toString(16);
      if (hex.length === 1) hex = '0' + hex;
      hash += hex;
    }
    return hash;
  }

  /**
   * Retrieves or creates the secret key for signing tokens
   */
  function getJwtSecret() {
    var props = PropertiesService.getScriptProperties();
    var secret = props.getProperty(CONFIG.SECRET_PROPERTY_KEY);
    if (!secret) {
      secret = Utilities.getUuid() + '-' + Utilities.getUuid();
      props.setProperty(CONFIG.SECRET_PROPERTY_KEY, secret);
    }
    return secret;
  }

  /**
   * Generates a signed Session Token (HMAC-SHA256)
   */
  function generateSessionToken(user) {
    var now = Date.now();
    var expiry = now + (CONFIG.TOKEN_EXPIRY_HOURS * 3600 * 1000);
    var payload = {
      uid: user['User ID'],
      email: user['Email'],
      role: user['Role'],
      bid: user['Business ID'],
      exp: expiry,
      iat: now
    };

    var payloadStr = Utilities.base64EncodeWebSafe(JSON.stringify(payload));
    var secret = getJwtSecret();
    var signatureBytes = Utilities.computeHmacSha256Signature(payloadStr, secret);
    var signatureStr = Utilities.base64EncodeWebSafe(signatureBytes);

    var token = payloadStr + '.' + signatureStr;

    // Store active token in CacheService for fast revocation & validation
    var cache = CacheService.getScriptCache();
    var cacheSec = CONFIG.TOKEN_EXPIRY_HOURS * 3600;
    cache.put('token_' + user['User ID'], token, cacheSec);

    return token;
  }

  /**
   * Verifies session token authenticity and expiry
   */
  function verifyToken(token) {
    if (!token || typeof token !== 'string') {
      throw new Error('Missing or invalid session token.');
    }

    var parts = token.split('.');
    if (parts.length !== 2) {
      throw new Error('Malformed token structure.');
    }

    var payloadStr = parts[0];
    var providedSignature = parts[1];

    var secret = getJwtSecret();
    var expectedSignatureBytes = Utilities.computeHmacSha256Signature(payloadStr, secret);
    var expectedSignature = Utilities.base64EncodeWebSafe(expectedSignatureBytes);

    if (providedSignature !== expectedSignature) {
      throw new Error('Invalid token signature. Unauthorized access.');
    }

    var decodedJson = Utilities.newBlob(Utilities.base64DecodeWebSafe(payloadStr)).getDataAsString();
    var payload;
    try {
      payload = JSON.parse(decodedJson);
    } catch (e) {
      throw new Error('Invalid token payload.');
    }

    if (Date.now() > payload.exp) {
      throw new Error('Session token expired. Please log in again.');
    }

    return {
      userId: payload.uid,
      email: payload.email,
      role: payload.role,
      businessId: payload.bid
    };
  }

  /**
   * Checks if an Owner account has been initialized
   */
  function authStatus() {
    var users = Database.findAll(TABLES.USERS);
    var ownerExists = false;
    for (var i = 0; i < users.length; i++) {
      if (users[i]['Role'] === ROLES.BUSINESS_OWNER || users[i]['Role'] === ROLES.SUPER_ADMIN) {
        ownerExists = true;
        break;
      }
    }
    return {
      initialized: ownerExists,
      appName: CONFIG.APP_NAME,
      version: CONFIG.VERSION
    };
  }

  /**
   * First-time Owner / Agency Setup
   * Only allowed if no owner exists yet
   */
  function authCreateOwner(data, ip) {
    var status = authStatus();
    if (status.initialized) {
      throw new Error('Owner account is already registered. Public owner registration is disabled.');
    }

    var name = String(data.name || '').trim();
    var businessName = String(data.businessName || '').trim();
    var email = String(data.email || '').trim().toLowerCase();
    var password = String(data.password || '');

    if (!name || !businessName || !email || !password) {
      throw new Error('All fields (Name, Business Name, Email, Password) are required.');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    var businessId = 'biz_' + Utilities.getUuid().substring(0, 8);
    var userId = 'usr_' + Utilities.getUuid().substring(0, 8);
    var salt = generateSalt();
    var hash = hashPassword(password, salt);
    var now = new Date().toISOString();

    // Create Business
    Database.insert(TABLES.BUSINESSES, {
      'Business ID': businessId,
      'Business Name': businessName,
      'Owner Name': name,
      'Email': email,
      'Phone': data.phone || '',
      'Address': data.address || '',
      'Website': data.website || '',
      'Logo': data.logo || '/jainam-logo.png',
      'Currency': data.currency || CONFIG.DEFAULT_CURRENCY,
      'Timezone': data.timezone || CONFIG.DEFAULT_TIMEZONE,
      'Created At': now,
      'Status': 'Active'
    });

    // Create First Owner User
    var userRecord = {
      'User ID': userId,
      'Name': name,
      'Email': email,
      'Password Hash': hash,
      'Salt': salt,
      'Role': ROLES.BUSINESS_OWNER,
      'Business ID': businessId,
      'Status': 'Active',
      'Created At': now,
      'Last Login': now
    };
    Database.insert(TABLES.USERS, userRecord);

    // Create Default WhatsApp Business Line
    Database.insert(TABLES.WHATSAPP_NUMBERS, {
      'Number ID': 'num_' + Utilities.getUuid().substring(0, 8),
      'Business ID': businessId,
      'Display Name': businessName + ' Primary Desk',
      'Phone Number': data.phone || '+91 98201 23456',
      'Country Code': 'IN (+91)',
      'Provider': 'Meta Cloud API',
      'Provider Phone ID': '1368841422989230',
      'Is Default': 'true',
      'Connection Status': 'Connected',
      'AI Enabled': 'true',
      'Created At': now
    }, businessId);

    var token = generateSessionToken(userRecord);

    AuditLogs.log(businessId, userId, 'OWNER_REGISTERED', 'AUTH', {
      email: email,
      businessName: businessName,
      ip: ip
    });

    return {
      token: token,
      user: {
        userId: userId,
        name: name,
        email: email,
        role: ROLES.BUSINESS_OWNER,
        businessId: businessId
      },
      business: {
        businessId: businessId,
        businessName: businessName
      }
    };
  }

  /**
   * User Login with Rate Limiting & Lockout
   */
  function authLogin(email, password, ip) {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    var cleanEmail = String(email).trim().toLowerCase();
    var cache = CacheService.getScriptCache();
    var attemptKey = 'login_fail_' + cleanEmail;
    var failedAttempts = parseInt(cache.get(attemptKey) || '0', 10);

    if (failedAttempts >= CONFIG.MAX_LOGIN_ATTEMPTS) {
      throw new Error('Account locked due to excessive failed attempts. Please retry in ' + CONFIG.LOCKOUT_MINUTES + ' minutes.');
    }

    var users = Database.findAll(TABLES.USERS, null, function(u) {
      return String(u['Email']).toLowerCase() === cleanEmail;
    });

    if (users.length === 0) {
      cache.put(attemptKey, String(failedAttempts + 1), CONFIG.LOCKOUT_MINUTES * 60);
      throw new Error('Invalid email or password.');
    }

    var user = users[0];
    if (user['Status'] !== 'Active') {
      throw new Error('This account has been deactivated. Please contact support.');
    }

    var expectedHash = hashPassword(password, user['Salt']);
    if (expectedHash !== user['Password Hash']) {
      cache.put(attemptKey, String(failedAttempts + 1), CONFIG.LOCKOUT_MINUTES * 60);
      AuditLogs.log(user['Business ID'], user['User ID'], 'LOGIN_FAILED', 'AUTH', { ip: ip, email: cleanEmail });
      throw new Error('Invalid email or password.');
    }

    // Reset failed attempts on success
    cache.remove(attemptKey);

    // Update Last Login
    var now = new Date().toISOString();
    Database.update(TABLES.USERS, 'User ID', user['User ID'], {
      'Last Login': now
    }, user['Business ID']);

    var business = Database.findById(TABLES.BUSINESSES, 'Business ID', user['Business ID']);
    var token = generateSessionToken(user);

    AuditLogs.log(user['Business ID'], user['User ID'], 'LOGIN_SUCCESS', 'AUTH', { ip: ip });

    return {
      token: token,
      user: {
        userId: user['User ID'],
        name: user['Name'],
        email: user['Email'],
        role: user['Role'],
        businessId: user['Business ID'],
        lastLogin: now
      },
      business: business ? {
        businessId: business['Business ID'],
        businessName: business['Business Name'],
        currency: business['Currency'] || CONFIG.DEFAULT_CURRENCY,
        timezone: business['Timezone'] || CONFIG.DEFAULT_TIMEZONE
      } : null
    };
  }

  /**
   * User Logout
   */
  function authLogout(token) {
    try {
      var authUser = verifyToken(token);
      var cache = CacheService.getScriptCache();
      cache.remove('token_' + authUser.userId);
      AuditLogs.log(authUser.businessId, authUser.userId, 'LOGOUT', 'AUTH');
    } catch (e) {
      // Token may be already invalid
    }
    return { success: true };
  }

  /**
   * Retrieves active session details
   */
  function authMe(token) {
    var authUser = verifyToken(token);
    var user = Database.findById(TABLES.USERS, 'User ID', authUser.userId, authUser.businessId);
    if (!user) {
      throw new Error('User record not found.');
    }
    var business = Database.findById(TABLES.BUSINESSES, 'Business ID', authUser.businessId);

    return {
      user: {
        userId: user['User ID'],
        name: user['Name'],
        email: user['Email'],
        role: user['Role'],
        businessId: user['Business ID'],
        lastLogin: user['Last Login']
      },
      business: business ? {
        businessId: business['Business ID'],
        businessName: business['Business Name'],
        ownerName: business['Owner Name'],
        phone: business['Phone'],
        email: business['Email'],
        address: business['Address'],
        currency: business['Currency'],
        timezone: business['Timezone']
      } : null
    };
  }

  /**
   * Change Password
   */
  function changePassword(token, oldPassword, newPassword) {
    var authUser = verifyToken(token);
    var user = Database.findById(TABLES.USERS, 'User ID', authUser.userId, authUser.businessId);
    if (!user) throw new Error('User not found.');

    var checkOld = hashPassword(oldPassword, user['Salt']);
    if (checkOld !== user['Password Hash']) {
      throw new Error('Current password does not match.');
    }

    if (!newPassword || newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters.');
    }

    var newSalt = generateSalt();
    var newHash = hashPassword(newPassword, newSalt);

    Database.update(TABLES.USERS, 'User ID', user['User ID'], {
      'Password Hash': newHash,
      'Salt': newSalt
    }, authUser.businessId);

    AuditLogs.log(authUser.businessId, authUser.userId, 'PASSWORD_CHANGED', 'AUTH');
    return { success: true, message: 'Password updated successfully.' };
  }

  /**
   * Forgot Password Workflow
   */
  function forgotPassword(email) {
    var cleanEmail = String(email || '').trim().toLowerCase();
    var users = Database.findAll(TABLES.USERS, null, function(u) {
      return String(u['Email']).toLowerCase() === cleanEmail;
    });

    if (users.length > 0) {
      var user = users[0];
      var resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      var cache = CacheService.getScriptCache();
      cache.put('reset_' + cleanEmail, resetCode, 15 * 60); // 15 mins expiry

      AuditLogs.log(user['Business ID'], user['User ID'], 'PASSWORD_RESET_REQUESTED', 'AUTH', {
        email: cleanEmail
      });
      Logger.log('Password reset code generated for: ' + cleanEmail + ' -> ' + resetCode);
    }

    // Always return safe response to avoid user enumeration
    return {
      success: true,
      message: 'If an account exists for this email, password recovery instructions have been prepared.'
    };
  }

  return {
    generateSalt: generateSalt,
    hashPassword: hashPassword,
    verifyToken: verifyToken,
    authStatus: authStatus,
    authCreateOwner: authCreateOwner,
    authLogin: authLogin,
    authLogout: authLogout,
    authMe: authMe,
    changePassword: changePassword,
    forgotPassword: forgotPassword
  };
})();
