export type Locale = 'bn' | 'en';

export const translations = {
  bn: {
    appName: 'জমিটেক',
    appTagline: 'ভূমি রেকর্ড যাচাই ও ঝুঁকি গোয়েন্দা ব্যবস্থা',
    demoNotice: 'ডেমো ডেটা — সরকারি রেকর্ড নয়',
    demoNoticeLong: 'এটি একটি গবেষণা ও প্রদর্শনী প্রোটোটাইপ। সকল রেকর্ড কাল্পনিক সিন্থেটিক ডেটা। কোনো সরকারি পোর্টাল থেকে স্ক্র্যাপ করা বা অফিশিয়াল ডেটা নয়।',
    
    // Navigation
    nav: {
      overview: 'সারসংক্ষেপ',
      search: 'জমি অনুসন্ধান',
      buyerReport: 'ক্রয়ের পূর্বে যাচাই',
      verifyQr: 'কিউআর যাচাই',
      trackMutation: 'নামজারি ট্র্যাকার',
      help: 'সাহায্য ও নির্দেশিকা',
      staffDashboard: 'কর্মকর্তা ড্যাশবোর্ড',
      upload: 'রেকর্ড আপলোড ও ডিজিটাইজেশন',
      reviewQueue: 'ওসিআর যাচাই কিউ',
      records: 'অনুমোদিত খতিয়ান রেকর্ড',
      riskAlerts: 'ঝুঁকি সতর্কতা কেন্দ্র',
      mutationCases: 'নামজারি নথি ব্যবস্থাপনা',
      archive: 'সংরক্ষণাগার তল্লাশি',
      audit: 'অডিট ও লগ পরিদর্শন',
      admin: 'সিস্টেম অ্যাডমিন',
      settings: 'সেটিংস',
      login: 'লগইন',
      logout: 'লগআউট',
    },

    // Roles
    roles: {
      citizen: 'নাগরিক / ক্রেতা',
      data_entry: 'ডেটা এন্ট্রি সহকারী',
      reviewer: 'ওসিআর যাচাইকারী কর্মকর্তা',
      officer: 'ভূমি সহকারী কর্মকর্তা',
      admin: 'সিস্টেম প্রশাসক',
    },

    // Land Administration Terminology
    land: {
      parcelId: 'পার্সেল আইডি',
      division: 'বিভাগ',
      district: 'জেলা',
      upazila: 'উপজেলা / থানা',
      mouza: 'মৌজা',
      jlNo: 'জেএল নম্বর',
      khatianNo: 'খতিয়ান নম্বর',
      dagNo: 'দাগ নম্বর',
      surveyType: 'সার্ভে ধরন',
      area: 'জমির পরিমাণ',
      unit: 'একক',
      decimal: 'শতক',
      acre: 'একর',
      katha: 'কাঠা',
      share: 'মালিকানা অংশ (আনা / ভগ্নাংশ)',
      owners: 'রেকর্ডীয় মালিকগণ',
      deeds: 'দলিলসমূহ',
      transfers: 'মালিকানা হস্তান্তর ইতিহাস',
      currentHolder: 'বর্তমান রেকর্ডীয় দখলদার',
      mutationStatus: 'নামজারি স্থিতি',
      chainOfTitle: 'মালিকানা ধারাবাহিকতা',
    },

    // Surveys
    surveys: {
      CS: 'সিএস (Cadastral Survey)',
      SA: 'এসএ (State Acquisition)',
      RS: 'আরএস (Revisional Survey)',
      BS: 'বিএস (Bangladesh Survey / City Survey)',
    },

    // Risk Engine
    risk: {
      title: 'ঝুঁকি বিশ্লেষণ ও অসঙ্গতি পর্যবেক্ষণ',
      score: 'ঝুঁকি সূচক স্কোর',
      low: 'স্বাভাবিক / নিম্ন ঝুঁকি',
      medium: 'মাঝারি ঝুঁকি (নথি যাচাই প্রয়োজন)',
      high: 'উচ্চ ঝুঁকি (অগ্রাধিকারভিত্তিক তদন্ত আবশ্যক)',
      whyAlert: 'কেন এই সতর্কতা?',
      evidence: 'চিহ্নিত প্রমাণ ও নথিপত্র',
      recommendedAction: 'প্রস্তাবিত পদক্ষেপ',
      limitationNotice: 'সতর্কতা: এই সূচক কোনো আইনি মতামত বা প্রতারণার চূড়ান্ত প্রমাণ নয়। এটি কেবলমাত্র তথ্যের অসঙ্গতি নির্দেশ করে যা একজন পেশাদার বা সংশ্লিষ্ট ভূমি অফিসে যাচাই আবশ্যক।',
      ruleCodes: {
        POSSIBLE_DOUBLE_SALE: 'সম্ভাব্য দ্বৈত বিক্রয় / একই দাগে সমাপতিত হস্তান্তর',
        SELLER_MISMATCH: 'বিক্রেতা ও সর্বশেষ রেকর্ডীয় মালিকের তথ্যে অমিল',
        DUPLICATE_DEED: 'একই দলিল নম্বর বা ফাইলের ডুপ্লিকেট নিবন্ধন রেকর্ড',
        AREA_OR_SHARE_EXCEEDED: 'মালিকানাধীন অংশের অতিরিক্ত জমি হস্তান্তর',
        REGISTERED_NOT_MUTATED: 'দলিল রেজিস্ট্রি হলেও সময়মতো নামজারি হয়নি',
        MUTATION_PARTY_MISMATCH: 'নামজারি আবেদনকারী ও দলিলের গ্রহীতার নাম অমিল',
        REGISTRATION_MUTATION_MISMATCH: 'রেজিস্ট্রি ও নামজারি রেকর্ডের মধ্যে গরমিল',
        RAPID_RESALE: 'অস্বাভাবিক দ্রুত পুনঃবিক্রয়',
        IMPOSSIBLE_DATE: 'কালানুক্রমিক অসঙ্গতি বা ভবিষ্যৎ তারিখ',
        DEED_NO_FORMAT_INVALID: 'দলিল নম্বর বিন্যাসে ত্রুটি',
        SURVEY_CHAIN_GAP: 'খতিয়ান ধারাবাহিকতায় বিচ্ছিন্নতা (Predecessor Link Gap)',
        ACTIVE_DISPUTE: 'বিবাদমান জমি সংক্রান্ত নোটিশ',
        KHAS_INDICATOR: 'সরকারি খাস বা অর্পিত সম্পত্তি নির্দেশক',
        ACQUISITION_INDICATOR: 'সরকারি অধিগ্রহণ প্রক্রিয়াধীন সম্পত্তি',
        LOW_OCR_CONFIDENCE: 'ওসিআর পাঠোদ্ধারে নিম্ন নির্ভুলতা (স্বয়ংক্রিয় পোস্টিং স্থগিত)',
      }
    },

    // Actions
    actions: {
      search: 'অনুসন্ধান করুন',
      reset: 'রিসেট',
      clear: 'মুছুন',
      filter: 'ফিল্টার',
      viewDetails: 'বিস্তারিত দেখুন',
      generateReport: 'ক্রেতার যাচাই প্রতিবেদন',
      downloadPdf: 'প্রতিবেদন প্রিন্ট / সংরক্ষণ',
      approve: 'অনুমোদন করুন',
      reject: 'প্রত্যাখ্যান করুন',
      edit: 'সংশোধন করুন',
      save: 'সংরক্ষণ',
      cancel: 'বাতিল',
      uploadDoc: 'দলিল আপলোড করুন',
      verifyCopy: 'কপির বিশুদ্ধতা যাচাই',
      switchUser: 'ডেমো ব্যবহারকারী পরিবর্তন',
      unknown: 'অজানা / তথ্যের অভাব',
    },

    // Settings
    settings: {
      title: 'অ্যাপ্লিকেশন সেটিংস',
      language: 'ভাষা নির্বাচন (Language)',
      theme: 'থিম (Theme)',
      light: 'লাইট মোড (Light)',
      dark: 'ডার্ক মোড (Dark)',
      fontSize: 'ফন্ট সাইজ (Font Size)',
      small: 'ছোট (Small)',
      defaultSize: 'স্বাভাবিক (Default)',
      large: 'বড় (Large)',
      xlarge: 'অতিরিক্ত বড় (Extra Large)',
      numerals: 'সংখ্যার ধরণ (Numerals)',
      bengaliNumerals: 'বাংলা সংখ্যা (১২৩৪৫)',
      englishNumerals: 'ইংরেজি সংখ্যা (12345)',
    },

    // Verification
    verify: {
      title: 'দলিল ও ডিজিটাল রসিদ যাচাই',
      enterHash: 'নথির SHA-256 হ্যাশ বা কিউআর কোড দিন',
      uploadToCheck: 'মূল ফাইলের কপি আপলোড করে মেলাতে চান?',
      statusValid: 'ডিজিটালভাবে স্বাক্ষরিত ও অপরিবর্তিত',
      statusTampered: 'হ্যাশ মেলেনি — নথির পরিবর্তন বা অসঙ্গতি হতে পারে',
      statusRevoked: 'রসিদ বাতিলকৃত (Revoked)',
      statusUnknown: 'কোনো অনুমোদিত নথির সাথে হুবহু মিল পাওয়া যায়নি',
      privacyNotice: 'নাগরিকের ব্যক্তিগত তথ্যের সুরক্ষায় এই যাচাই পাতায় কেবল ক্রিপ্টোগ্রাফিক সত্যতা ও ইস্যুর তারিখ প্রদর্শিত হয়, কোনো ব্যক্তিগত তথ্য সংরক্ষিত বা প্রদর্শিত হয় না।',
    },

    // Mutation
    mutation: {
      caseNo: 'নামজারি কেস নম্বর',
      applicant: 'আবেদনকারী',
      status: 'বর্তমান ধাপ',
      stages: {
        DRAFT: 'খসড়া আবেদন',
        SUBMITTED: 'দাখিলকৃত',
        FIELD_INVESTIGATION: 'তদন্ত পর্যায় (ইউনিয়ন ভূমি উপ-সহকারী)',
        HEARING_SCHEDULED: 'শুনানি নির্ধারিত',
        DOCUMENT_CHECK: 'কাগজপত্র যাচাইধীন',
        OFFICER_REVIEW: 'সহকারী কমিশনার (ভূমি) পর্যালোচনা',
        HEARING: 'শুনানি পর্যায়',
        DECISION_RECORDED: 'আদেশ লিপিবদ্ধ',
        APPROVED: 'নামজারি মঞ্জুর ও খতিয়ান সৃজিত',
        COMPLETED: 'নামজারি সম্পন্ন ও খতিয়ান সৃজিত',
        REJECTED: 'নামজারি না-মঞ্জুর',
        NEEDS_CORRECTION: 'সংশোধন আবশ্যক',
      },
      simulationWarning: 'সতর্কতা: এটি সিমুলেটেড ওয়ার্কফ্লো — এটি কোনো সরকারি সিস্টেমে দাখিল হয়নি।',
    }
  },

  en: {
    appName: 'JomiTech',
    appTagline: 'Land Record Verification & Risk Intelligence System',
    demoNotice: 'DEMO DATA — NOT AN OFFICIAL GOVERNMENT RECORD',
    demoNoticeLong: 'This is a research & demonstration prototype. All records, parcels, and deeds are synthetic fictional data. No government portals are scraped or queried.',

    // Navigation
    nav: {
      overview: 'Overview',
      search: 'Parcel Search',
      buyerReport: 'Check Before Buying',
      verifyQr: 'Verify QR Receipt',
      trackMutation: 'Track Mutation',
      help: 'Help & Docs',
      staffDashboard: 'Officer Dashboard',
      upload: 'Upload & Digitize',
      reviewQueue: 'OCR Review Queue',
      records: 'Approved Khatians',
      riskAlerts: 'Risk Alert Center',
      mutationCases: 'Mutation Cases',
      archive: 'Archive Search',
      audit: 'Audit Log',
      admin: 'System Admin',
      settings: 'Settings',
      login: 'Login',
      logout: 'Logout',
    },

    // Roles
    roles: {
      citizen: 'Citizen / Buyer',
      data_entry: 'Data Entry Officer',
      reviewer: 'OCR Reviewer',
      officer: 'Land Office Officer',
      admin: 'System Administrator',
    },

    // Land Administration Terminology
    land: {
      parcelId: 'Parcel ID',
      division: 'Division',
      district: 'District',
      upazila: 'Upazila / Thana',
      mouza: 'Mouza',
      jlNo: 'J.L. No.',
      khatianNo: 'Khatian No.',
      dagNo: 'Dag / Plot No.',
      surveyType: 'Survey Type',
      area: 'Land Area',
      unit: 'Unit',
      decimal: 'Decimal (Shotok)',
      acre: 'Acre',
      katha: 'Katha',
      share: 'Ownership Share (Fraction/Ana)',
      owners: 'Recorded Owners',
      deeds: 'Deeds & Instruments',
      transfers: 'Transfer History',
      currentHolder: 'Latest Recorded Holder',
      mutationStatus: 'Mutation Status',
      chainOfTitle: 'Chain of Title',
    },

    // Surveys
    surveys: {
      CS: 'CS (Cadastral Survey)',
      SA: 'SA (State Acquisition)',
      RS: 'RS (Revisional Survey)',
      BS: 'BS (Bangladesh Survey / City Survey)',
    },

    // Risk Engine
    risk: {
      title: 'Risk Intelligence & Discrepancy Analysis',
      score: 'Risk Assessment Score',
      low: 'Low Risk / Clean Chain',
      medium: 'Medium Risk (Verification Advised)',
      high: 'High Risk (Priority Review Required)',
      whyAlert: 'Why This Alert?',
      evidence: 'Identified Evidence & Discrepancies',
      recommendedAction: 'Recommended Human Action',
      limitationNotice: 'Notice: This indicator does not constitute legal title certification or proof of fraud. It highlights record discrepancies that require official verification with the Sub-Registry or AC Land office.',
      ruleCodes: {
        POSSIBLE_DOUBLE_SALE: 'Possible Double-Sale / Overlapping Active Transfers',
        SELLER_MISMATCH: 'Seller Inconsistent with Latest Reviewed Recorded Holder',
        DUPLICATE_DEED: 'Duplicate Deed Reference or Identical Hash Record',
        AREA_OR_SHARE_EXCEEDED: 'Transfer Exceeds Available Share or Parcel Area',
        REGISTERED_NOT_MUTATED: 'Registered Deed with No Corresponding Mutation Record',
        MUTATION_PARTY_MISMATCH: 'Mutation Applicant Differs from Deed Buyer',
        REGISTRATION_MUTATION_MISMATCH: 'Discrepancy Between Registry and Mutation Records',
        RAPID_RESALE: 'Rapid Re-conveyance Interval Flag',
        IMPOSSIBLE_DATE: 'Chronological Impossibility or Future Date',
        DEED_NO_FORMAT_INVALID: 'Invalid Deed Reference Format',
        SURVEY_CHAIN_GAP: 'Missing Predecessor Link in Survey Chain (Gap)',
        ACTIVE_DISPUTE: 'Synthetic Active Title Dispute Notice',
        KHAS_INDICATOR: 'Government Khas or Vested Property Flag',
        ACQUISITION_INDICATOR: 'Property Under Acquisition Notice',
        LOW_OCR_CONFIDENCE: 'Low OCR Field Confidence (Automatic Posting Blocked)',
      }
    },

    // Actions
    actions: {
      search: 'Search Records',
      reset: 'Reset',
      clear: 'Clear',
      filter: 'Filter',
      viewDetails: 'View Details',
      generateReport: 'Buyer Due Diligence Report',
      downloadPdf: 'Print / Save Report',
      approve: 'Approve & Post',
      reject: 'Reject',
      edit: 'Correct Field',
      save: 'Save Changes',
      cancel: 'Cancel',
      uploadDoc: 'Upload Synthetic Deed',
      verifyCopy: 'Verify Document Integrity',
      switchUser: 'Switch Demo User',
      unknown: 'Unknown / Information Missing',
    },

    // Settings
    settings: {
      title: 'Application Settings',
      language: 'Language Selection',
      theme: 'Theme Mode',
      light: 'Light Mode',
      dark: 'Dark Mode',
      fontSize: 'Global Font Size',
      small: 'Small',
      defaultSize: 'Default',
      large: 'Large',
      xlarge: 'Extra Large',
      numerals: 'Numeral System',
      bengaliNumerals: 'Bengali Numerals (১২৩৪৫)',
      englishNumerals: 'English Numerals (12345)',
    },

    // Verification
    verify: {
      title: 'Document & Digital Receipt Verification',
      enterHash: 'Enter SHA-256 Hash or Opaque QR Receipt ID',
      uploadToCheck: 'Upload a copy to test byte-level integrity',
      statusValid: 'Cryptographically Signed & Unaltered',
      statusTampered: 'Hash Mismatch — Potential alteration or non-matching file',
      statusRevoked: 'Receipt Revoked',
      statusUnknown: 'No exact match found in approved synthetic repository',
      privacyNotice: 'To protect citizen privacy, this public verification interface only returns cryptographic integrity status and issue date. No personal or owner data is disclosed.',
    },

    // Mutation
    mutation: {
      caseNo: 'Mutation Case No.',
      applicant: 'Applicant',
      status: 'Current Stage',
      stages: {
        DRAFT: 'Draft Application',
        SUBMITTED: 'Submitted',
        FIELD_INVESTIGATION: 'Field Investigation (Union Sub-Assistant)',
        HEARING_SCHEDULED: 'Hearing Scheduled',
        DOCUMENT_CHECK: 'Document Verification',
        OFFICER_REVIEW: 'Assistant Commissioner (Land) Review',
        HEARING: 'Hearing Stage (Optional)',
        DECISION_RECORDED: 'Decision Recorded',
        APPROVED: 'Mutation Approved & New Khatian Created',
        COMPLETED: 'Mutation Completed & New Khatian Created',
        REJECTED: 'Mutation Rejected',
        NEEDS_CORRECTION: 'Correction Required',
      },
      simulationWarning: 'Notice: This is a simulated workflow — not submitted to an official government office.',
    }
  }
};
