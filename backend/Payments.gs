/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * Payments.gs — Payment Transaction Ledger, Receipt Tracking & Balance Reconciliation
 */

var Payments = (function() {
  /**
   * Records a payment against a confirmed booking
   */
  function recordPayment(user, paymentData) {
    var businessId = user.businessId;
    var bookingId = paymentData.bookingId;
    var amount = Number(paymentData.amount || 0);

    if (!bookingId) {
      throw new Error('Booking ID is required to record a payment.');
    }
    if (amount <= 0) {
      throw new Error('Payment amount must be greater than zero.');
    }

    var booking = Database.findById(TABLES.BOOKINGS, 'Booking ID', bookingId, businessId);
    if (!booking) {
      throw new Error('Booking record not found.');
    }

    var paymentId = 'pay_' + Utilities.getUuid().substring(0, 8);
    var now = new Date().toISOString();

    var paymentRecord = {
      'Payment ID': paymentId,
      'Business ID': businessId,
      'Booking ID': bookingId,
      'Customer ID': booking['Customer ID'],
      'Amount': amount,
      'Payment Method': paymentData.paymentMethod || 'Bank Transfer (IMPS/NEFT)',
      'Transaction Ref': paymentData.transactionRef || ('TXN-' + Utilities.getUuid().substring(0, 6).toUpperCase()),
      'Receipt URL': paymentData.receiptUrl || '',
      'Payment Date': paymentData.paymentDate || now,
      'Recorded By': user.name || 'Jainam Shah',
      'Notes': paymentData.notes || ''
    };

    Database.insert(TABLES.PAYMENTS, paymentRecord, businessId);

    // Update Booking Balance & Status
    var currentPaid = Number(booking['Paid Amount'] || 0);
    var totalAmount = Number(booking['Total Amount'] || 0);
    var newPaid = currentPaid + amount;
    var newBalance = Math.max(0, totalAmount - newPaid);

    var paymentStatus = 'Unpaid';
    if (newBalance <= 0 && totalAmount > 0) {
      paymentStatus = 'Paid Full';
    } else if (newPaid > 0) {
      paymentStatus = 'Partial Deposit';
    }

    Database.update(TABLES.BOOKINGS, 'Booking ID', bookingId, {
      'Paid Amount': newPaid,
      'Balance': newBalance,
      'Payment Status': paymentStatus
    }, businessId);

    AuditLogs.log(businessId, user.userId, 'PAYMENT_RECORDED', 'PAYMENTS', {
      paymentId: paymentId,
      bookingId: bookingId,
      amount: amount,
      newBalance: newBalance
    });

    return {
      success: true,
      payment: paymentRecord,
      bookingBalance: newBalance,
      paymentStatus: paymentStatus
    };
  }

  /**
   * Retrieves all payments for a booking or business
   */
  function getPayments(user, bookingId) {
    var businessId = user.businessId;
    var payments = Database.findAll(TABLES.PAYMENTS, businessId, function(p) {
      if (bookingId && p['Booking ID'] !== bookingId) return false;
      return true;
    });

    payments.sort(function(a, b) {
      return new Date(b['Payment Date']).getTime() - new Date(a['Payment Date']).getTime();
    });

    return payments;
  }

  return {
    recordPayment: recordPayment,
    getPayments: getPayments
  };
})();
