/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * Database.gs — Modular Data Access Layer (DAL) for Google Sheets
 * 
 * Provides an abstract, multi-tenant, cached, and concurrency-safe interface.
 * Designed to seamlessly port to Supabase, PostgreSQL, or Firebase later.
 */

var Database = (function() {
  var sheetCache = {};
  var headerCache = {};

  /**
   * Retrieves the target Spreadsheet
   */
  function getSpreadsheet() {
    var props = PropertiesService.getScriptProperties();
    var sheetId = props.getProperty(CONFIG.SPREADSHEET_ID_PROPERTY);
    if (sheetId) {
      try {
        return SpreadsheetApp.openById(sheetId);
      } catch (e) {
        // Fallback to active spreadsheet if bound
      }
    }
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;

    // Auto-create spreadsheet if running as standalone script
    try {
      var newSs = SpreadsheetApp.create('Jainam Tours and Travels Database');
      props.setProperty(CONFIG.SPREADSHEET_ID_PROPERTY, newSs.getId());
      return newSs;
    } catch (err) {
      Logger.log('Could not auto-create spreadsheet: ' + err.message);
      return null;
    }
  }

  /**
   * Retrieves a sheet by name with memory caching
   */
  function getSheet(sheetName) {
    if (sheetCache[sheetName]) {
      return sheetCache[sheetName];
    }
    var ss = getSpreadsheet();
    if (!ss) {
      return null;
    }
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      try {
        sheet = ss.insertSheet(sheetName);
        var schema = TABLES[sheetName] || [];
        if (schema.length > 0) {
          sheet.getRange(1, 1, 1, schema.length).setValues([schema]);
        }
      } catch (e) {
        return null;
      }
    }
    sheetCache[sheetName] = sheet;
    return sheet;
  }

  /**
   * Retrieves column header indices for a sheet
   */
  function getHeaderMap(sheetName) {
    if (headerCache[sheetName]) {
      return headerCache[sheetName];
    }
    var sheet = getSheet(sheetName);
    var lastCol = sheet.getLastColumn();
    if (lastCol === 0) return {};
    
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var map = {};
    for (var i = 0; i < headers.length; i++) {
      var key = String(headers[i]).trim();
      if (key) {
        map[key] = i; // 0-based column index
      }
    }
    headerCache[sheetName] = map;
    return map;
  }

  /**
   * Converts a sheet row array to a JavaScript Object
   */
  function rowToObject(row, headerMap) {
    var obj = {};
    for (var header in headerMap) {
      var colIdx = headerMap[header];
      var val = row[colIdx];
      // Format Dates to ISO string
      if (val instanceof Date) {
        val = val.toISOString();
      }
      obj[header] = val !== undefined && val !== null ? val : '';
    }
    return obj;
  }

  /**
   * Converts a JavaScript Object to a sheet row array following the official schema
   */
  function objectToRow(obj, sheetName) {
    var schema = SCHEMAS[sheetName];
    if (!schema) {
      throw new Error('No schema registered for sheet: ' + sheetName);
    }
    var row = [];
    for (var i = 0; i < schema.length; i++) {
      var colName = schema[i];
      var val = obj[colName];
      if (val === undefined || val === null) {
        val = '';
      } else if (typeof val === 'object' && !(val instanceof Date)) {
        val = JSON.stringify(val);
      }
      row.push(val);
    }
    return row;
  }

  /**
   * Reads all records from a sheet with multi-tenant filtering
   */
  function findAll(sheetName, businessId, filterFn) {
    var sheet = getSheet(sheetName);
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();

    if (lastRow <= 1 || lastCol === 0) {
      return [];
    }

    var headerMap = getHeaderMap(sheetName);
    var data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
    var results = [];

    for (var i = 0; i < data.length; i++) {
      var obj = rowToObject(data[i], headerMap);
      obj._rowIndex = i + 2; // Actual row number in Google Sheet

      // Multi-tenant check: if sheet has Business ID column and businessId is provided
      if (businessId && headerMap['Business ID'] !== undefined) {
        if (String(obj['Business ID']) !== String(businessId)) {
          continue; // Strictly skip other businesses
        }
      }

      if (typeof filterFn === 'function') {
        if (!filterFn(obj)) continue;
      }

      results.push(obj);
    }

    return results;
  }

  /**
   * Finds a single record by key
   */
  function findById(sheetName, idColumnName, idValue, businessId) {
    var matches = findAll(sheetName, businessId, function(item) {
      return String(item[idColumnName]) === String(idValue);
    });
    return matches.length > 0 ? matches[0] : null;
  }

  /**
   * Thread-safe insert using LockService
   */
  function insert(sheetName, recordData, businessId) {
    if (!recordData) return {};
    try {
      if (businessId && SCHEMAS[sheetName] && SCHEMAS[sheetName].indexOf('Business ID') !== -1) {
        recordData['Business ID'] = businessId;
      }
      if (SCHEMAS[sheetName] && SCHEMAS[sheetName].indexOf('Created At') !== -1 && !recordData['Created At']) {
        recordData['Created At'] = new Date().toISOString();
      }

      var sheet = getSheet(sheetName);
      if (!sheet) {
        Logger.log('Sheet ' + sheetName + ' not accessible, skipping DB persist.');
        return recordData;
      }

      var lock = LockService.getScriptLock();
      try { lock.waitLock(5000); } catch (e) {}

      try {
        var row = objectToRow(recordData, sheetName);
        sheet.appendRow(row);
        return recordData;
      } finally {
        try { lock.releaseLock(); } catch (e) {}
      }
    } catch (err) {
      Logger.log('Insert error in ' + sheetName + ': ' + err.message);
      return recordData;
    }
  }

  /**
   * Batch insert multiple records
   */
  function insertBatch(sheetName, recordsArray, businessId) {
    if (!recordsArray || recordsArray.length === 0) return [];
    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(15000);
    } catch (e) {
      throw new Error('Database is busy. Could not obtain write lock.');
    }

    try {
      var sheet = getSheet(sheetName);
      var rows = [];
      var now = new Date().toISOString();

      for (var i = 0; i < recordsArray.length; i++) {
        var rec = recordsArray[i];
        if (businessId && SCHEMAS[sheetName].indexOf('Business ID') !== -1) {
          rec['Business ID'] = businessId;
        }
        if (SCHEMAS[sheetName].indexOf('Created At') !== -1 && !rec['Created At']) {
          rec['Created At'] = now;
        }
        rows.push(objectToRow(rec, sheetName));
      }

      var startRow = sheet.getLastRow() + 1;
      var numRows = rows.length;
      var numCols = rows[0].length;
      sheet.getRange(startRow, 1, numRows, numCols).setValues(rows);
      return recordsArray;
    } finally {
      lock.releaseLock();
    }
  }

  /**
   * Updates an existing record by ID
   */
  function update(sheetName, idColumnName, idValue, updates, businessId) {
    try {
      var sheet = getSheet(sheetName);
      if (!sheet) return updates;

      var lock = LockService.getScriptLock();
      try { lock.waitLock(5000); } catch (e) {}

      try {
        var existing = findById(sheetName, idColumnName, idValue, businessId);
        if (!existing || !existing._rowIndex) {
          return updates;
        }

        // Merge updates
        for (var key in updates) {
          if (key !== idColumnName && key !== 'Business ID' && key !== '_rowIndex') {
            existing[key] = updates[key];
          }
        }

        if (SCHEMAS[sheetName] && SCHEMAS[sheetName].indexOf('Updated At') !== -1) {
          existing['Updated At'] = new Date().toISOString();
        }

        var row = objectToRow(existing, sheetName);
        sheet.getRange(existing._rowIndex, 1, 1, row.length).setValues([row]);
        return existing;
      } finally {
        try { lock.releaseLock(); } catch (e) {}
      }
    } catch (err) {
      Logger.log('update error: ' + err.message);
      return updates;
    }
  }

  /**
   * Deletes a record by ID
   */
  function deleteRow(sheetName, idColumnName, idValue, businessId) {
    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(10000);
    } catch (e) {
      throw new Error('Database write lock timeout.');
    }

    try {
      var existing = findById(sheetName, idColumnName, idValue, businessId);
      if (!existing) {
        throw new Error('Record not found for deletion.');
      }

      var sheet = getSheet(sheetName);
      sheet.deleteRow(existing._rowIndex);
      return true;
    } finally {
      lock.releaseLock();
    }
  }

  /**
   * Retrieves the first record matching a condition
   */
  function findFirst(sheetName, businessId, predicate) {
    try {
      var all = findAll(sheetName, businessId, predicate);
      return (all && all.length > 0) ? all[0] : null;
    } catch (e) {
      Logger.log('findFirst error in ' + sheetName + ': ' + e.message);
      return null;
    }
  }

  return {
    getSpreadsheet: getSpreadsheet,
    getSheet: getSheet,
    getHeaderMap: getHeaderMap,
    findAll: findAll,
    findFirst: findFirst,
    findById: findById,
    insert: insert,
    insertBatch: insertBatch,
    update: update,
    deleteRow: deleteRow
  };
})();
