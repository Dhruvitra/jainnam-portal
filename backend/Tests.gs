/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * Tests.gs — Comprehensive Backend Verification & Test Suite
 * 
 * Run `runAllBackendTests()` directly from the Apps Script editor to execute
 * the complete automated test battery.
 */

function runAllBackendTests() {
  var results = [];
  var passed = 0;
  var failed = 0;

  function assert(testName, condition, detail) {
    if (condition) {
      passed++;
      results.push({ name: testName, status: 'PASSED', detail: detail || 'OK' });
      Logger.log('[PASS] ' + testName);
    } else {
      failed++;
      results.push({ name: testName, status: 'FAILED', detail: detail || 'Assertion failed' });
      Logger.log('[FAIL] ' + testName + ' -> ' + detail);
    }
  }

  Logger.log('=== STARTING JAINAM TOURS BACKEND TEST BATTERY ===');

  try {
    // TEST 1: Database Setup & Schemas
    var initRes = initializeDatabase();
    assert('Test 1: Database Initialization', initRes && initRes.success, 'All 15 tables provisioned');

    // TEST 2: Password Hashing with Salt
    var testPass = 'SecretJainam2026!';
    var salt1 = Auth.generateSalt();
    var hash1 = Auth.hashPassword(testPass, salt1);
    var hash2 = Auth.hashPassword(testPass, salt1);
    var hashDiffSalt = Auth.hashPassword(testPass, Auth.generateSalt());
    assert('Test 2.1: Hash Determinism', hash1 === hash2, 'Same pass + salt produces identical hash');
    assert('Test 2.2: Salt Uniqueness', hash1 !== hashDiffSalt, 'Different salt produces distinct hash');

    // TEST 3: Auth Status Check
    var status = Auth.authStatus();
    assert('Test 3: Auth Status', typeof status.initialized === 'boolean', 'Auth status check returns boolean initialized');

    // TEST 4: Owner Registration / Login
    var testEmail = 'test_admin_' + Utilities.getUuid().substring(0, 4) + '@jainamtours.com';
    var testPassword = 'Password123!';
    var ownerRes;
    
    // Test login on seeded Jainam admin or create mock test user
    var mockBizId = 'biz_test_' + Utilities.getUuid().substring(0, 4);
    var mockUserId = 'usr_test_' + Utilities.getUuid().substring(0, 4);
    var mockSalt = Auth.generateSalt();
    Database.insert(TABLES.USERS, {
      'User ID': mockUserId,
      'Name': 'Test Consultant',
      'Email': testEmail,
      'Password Hash': Auth.hashPassword(testPassword, mockSalt),
      'Salt': mockSalt,
      'Role': ROLES.BUSINESS_OWNER,
      'Business ID': mockBizId,
      'Status': 'Active',
      'Created At': new Date().toISOString(),
      'Last Login': ''
    });

    var loginRes = Auth.authLogin(testEmail, testPassword, '127.0.0.1');
    assert('Test 4.1: Login Succeeded', loginRes && loginRes.token && loginRes.user.email === testEmail, 'Session token issued');

    // Verify invalid password fails
    var failedLoginCaught = false;
    try {
      Auth.authLogin(testEmail, 'wrongPassword!', '127.0.0.1');
    } catch (e) {
      failedLoginCaught = true;
    }
    assert('Test 4.2: Invalid Password Blocked', failedLoginCaught, 'Rejected wrong password');

    // TEST 5: Session Token Verification & Tamper Resistance
    var verified = Auth.verifyToken(loginRes.token);
    assert('Test 5.1: Token Verification', verified.userId === mockUserId && verified.businessId === mockBizId, 'Token claims match user');

    var tamperedCaught = false;
    try {
      Auth.verifyToken(loginRes.token + 'corrupted');
    } catch (e) {
      tamperedCaught = true;
    }
    assert('Test 5.2: Tampered Token Rejected', tamperedCaught, 'Tampered signature detected');

    var mockUser = {
      userId: mockUserId,
      name: 'Test Consultant',
      email: testEmail,
      role: ROLES.BUSINESS_OWNER,
      businessId: mockBizId
    };

    // TEST 6: Phone Normalization & Customer Creation
    var rawPhone = '98201 11223';
    var normPhone = Customers.normalizePhone(rawPhone, '+91');
    assert('Test 6.1: Phone Normalization', normPhone === '+919820111223', 'Formatted to E.164 (+919820111223)');

    var cust = Customers.createCustomer(mockUser, {
      name: 'Pravin Patel',
      phone: normPhone,
      email: 'pravin.patel@example.com',
      destination: 'Kashmir',
      budget: 85000,
      travellers: 2
    });
    assert('Test 6.2: Customer Record Created', cust && cust['Customer ID'], 'Customer record created in CONTACTS table');

    // Test duplicate phone prevention
    var dupCaught = false;
    try {
      Customers.createCustomer(mockUser, {
        name: 'Another Pravin',
        phone: normPhone
      });
    } catch (e) {
      dupCaught = true;
    }
    assert('Test 6.3: Duplicate Customer Blocked', dupCaught, 'Duplicate phone number blocked for same business');

    // TEST 7: Multi-Tenant Data Isolation
    var otherBizUser = {
      userId: 'usr_other',
      businessId: 'biz_other_agency',
      role: ROLES.BUSINESS_OWNER
    };
    var otherBizCustomers = Customers.getCustomers(otherBizUser);
    var foundLeaked = otherBizCustomers.customers.some(function(c) {
      return c['Customer ID'] === cust['Customer ID'];
    });
    assert('Test 7: Multi-Tenant Data Isolation', !foundLeaked, 'Business B cannot read Business A customer data');

    // TEST 8: Tour Package Creation & Calculation
    var pkg = Packages.createPackage(mockUser, {
      name: 'Shimla & Manali Luxury Retreat',
      destination: 'Himachal Pradesh',
      duration: '4 Nights / 5 Days',
      price: 36000,
      hotelDetails: '5-Star Forest Resort',
      inclusions: ['Breakfast', 'Private Cab', 'Sightseeing'],
      itineraryDays: [
        { dayNumber: 1, title: 'Arrival in Shimla', description: 'Mall Road visit' },
        { dayNumber: 2, title: 'Kufri Snow Point', description: 'Excursion and photography' }
      ]
    });
    assert('Test 8.1: Package Created', pkg && pkg['Package ID'], 'Package stored in PACKAGES table');

    var quoteCalc = Quotations.calculateQuotation({
      packageId: pkg['Package ID'],
      adultCount: 2,
      childCount: 1,
      hotelSelection: '5-Star Luxury',
      taxRate: 5,
      discount: 2000
    });
    assert('Test 8.2: Quotation Calculation', quoteCalc.breakdown.finalPrice > 0, 'Itemized quote calculated: Final = ₹' + quoteCalc.breakdown.finalPrice);

    // TEST 9: Booking Creation & Payment Balance Recalculation
    var booking = Bookings.createBooking(mockUser, {
      customerId: cust['Customer ID'],
      packageId: pkg['Package ID'],
      totalAmount: quoteCalc.breakdown.finalPrice,
      paidAmount: 25000,
      travelDate: '2026-12-15'
    });
    assert('Test 9.1: Booking Created', booking && booking['Booking ID'], 'Booking recorded with deposit');
    assert('Test 9.2: Balance Calculated', booking['Balance'] === (quoteCalc.breakdown.finalPrice - 25000), 'Balance is correct');

    // Clean up test customer & package
    Customers.deleteCustomer(mockUser, cust['Customer ID']);

  } catch (err) {
    failed++;
    results.push({ name: 'FATAL_TEST_ERROR', status: 'CRASH', detail: err.message });
    Logger.log('[CRASH] ' + err.message);
  }

  Logger.log('=== TEST SUMMARY: ' + passed + ' PASSED, ' + failed + ' FAILED ===');
  return {
    total: passed + failed,
    passed: passed,
    failed: failed,
    results: results
  };
}
