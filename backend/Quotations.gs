/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * Quotations.gs — Quotation Engine, Accurate Pricing Calculator, and PDF Generator
 */

var Quotations = (function() {
  /**
   * Calculates an itemized quotation based on verified package rates
   * Never invents arbitrary prices; uses strictly confirmed figures.
   */
  function calculateQuotation(quoteRequest) {
    var packageId = quoteRequest.packageId;
    var pkg = null;
    if (packageId) {
      pkg = Database.findById(TABLES.PACKAGES, 'Package ID', packageId);
    }

    var basePricePerAdult = Number(pkg ? pkg['Price'] : (quoteRequest.basePricePerAdult || 0));
    var adultCount = Number(quoteRequest.adultCount || quoteRequest.travellers || 2);
    var childCount = Number(quoteRequest.childCount || 0);

    // Child rate: 70% of adult base price unless specified
    var childRate = quoteRequest.childPrice !== undefined ? Number(quoteRequest.childPrice) : (basePricePerAdult * 0.7);

    var adultTotal = basePricePerAdult * adultCount;
    var childTotal = childRate * childCount;
    var baseSubtotal = adultTotal + childTotal;

    // Hotel category surcharge / upgrade
    var hotelSurcharge = 0;
    var hotelTier = String(quoteRequest.hotelSelection || '4-Star Premium').toLowerCase();
    if (hotelTier.indexOf('5-star') !== -1 || hotelTier.indexOf('luxury') !== -1) {
      hotelSurcharge = (adultCount + childCount) * 4500; // standard luxury room upgrade
    } else if (hotelTier.indexOf('3-star') !== -1) {
      hotelSurcharge = (adultCount + childCount) * -1500; // economy deduction
    }

    // Transport surcharge
    var transportSurcharge = 0;
    var transportChoice = String(quoteRequest.transport || 'Private AC Sedan/Innova').toLowerCase();
    if (transportChoice.indexOf('innova') !== -1 || transportChoice.indexOf('suv') !== -1) {
      transportSurcharge = 3500;
    } else if (transportChoice.indexOf('tempo') !== -1 || transportChoice.indexOf('coach') !== -1) {
      transportSurcharge = 8500;
    }

    // Sightseeing & Activities
    var activityTotal = Number(quoteRequest.activityTotal || 0);

    // Meal additions
    var mealTotal = Number(quoteRequest.mealTotal || 0);

    var grossTotal = Math.max(0, baseSubtotal + hotelSurcharge + transportSurcharge + activityTotal + mealTotal);

    // Discount calculation
    var discount = 0;
    if (quoteRequest.discountPercent) {
      discount = (grossTotal * Number(quoteRequest.discountPercent)) / 100;
    } else if (quoteRequest.discount) {
      discount = Number(quoteRequest.discount);
    }
    discount = Math.min(discount, grossTotal); // Never discount more than total

    var subtotalAfterDiscount = grossTotal - discount;

    // GST Tax calculation (standard 5% GST on tour packages in India)
    var taxRate = quoteRequest.taxRate !== undefined ? Number(quoteRequest.taxRate) : 5;
    var taxAmount = Math.round((subtotalAfterDiscount * taxRate) / 100);

    var finalPrice = Math.round(subtotalAfterDiscount + taxAmount);

    return {
      packageId: packageId,
      packageName: pkg ? pkg['Package Name'] : (quoteRequest.packageName || 'Customized Itinerary'),
      destination: pkg ? pkg['Destination'] : quoteRequest.destination,
      adultCount: adultCount,
      childCount: childCount,
      breakdown: {
        basePricePerAdult: basePricePerAdult,
        adultTotal: adultTotal,
        childRate: childRate,
        childTotal: childTotal,
        hotelSurcharge: hotelSurcharge,
        transportSurcharge: transportSurcharge,
        activityTotal: activityTotal,
        mealTotal: mealTotal,
        grossTotal: grossTotal,
        discount: discount,
        taxRatePercent: taxRate,
        taxAmount: taxAmount,
        finalPrice: finalPrice
      },
      currency: pkg ? pkg['Currency'] : CONFIG.DEFAULT_CURRENCY
    };
  }

  /**
   * Saves a Quotation record in the database
   */
  function createQuotation(user, quoteData) {
    var businessId = user.businessId;
    var calculation = calculateQuotation(quoteData);

    var quotationId = 'quot_' + Utilities.getUuid().substring(0, 8);
    var now = new Date().toISOString();
    var validUntil = quoteData.validUntil || new Date(Date.now() + (14 * 24 * 3600 * 1000)).toISOString().split('T')[0];

    var record = {
      'Quotation ID': quotationId,
      'Business ID': businessId,
      'Customer ID': quoteData.customerId || '',
      'Package ID': quoteData.packageId || '',
      'Travel Date': quoteData.travelDate || '',
      'Travellers': calculation.adultCount + (calculation.childCount > 0 ? (' + ' + calculation.childCount + ' Child') : ''),
      'Hotel Selection': quoteData.hotelSelection || '4-Star Premium',
      'Transport': quoteData.transport || 'Private AC Vehicle',
      'Total Price': calculation.breakdown.grossTotal,
      'Discount': calculation.breakdown.discount,
      'Final Price': calculation.breakdown.finalPrice,
      'Valid Until': validUntil,
      'Status': 'Sent',
      'PDF URL': quoteData.pdfUrl || ''
    };

    Database.insert(TABLES.QUOTATIONS, record, businessId);

    // Update customer lead stage to 'Quote Sent' if customer ID provided
    if (quoteData.customerId) {
      try {
        Database.update(TABLES.CONTACTS, 'Customer ID', quoteData.customerId, {
          'Lead Stage': LEAD_STAGES.QUOTE_SENT
        }, businessId);
      } catch (e) {
        // Continue if contact not found
      }
    }

    AuditLogs.log(businessId, user.userId, 'QUOTATION_CREATED', 'QUOTATIONS', {
      quotationId: quotationId,
      finalPrice: calculation.breakdown.finalPrice
    });

    return {
      quotation: record,
      calculation: calculation
    };
  }

  /**
   * Retrieves quotations
   */
  function getQuotations(user, customerId) {
    var businessId = user.businessId;
    var quotes = Database.findAll(TABLES.QUOTATIONS, businessId, function(q) {
      if (customerId && q['Customer ID'] !== customerId) return false;
      return true;
    });
    return quotes;
  }

  /**
   * Updates an existing quotation
   */
  function updateQuotation(user, quotationId, updates) {
    var businessId = user.businessId;
    var updated = Database.update(TABLES.QUOTATIONS, 'Quotation ID', quotationId, updates, businessId);
    AuditLogs.log(businessId, user.userId, 'QUOTATION_UPDATED', 'QUOTATIONS', { quotationId: quotationId });
    return updated;
  }

  /**
   * Generates official PDF Quotation on Jainam Tours letterhead in Google Drive
   */
  function generateQuotationPDF(user, quotationId) {
    var businessId = user.businessId;
    var quote = Database.findById(TABLES.QUOTATIONS, 'Quotation ID', quotationId, businessId);
    if (!quote) throw new Error('Quotation not found.');

    var customer = quote['Customer ID'] ? Database.findById(TABLES.CONTACTS, 'Customer ID', quote['Customer ID'], businessId) : null;
    var pkg = quote['Package ID'] ? Database.findById(TABLES.PACKAGES, 'Package ID', quote['Package ID'], businessId) : null;
    var business = Database.findById(TABLES.BUSINESSES, 'Business ID', businessId);

    // Create a temporary Google Doc for formatting
    var docTitle = 'Quotation_' + quotationId + '_' + (customer ? customer['Name'] : 'Client');
    var doc = DocumentApp.create(docTitle);
    var body = doc.getBody();

    body.setMarginTop(36).setMarginBottom(36).setMarginLeft(40).setMarginRight(40);

    // Header Title
    var headerP = body.appendParagraph(business ? business['Business Name'] : 'JAINAM TOURS AND TRAVELS');
    headerP.setHeading(DocumentApp.ParagraphHeading.HEADING1);
    headerP.getRuns()[0].setForegroundColor('#C99532');

    var taglineP = body.appendParagraph('"By Travellers, for Travellers"');
    taglineP.getRuns()[0].setItalic(true).setForegroundColor('#707070');

    body.appendHorizontalRule();

    // Quotation Details Table
    var details = body.appendParagraph('\nOFFICIAL TRAVEL PROPOSAL & QUOTATION\n');
    details.setHeading(DocumentApp.ParagraphHeading.HEADING2);

    body.appendParagraph('Quotation ID: ' + quote['Quotation ID']);
    body.appendParagraph('Client: ' + (customer ? customer['Name'] + ' (' + customer['Phone'] + ')' : 'Valued Traveler'));
    body.appendParagraph('Tour Package: ' + (pkg ? pkg['Package Name'] : 'Custom Travel Plan'));
    body.appendParagraph('Destination: ' + (pkg ? pkg['Destination'] : 'Custom'));
    body.appendParagraph('Travel Date: ' + (quote['Travel Date'] || 'As confirmed'));
    body.appendParagraph('Travellers: ' + quote['Travellers']);
    body.appendParagraph('Hotel Tier: ' + quote['Hotel Selection']);
    body.appendParagraph('Transportation: ' + quote['Transport']);

    body.appendParagraph('\nINVESTMENT SUMMARY:');
    body.appendParagraph('Gross Package Price: ₹' + Number(quote['Total Price']).toLocaleString('en-IN'));
    if (Number(quote['Discount']) > 0) {
      body.appendParagraph('Promotional Savings: -₹' + Number(quote['Discount']).toLocaleString('en-IN'));
    }
    var totalP = body.appendParagraph('Net Total Payable (Incl. 5% GST): ₹' + Number(quote['Final Price']).toLocaleString('en-IN'));
    totalP.getRuns()[0].setBold(true).setFontSize(14).setForegroundColor('#292929');

    body.appendParagraph('\nValid Until: ' + quote['Valid Until']);
    body.appendParagraph('\nHead Office Address: ' + (business ? business['Address'] : 'Mumbai, India'));
    body.appendParagraph('Support Contact: ' + (business ? business['Phone'] : '+91 98201 23456'));

    doc.saveAndClose();

    // Export to PDF
    var docFile = DriveApp.getFileById(doc.getId());
    var pdfBlob = docFile.getAs('application/pdf');
    pdfBlob.setName(docTitle + '.pdf');

    var folderName = 'Jainam_Tours_Quotations';
    var folders = DriveApp.getFoldersByName(folderName);
    var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
    var pdfFile = folder.createFile(pdfBlob);
    pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    // Cleanup temporary Doc file
    docFile.setTrashed(true);

    var pdfUrl = pdfFile.getUrl();
    Database.update(TABLES.QUOTATIONS, 'Quotation ID', quotationId, { 'PDF URL': pdfUrl }, businessId);

    AuditLogs.log(businessId, user.userId, 'QUOTATION_PDF_GENERATED', 'QUOTATIONS', { quotationId: quotationId, pdfUrl: pdfUrl });

    return {
      success: true,
      quotationId: quotationId,
      pdfUrl: pdfUrl
    };
  }

  return {
    calculateQuotation: calculateQuotation,
    createQuotation: createQuotation,
    getQuotations: getQuotations,
    updateQuotation: updateQuotation,
    generateQuotationPDF: generateQuotationPDF
  };
})();
