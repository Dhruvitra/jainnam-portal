/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * Workflows.gs — Time-Driven Triggers & Automated Business Automations
 */

var Workflows = (function() {
  /**
   * Evaluates and updates lead qualification scores based on engagement
   */
  function processLeadQualification() {
    var customers = Database.findAll(TABLES.CONTACTS);
    var now = Date.now();

    for (var i = 0; i < customers.length; i++) {
      var cust = customers[i];
      var customerId = cust['Customer ID'];
      var businessId = cust['Business ID'];

      // If budget > 1,50,000 INR, mark as HOT lead
      var budget = Number(cust['Budget'] || 0);
      if (budget >= 150000 && cust['Lead Score'] !== LEAD_SCORES.HOT) {
        Database.update(TABLES.CONTACTS, 'Customer ID', customerId, {
          'Lead Score': LEAD_SCORES.HOT
        }, businessId);
      }
    }
  }

  /**
   * Checks for overdue client follow-ups and stages reminder notifications
   */
  function processFollowUpReminders() {
    var followups = Database.findAll(TABLES.FOLLOWUPS);
    var todayStr = new Date().toISOString().split('T')[0];

    for (var i = 0; i < followups.length; i++) {
      var item = followups[i];
      if (item['Status'] === 'Pending' && item['Scheduled Date'] <= todayStr) {
        Logger.log('Follow-up due for Customer ID: ' + item['Customer ID'] + ' (' + item['Message'] + ')');
        // Audit log reminder
        AuditLogs.log(item['Business ID'], 'SYSTEM_TRIGGER', 'FOLLOWUP_REMINDER_DUE', 'FOLLOWUPS', {
          followupId: item['Followup ID'],
          customerId: item['Customer ID']
        });
      }
    }
  }

  /**
   * Syncs confirmed travel departures to Google Calendar
   */
  function syncBookingsToCalendar() {
    try {
      var calendar = CalendarApp.getDefaultCalendar();
      if (!calendar) return;

      var bookings = Database.findAll(TABLES.BOOKINGS, null, function(b) {
        return b['Booking Status'] === 'Confirmed' && b['Travel Date'];
      });

      for (var i = 0; i < bookings.length; i++) {
        var b = bookings[i];
        var travelDate = new Date(b['Travel Date']);
        if (!isNaN(travelDate.getTime())) {
          var title = 'Tour Departure: Booking #' + b['Booking ID'];
          var existingEvents = calendar.getEventsForDay(travelDate, { search: b['Booking ID'] });
          if (existingEvents.length === 0) {
            calendar.createAllDayEvent(title, travelDate, {
              description: 'Customer: ' + b['Customer ID'] + '\nTotal: ₹' + b['Total Amount']
            });
          }
        }
      }
    } catch (e) {
      Logger.log('Google Calendar sync skipped: ' + e.message);
    }
  }

  return {
    processLeadQualification: processLeadQualification,
    processFollowUpReminders: processFollowUpReminders,
    syncBookingsToCalendar: syncBookingsToCalendar
  };
})();

/**
 * Apps Script Triggers Setup Helper
 * Call this function once to register daily automated triggers
 */
function setupAutomatedTriggers() {
  // Delete existing triggers to prevent duplicates
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }

  // Daily Morning Trigger (at 8:00 AM)
  ScriptApp.newTrigger('runDailyMorningWorkflow')
    .timeBased()
    .atHour(8)
    .everyDays(1)
    .create();

  Logger.log('Automated Daily Morning Workflow trigger configured for 8:00 AM.');
}

function runDailyMorningWorkflow() {
  Workflows.processLeadQualification();
  Workflows.processFollowUpReminders();
  Workflows.syncBookingsToCalendar();
}
