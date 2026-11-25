/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * Bookings.gs — Confirmed Booking Management, Financials & Payment Balances
 */

var Bookings = (function() {
  /**
   * Creates a new Booking record
   */
  function createBooking(user, bookingData) {
    var businessId = user.businessId;
    var customerId = bookingData.customerId;
    var packageId = bookingData.packageId;

    if (!customerId) {
      throw new Error('Customer ID is required to create a booking.');
    }

    var totalAmount = Number(bookingData.totalAmount || 0);
    var paidAmount = Number(bookingData.paidAmount || 0);
    var balance = Math.max(0, totalAmount - paidAmount);

    var paymentStatus = 'Unpaid';
    if (paidAmount >= totalAmount && totalAmount > 0) {
      paymentStatus = 'Paid Full';
    } else if (paidAmount > 0) {
      paymentStatus = 'Partial Deposit';
    }

    var bookingId = 'bk_' + Utilities.getUuid().substring(0, 8);

    var record = {
      'Booking ID': bookingId,
      'Business ID': businessId,
      'Customer ID': customerId,
      'Package ID': packageId || '',
      'Quotation ID': bookingData.quotationId || '',
      'Travel Date': bookingData.travelDate || '',
      'Return Date': bookingData.returnDate || '',
      'Total Amount': totalAmount,
      'Paid Amount': paidAmount,
      'Balance': balance,
      'Payment Status': paymentStatus,
      'Booking Status': bookingData.bookingStatus || 'Confirmed',
      'Notes': bookingData.notes || ''
    };

    Database.insert(TABLES.BOOKINGS, record, businessId);

    // Update customer stage to 'Booked'
    try {
      Database.update(TABLES.CUSTOMERS, 'Customer ID', customerId, {
        'Lead Stage': LEAD_STAGES.BOOKED
      }, businessId);
    } catch (e) {
      // Ignore if customer not present
    }

    AuditLogs.log(businessId, user.userId, 'BOOKING_CREATED', 'BOOKINGS', {
      bookingId: bookingId,
      customerId: customerId,
      totalAmount: totalAmount
    });

    return record;
  }

  /**
   * Retrieves bookings for the business
   */
  function getBookings(user, filters) {
    var businessId = user.businessId;
    filters = filters || {};

    var bookings = Database.findAll(TABLES.BOOKINGS, businessId, function(b) {
      if (filters.customerId && b['Customer ID'] !== filters.customerId) return false;
      if (filters.bookingStatus && b['Booking Status'] !== filters.bookingStatus) return false;
      if (filters.paymentStatus && b['Payment Status'] !== filters.paymentStatus) return false;
      return true;
    });

    // Populate Customer name and package name for ease of display
    var customers = Database.findAll(TABLES.CUSTOMERS, businessId);
    var packages = Database.findAll(TABLES.PACKAGES, businessId);

    var custMap = {};
    for (var i = 0; i < customers.length; i++) {
      custMap[customers[i]['Customer ID']] = customers[i];
    }
    var pkgMap = {};
    for (var j = 0; j < packages.length; j++) {
      pkgMap[packages[j]['Package ID']] = packages[j];
    }

    return bookings.map(function(b) {
      var cust = custMap[b['Customer ID']];
      var pkg = pkgMap[b['Package ID']];
      return {
        bookingId: b['Booking ID'],
        customerId: b['Customer ID'],
        customerName: cust ? cust['Name'] : 'Customer',
        customerPhone: cust ? cust['Phone'] : '',
        packageId: b['Package ID'],
        packageName: pkg ? pkg['Package Name'] : (b['Notes'] || 'Custom Package'),
        travelDate: b['Travel Date'],
        returnDate: b['Return Date'],
        totalAmount: Number(b['Total Amount'] || 0),
        paidAmount: Number(b['Paid Amount'] || 0),
        balance: Number(b['Balance'] || 0),
        paymentStatus: b['Payment Status'],
        bookingStatus: b['Booking Status'],
        notes: b['Notes']
      };
    });
  }

  /**
   * Updates an existing Booking record
   */
  function updateBooking(user, bookingId, updates) {
    var businessId = user.businessId;
    var booking = Database.findById(TABLES.BOOKINGS, 'Booking ID', bookingId, businessId);
    if (!booking) throw new Error('Booking not found.');

    var updated = Database.update(TABLES.BOOKINGS, 'Booking ID', bookingId, updates, businessId);
    AuditLogs.log(businessId, user.userId, 'BOOKING_UPDATED', 'BOOKINGS', { bookingId: bookingId, fields: Object.keys(updates) });
    return updated;
  }

  return {
    createBooking: createBooking,
    getBookings: getBookings,
    updateBooking: updateBooking
  };
})();
