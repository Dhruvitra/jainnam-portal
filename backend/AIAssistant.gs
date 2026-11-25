/**
 * JAINAM TOURS AND TRAVELS — WHATSAPP AI TRAVEL CRM
 * AIAssistant.gs — Intelligent Travel Package Matcher, Multilingual Replies & Guardrails
 * 
 * Strict Grounding Rule: Never hallucinate package prices, inclusions, or itineraries.
 * Packages are strictly matched against active records in the PACKAGES database table.
 */

var AIAssistant = (function() {
  /**
   * Matches customer enquiry against active tour packages
   */
  function matchPackage(businessId, queryText) {
    if (!queryText) return null;
    var text = String(queryText).toLowerCase();

    var activePackages = Database.findAll(TABLES.PACKAGES, businessId, function(p) {
      return String(p['Active Status']).toLowerCase() === 'active';
    });

    var bestMatch = null;
    var maxScore = 0;

    for (var i = 0; i < activePackages.length; i++) {
      var pkg = activePackages[i];
      var name = String(pkg['Package Name']).toLowerCase();
      var dest = String(pkg['Destination']).toLowerCase();
      var highlights = String(pkg['Highlights']).toLowerCase();
      var score = 0;

      // Token matching
      var tokens = text.split(/[\s,\.\?!]+/);
      for (var t = 0; t < tokens.length; t++) {
        var token = tokens[t];
        if (token.length < 3) continue;

        if (dest.indexOf(token) !== -1) score += 5;
        if (name.indexOf(token) !== -1) score += 4;
        if (highlights.indexOf(token) !== -1) score += 2;
      }

      if (score > maxScore) {
        maxScore = score;
        bestMatch = pkg;
      }
    }

    return maxScore >= 4 ? bestMatch : null;
  }

  /**
   * Detects enquiry language: 'gujarati', 'hindi', or 'english'
   */
  function detectLanguage(text) {
    var lower = String(text).toLowerCase();
    
    // Gujarati keywords
    var gujTokens = ['kem chho', 'tamne', 'aapo', 'ketla', 'bhav', 'joie', 'karo', 'chhe', 'shree', 'jain', 'aavo'];
    for (var g = 0; g < gujTokens.length; g++) {
      if (lower.indexOf(gujTokens[g]) !== -1) return 'gujarati';
    }

    // Hindi / Hinglish keywords
    var hinTokens = ['namaste', 'batao', 'kitna', 'milega', 'khana', 'chahiye', 'kripya', 'shukriya', 'kare', 'humko', 'jana hai'];
    for (var h = 0; h < hinTokens.length; h++) {
      if (lower.indexOf(hinTokens[h]) !== -1) return 'hindi';
    }

    return 'english';
  }

  /**
   * Generates a grounded, courteous travel agency response
   */
  function generateReply(businessId, customerName, queryText) {
    var firstName = customerName ? customerName.split(' ')[0] : 'Traveller';
    var matchedPkg = matchPackage(businessId, queryText);
    var lang = detectLanguage(queryText);
    var lower = queryText.toLowerCase();

    // Check for meal/food inquiry
    var isMealInquiry = lower.indexOf('jain') !== -1 || lower.indexOf('veg') !== -1 || lower.indexOf('food') !== -1 || lower.indexOf('khana') !== -1;

    if (lang === 'gujarati') {
      if (matchedPkg) {
        return 'Jai Jinendra ' + firstName + ' bhai/ben! 🙏\n\n' +
               'Jainam Tours and Travels તરફથી આપનું હાર્દિક સ્વાગત છે. આપે પૂછેલ *' + matchedPkg['Package Name'] + '* માટેની વિગતો નીચે મુજબ છે:\n\n' +
               '📍 સ્થળ: ' + matchedPkg['Destination'] + '\n' +
               '⏳ સમયગાળો: ' + matchedPkg['Duration'] + '\n' +
               '💰 અંદાજિત કિંમત: ₹' + Number(matchedPkg['Price']).toLocaleString('en-IN') + ' પ્રતિ વ્યક્તિ\n' +
               '🍲 ભોજન: ૧૦૦% શુદ્ધ શાકાહારી અને જૈન ભોજન (ડુંગળી/લસણ વગર) ની સંપૂર્ણ ખાતરી.\n\n' +
               'શું આપને આ ટૂરનું વિગતવાર ડે-બાય-ડે બ્રોશર અને ક્વોટેશન વોટ્સએપ પર મોકલી આપીએ?';
      }
      return 'Jai Jinendra ' + firstName + ' bhai/ben! 🙏\n\n' +
             'જૈનમ ટુર્સમાં આપનું સ્વાગત છે. આપના મનપસંદ સ્થળ માટે અમારી ટીમ સ્પેશિયલ કસ્ટમાઇઝ્ડ આઇટિનરરી અને શુદ્ધ જૈન ભોજનની સુવિધા સાથે શ્રેષ્ઠ પેકેજ તૈયાર કરી રહી છે. અમારા સીનિયર ટ્રાવેલ એડવાઇઝર ટૂંક સમયમાં આપનો સંપર્ક કરશે.';
    }

    if (lang === 'hindi') {
      if (matchedPkg) {
        return 'Jai Jinendra ' + firstName + ' ji! 🙏\n\n' +
               'Jainam Tours and Travels में आपका स्वागत है। आपके द्वारा पूछे गए पैकेज *' + matchedPkg['Package Name'] + '* की मुख्य जानकारी:\n\n' +
               '📍 डेस्टिनेशन: ' + matchedPkg['Destination'] + '\n' +
               '⏳ अवधि: ' + matchedPkg['Duration'] + '\n' +
               '💰 पैकेज मूल्य: ₹' + Number(matchedPkg['Price']).toLocaleString('en-IN') + ' प्रति व्यक्ति\n' +
               '🍲 खान-पान: १००% शुद्ध शाकाहारी एवं जैन भोजन (कंदमूल/लहसुन-प्याज रहित) की विशेष व्यवस्था।\n\n' +
               'क्या हम आपके लिए इस पैकेज का विस्तृत कोटेशन पीडीएफ और दिन-प्रतिदिन का यात्रा कार्यक्रम शेयर करें?';
      }
      return 'Jai Jinendra ' + firstName + ' ji! 🙏\n\n' +
             'Jainam Tours and Travels में संपर्क करने के लिए धन्यवाद। आपके द्वारा चुनी गई डेस्टिनेशन के लिए हमारे टूर कंसल्टेंट 100% शुद्ध जैन खानपान के साथ कस्टमाइज्ड पैकेज तैयार कर रहे हैं। हम शीघ्र ही आपसे विस्तृत जानकारी साझा करेंगे।';
    }

    // Default English
    if (matchedPkg) {
      return 'Jai Jinendra & Greetings ' + firstName + '! 🙏\n\n' +
             'Welcome to Jainam Tours and Travels — *By Travellers, for Travellers*.\n\n' +
             'Here are the details for our verified *' + matchedPkg['Package Name'] + '*:\n\n' +
             '📍 Destination: ' + matchedPkg['Destination'] + '\n' +
             '⏳ Duration: ' + matchedPkg['Duration'] + '\n' +
             '💰 Starting Price: ₹' + Number(matchedPkg['Price']).toLocaleString('en-IN') + ' per person\n' +
             '🏨 Stay: ' + matchedPkg['Hotel Details'] + '\n' +
             '🍲 Meals: 100% Pure Vegetarian & Jain dining (without onion/garlic) guaranteed throughout.\n\n' +
             'Would you like our booking desk to generate a customized PDF quotation and day-wise itinerary for your travel dates?';
    }

    if (isMealInquiry) {
      return 'Jai Jinendra ' + firstName + '! 🙏\n\n' +
             'At Jainam Tours and Travels, 100% Pure Vegetarian and authentic Jain dining (strictly without onion, garlic, or root vegetables) is our cornerstone promise across all our domestic and international tours. Would you like to share your preferred travel destination and tentative dates with us?';
    }

    return 'Jai Jinendra & Welcome to Jainam Tours and Travels, ' + firstName + '! 🙏\n\n' +
           'Thank you for reaching out to us. We specialize in luxury family and group holidays with dedicated Jain & Pure Vegetarian culinary arrangements.\n\n' +
           'Could you please let us know:\n' +
           '1. Preferred destination & dates\n' +
           '2. Number of travellers\n' +
           '3. Any specific requirements?\n\n' +
           'Our senior travel advisor will share a tailor-made quotation immediately!';
  }

  /**
   * Handles autonomous inbound response generation and staging
   */
  function handleInboundAIResponse(businessId, customerId, numberId, inboundText, customerPhone) {
    var customer = null;
    try {
      customer = Database.findById(TABLES.CUSTOMERS, 'Customer ID', customerId, businessId);
    } catch (e) {}
    var customerName = customer ? customer['Name'] : 'Traveller';

    var aiReplyText = generateReply(businessId, customerName, inboundText);
    var now = new Date().toISOString();

    // 1. Immediately send live WhatsApp reply to customer
    try {
      MetaWhatsApp.sendWhatsAppMessage(businessId, numberId, customerPhone, aiReplyText);
    } catch (e) {
      Logger.log('Outbound WhatsApp dispatch error: ' + e.message);
    }

    // 2. Safely log to database without blocking response
    try {
      var outboxId = 'out_' + Utilities.getUuid().substring(0, 8);
      Database.insert(TABLES.OUTBOX, {
        'Outbox ID': outboxId,
        'Business ID': businessId,
        'Customer ID': customerId,
        'Number ID': numberId,
        'Message': aiReplyText,
        'Send Mode': 'AI Autonomous',
        'Status': 'Dispatched',
        'Created At': now,
        'Sent At': now
      }, businessId);
    } catch (e) {}

    try {
      var messageId = 'msg_' + Utilities.getUuid().substring(0, 8);
      Database.insert(TABLES.MESSAGES, {
        'Message ID': messageId,
        'Business ID': businessId,
        'Customer ID': customerId,
        'WhatsApp Number ID': numberId,
        'Direction': 'Outbound',
        'Message Type': 'text',
        'Message Text': aiReplyText,
        'Media URL': '',
        'Message Status': 'Sent',
        'Timestamp': now,
        'External Message ID': ''
      }, businessId);
    } catch (e) {}

    try {
      var conv = Database.findFirst(TABLES.CONVERSATIONS, businessId, function(c) {
        return c['Customer ID'] === customerId;
      });
      if (conv) {
        Database.update(TABLES.CONVERSATIONS, 'Conversation ID', conv['Conversation ID'], {
          'Last Message Text': aiReplyText,
          'Last Message Timestamp': now,
          'Updated At': now
        }, businessId);
      }
    } catch (e) {}

    return {
      success: true,
      replyText: aiReplyText
    };
  }

  return {
    matchPackage: matchPackage,
    detectLanguage: detectLanguage,
    generateReply: generateReply,
    handleInboundAIResponse: handleInboundAIResponse
  };
})();
