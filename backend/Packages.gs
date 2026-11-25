/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * Packages.gs — Tour Package Management, Multi-day Itineraries, and Brochure Engine
 */

var Packages = (function() {
  /**
   * Creates a new Tour Package with optional itinerary days
   */
  function createPackage(user, packageData) {
    var businessId = user.businessId;
    var name = String(packageData.name || packageData.packageName || '').trim();
    var destination = String(packageData.destination || '').trim();

    if (!name || !destination) {
      throw new Error('Package Name and Destination are required.');
    }

    var price = Number(packageData.price || packageData.pricePerPerson || 0);
    if (isNaN(price) || price < 0) {
      throw new Error('A valid price per person is required.');
    }

    var packageId = 'pkg_' + Utilities.getUuid().substring(0, 8);
    var now = new Date().toISOString();

    var record = {
      'Package ID': packageId,
      'Business ID': businessId,
      'Package Name': name,
      'Destination': destination,
      'Duration': packageData.duration || '5 Nights / 6 Days',
      'Price': price,
      'Currency': packageData.currency || CONFIG.DEFAULT_CURRENCY,
      'Hotel Details': packageData.hotelDetails || packageData.hotelCategory || '4-Star Luxury',
      'Transportation': packageData.transportation || 'Private AC Vehicle',
      'Meals': packageData.meals || 'Breakfast & Dinner (Pure Veg / Jain on request)',
      'Inclusions': Array.isArray(packageData.inclusions) ? packageData.inclusions.join(' | ') : (packageData.inclusions || ''),
      'Exclusions': Array.isArray(packageData.exclusions) ? packageData.exclusions.join(' | ') : (packageData.exclusions || ''),
      'Highlights': Array.isArray(packageData.highlights) ? packageData.highlights.join(' | ') : (packageData.highlights || ''),
      'Itinerary': packageData.itinerary || '',
      'Best Season': packageData.bestSeason || 'All Year Round',
      'Images': Array.isArray(packageData.images) ? packageData.images.join(';') : (packageData.images || ''),
      'Brochure URL': packageData.brochureUrl || '',
      'Active Status': packageData.activeStatus || 'Active'
    };

    Database.insert(TABLES.PACKAGES, record, businessId);

    // If day-wise itinerary array is provided, insert into PACKAGE_ITINERARY table
    if (Array.isArray(packageData.itineraryDays) && packageData.itineraryDays.length > 0) {
      var itineraryRows = [];
      for (var i = 0; i < packageData.itineraryDays.length; i++) {
        var day = packageData.itineraryDays[i];
        itineraryRows.push({
          'Itinerary ID': 'itin_' + Utilities.getUuid().substring(0, 8),
          'Package ID': packageId,
          'Day Number': day.dayNumber || (i + 1),
          'Day Title': day.title || day.dayTitle || ('Day ' + (i + 1)),
          'Description': day.description || '',
          'Activities': day.activities || '',
          'Hotel': day.hotel || '',
          'Meals': day.meals || '',
          'Transport': day.transport || ''
        });
      }
      Database.insertBatch(TABLES.PACKAGE_ITINERARY, itineraryRows, businessId);
    }

    AuditLogs.log(businessId, user.userId, 'PACKAGE_CREATED', 'PACKAGES', { packageId: packageId, name: name });
    return record;
  }

  /**
   * Retrieves all packages for the agency
   */
  function getPackages(user, filters) {
    var businessId = user.businessId;
    filters = filters || {};

    var packages = Database.findAll(TABLES.PACKAGES, businessId, function(p) {
      if (filters.activeOnly && p['Active Status'] !== 'Active') return false;
      if (filters.destination && String(p['Destination']).toLowerCase().indexOf(filters.destination.toLowerCase()) === -1) return false;
      return true;
    });

    return packages;
  }

  /**
   * Retrieves single package with linked day-by-day itinerary
   */
  function getPackage(user, packageId) {
    var pkg = Database.findById(TABLES.PACKAGES, 'Package ID', packageId, user.businessId);
    if (!pkg) throw new Error('Package not found.');

    var itineraryDays = Database.findAll(TABLES.PACKAGE_ITINERARY, null, function(item) {
      return item['Package ID'] === packageId;
    });

    itineraryDays.sort(function(a, b) {
      return Number(a['Day Number']) - Number(b['Day Number']);
    });

    return {
      package: pkg,
      itineraryDays: itineraryDays
    };
  }

  /**
   * Updates an existing package
   */
  function updatePackage(user, packageId, updates) {
    var businessId = user.businessId;
    var pkg = Database.findById(TABLES.PACKAGES, 'Package ID', packageId, businessId);
    if (!pkg) throw new Error('Package not found.');

    if (updates.inclusions && Array.isArray(updates.inclusions)) {
      updates['Inclusions'] = updates.inclusions.join(' | ');
    }
    if (updates.exclusions && Array.isArray(updates.exclusions)) {
      updates['Exclusions'] = updates.exclusions.join(' | ');
    }

    var updated = Database.update(TABLES.PACKAGES, 'Package ID', packageId, updates, businessId);
    AuditLogs.log(businessId, user.userId, 'PACKAGE_UPDATED', 'PACKAGES', { packageId: packageId });
    return updated;
  }

  /**
   * Duplicates an existing tour package
   */
  function duplicatePackage(user, packageId) {
    var businessId = user.businessId;
    var original = Database.findById(TABLES.PACKAGES, 'Package ID', packageId, businessId);
    if (!original) throw new Error('Source package not found.');

    var cloneData = JSON.parse(JSON.stringify(original));
    cloneData['Package ID'] = 'pkg_' + Utilities.getUuid().substring(0, 8);
    cloneData['Package Name'] = original['Package Name'] + ' (Copy)';
    delete cloneData._rowIndex;

    Database.insert(TABLES.PACKAGES, cloneData, businessId);

    // Duplicate linked itinerary days
    var originalItin = Database.findAll(TABLES.PACKAGE_ITINERARY, null, function(item) {
      return item['Package ID'] === packageId;
    });

    if (originalItin.length > 0) {
      var clonedItin = [];
      for (var i = 0; i < originalItin.length; i++) {
        var day = JSON.parse(JSON.stringify(originalItin[i]));
        day['Itinerary ID'] = 'itin_' + Utilities.getUuid().substring(0, 8);
        day['Package ID'] = cloneData['Package ID'];
        delete day._rowIndex;
        clonedItin.push(day);
      }
      Database.insertBatch(TABLES.PACKAGE_ITINERARY, clonedItin, businessId);
    }

    AuditLogs.log(businessId, user.userId, 'PACKAGE_DUPLICATED', 'PACKAGES', { originalId: packageId, newId: cloneData['Package ID'] });
    return cloneData;
  }

  /**
   * Soft delete or deactivate a package
   */
  function deletePackage(user, packageId) {
    var businessId = user.businessId;
    Database.update(TABLES.PACKAGES, 'Package ID', packageId, { 'Active Status': 'Inactive' }, businessId);
    AuditLogs.log(businessId, user.userId, 'PACKAGE_DEACTIVATED', 'PACKAGES', { packageId: packageId });
    return { success: true };
  }

  /**
   * Uploads package PDF brochure to Google Drive
   */
  function uploadPackageBrochure(user, packageId, base64Data, filename) {
    var businessId = user.businessId;
    var pkg = Database.findById(TABLES.PACKAGES, 'Package ID', packageId, businessId);
    if (!pkg) throw new Error('Package not found.');

    var folderName = 'Jainam_Tours_Brochures';
    var folders = DriveApp.getFoldersByName(folderName);
    var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

    var decoded = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decoded, 'application/pdf', filename || (pkg['Package Name'] + '_Brochure.pdf'));
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    var fileUrl = file.getUrl();
    Database.update(TABLES.PACKAGES, 'Package ID', packageId, { 'Brochure URL': fileUrl }, businessId);

    AuditLogs.log(businessId, user.userId, 'BROCHURE_UPLOADED', 'PACKAGES', { packageId: packageId, fileUrl: fileUrl });
    return { success: true, brochureUrl: fileUrl };
  }

  return {
    createPackage: createPackage,
    getPackages: getPackages,
    getPackage: getPackage,
    updatePackage: updatePackage,
    duplicatePackage: duplicatePackage,
    deletePackage: deletePackage,
    uploadPackageBrochure: uploadPackageBrochure
  };
})();
