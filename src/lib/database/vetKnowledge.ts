export interface DiseaseInfo {
  id: string;
  name: {
    en: string;
    hi: string;
  };
  symptoms: {
    en: string[];
    hi: string[];
  };
  description: {
    en: string;
    hi: string;
  };
  treatment: {
    en: string;
    hi: string;
  };
  prevention: {
    en: string;
    hi: string;
  };
  severity: 'low' | 'medium' | 'high';
  commonIn: string[];
  requiresImmediate: boolean;
}

export const diseases: DiseaseInfo[] = [
  {
    id: 'mastitis',
    name: {
      en: 'Mastitis',
      hi: 'स्तनप्रदाह'
    },
    symptoms: {
      en: ['Swollen udder', 'Heat and pain in udder', 'Decreased milk production', 'Abnormal milk'],
      hi: ['थनों में सूजन', 'थनों में गर्मी और दर्द', 'दुग्ध उत्पादन में कमी', 'असामान्य दूध']
    },
    description: {
      en: 'Inflammation of the mammary gland tissue, which may be caused by infection or physical injury.',
      hi: 'स्तन ग्रंथि ऊतक की सूजन, जो संक्रमण या शारीरिक चोट के कारण हो सकती है।'
    },
    treatment: {
      en: 'Antibiotic therapy, anti-inflammatory drugs, proper milking hygiene',
      hi: 'एंटीबायोटिक थेरेपी, एंटी-इन्फ्लेमेटरी दवाएं, उचित दुग्ध स्वच्छता'
    },
    prevention: {
      en: 'Clean milking equipment, proper udder hygiene, regular health checks',
      hi: 'स्वच्छ दुग्ध उपकरण, उचित थन स्वच्छता, नियमित स्वास्थ्य जांच'
    },
    severity: 'high',
    commonIn: ['cattle', 'buffalo'],
    requiresImmediate: true
  }
  // Add more diseases here
];

export interface FirstAidInfo {
  id: string;
  condition: {
    en: string;
    hi: string;
  };
  steps: {
    en: string[];
    hi: string[];
  };
  warnings: {
    en: string[];
    hi: string[];
  };
  emergency: boolean;
}

export const firstAid: FirstAidInfo[] = [
  {
    id: 'bleeding',
    condition: {
      en: 'Minor Bleeding',
      hi: 'मामूली रक्तस्राव'
    },
    steps: {
      en: [
        'Apply direct pressure with clean cloth',
        'Elevate the wound if possible',
        'Keep the animal calm'
      ],
      hi: [
        'साफ कपड़े से सीधा दबाव डालें',
        'यदि संभव हो तो घाव को ऊपर उठाएं',
        'जानवर को शांत रखें'
      ]
    },
    warnings: {
      en: ['Do not use tourniquets unless trained', 'Seek immediate vet care'],
      hi: ['प्रशिक्षित न होने पर टूर्निकेट का उपयोग न करें', 'तुरंत पशु चिकित्सक की सलाह लें']
    },
    emergency: true
  }
  // Add more first aid information
];
