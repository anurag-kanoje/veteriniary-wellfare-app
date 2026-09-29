import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'cg';

export interface Translation {
  [key: string]: string | Translation;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Translation> = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    animals: 'Animals',
    consultations: 'Consultations',
    community: 'Community',
    leaderboard: 'Leaderboard',
    profile: 'Profile',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    
    // Auth
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    phone: 'Phone',
    role: 'Role',
    farmer: 'Farmer',
    vet: 'Veterinarian',
    admin: 'Admin',
    
    // Rescue
    rescueReport: 'Animal Rescue Report',
    animalType: 'Animal Type',
    cow: 'Cow',
    dog: 'Dog',
    goat: 'Goat',
    other: 'Other',
    description: 'Description',
    location: 'Location',
    captureLocation: 'Capture Location',
    urgencyLevel: 'Urgency Level',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
    photos: 'Photos',
    gallery: 'Gallery',
    camera: 'Camera',
    contactPhone: 'Contact Phone',
    submitReport: 'Submit Report',
    reportSubmitted: 'Report Submitted',
    nearbyNGOsNotified: 'Nearby NGOs will be notified',
    
    // Disease Knowledge
    diseaseKnowledge: 'Disease Knowledge Base',
    symptoms: 'Symptoms',
    causes: 'Causes',
    firstAid: 'First Aid',
    whenToCallVet: 'When to Call Vet',
    prevention: 'Prevention',
    contagious: 'Contagious',
    recoveryTime: 'Recovery Time',
    
    // Tele-consultation
    teleConsultation: 'Tele-Consultation',
    title: 'Title',
    subject: 'Subject',
    detailedDescription: 'Detailed Description',
    preferredTime: 'Preferred Time',
    consultationRequest: 'Consultation Request',
    requestSubmitted: 'Request Submitted',
    vetWillContact: 'A vet will contact you soon',
    
    // Medicine
    medicineAvailability: 'Medicine Availability',
    medicines: 'Medicines',
    stores: 'Stores',
    pharmacy: 'Pharmacy',
    veterinaryClinic: 'Veterinary Clinic',
    ngo: 'NGO',
    gaushala: 'Gaushala',
    prescription: 'Prescription',
    price: 'Price',
    stock: 'Stock',
    delivery: 'Delivery',
    emergency: 'Emergency',
    verified: 'Verified',
    call: 'Call',
    directions: 'Directions',
    
    // Gaushala
    gaushalaAnimals: 'Gaushala Animals',
    addAnimal: 'Add Animal',
    animalName: 'Animal Name',
    tagNumber: 'Tag Number',
    breed: 'Breed',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    dateOfBirth: 'Date of Birth',
    dateOfArrival: 'Date of Arrival',
    healthStatus: 'Health Status',
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
    bull: 'Bull',
    
    // Medical Records
    medicalRecords: 'Medical Records',
    vaccination: 'Vaccination',
    treatment: 'Treatment',
    checkup: 'Checkup',
    medication: 'Medication',
    dosage: 'Dosage',
    frequency: 'Frequency',
    duration: 'Duration',
    veterinarian: 'Veterinarian',
    
    // Messages
    fillRequiredFields: 'Please fill in all required fields',
    operationSuccessful: 'Operation completed successfully',
    operationFailed: 'Operation failed',
    noDataFound: 'No data found',
    tryAgain: 'Please try again',
    networkError: 'Network error. Please check your connection',
  },
  hi: {
    // Navigation
    dashboard: 'डैशबोर्ड',
    animals: 'जानवर',
    consultations: 'परामर्श',
    community: 'समुदाय',
    leaderboard: 'लीडरबोर्ड',
    profile: 'प्रोफाइल',
    
    // Common
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    cancel: 'रद्द करें',
    save: 'सेव करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    add: 'जोड़ें',
    search: 'खोजें',
    filter: 'फिल्टर',
    back: 'पीछे',
    next: 'अगला',
    done: 'हो गया',
    yes: 'हाँ',
    no: 'नहीं',
    ok: 'ठीक है',
    
    // Auth
    login: 'लॉग इन',
    register: 'रजिस्टर',
    logout: 'लॉग आउट',
    email: 'ईमेल',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    fullName: 'पूरा नाम',
    phone: 'फोन',
    role: 'भूमिका',
    farmer: 'किसान',
    vet: 'पशु चिकित्सक',
    admin: 'व्यवस्थापक',
    
    // Rescue
    rescueReport: 'जानवर बचाव रिपोर्ट',
    animalType: 'जानवर का प्रकार',
    cow: 'गाय',
    dog: 'कुत्ता',
    goat: 'बकरी',
    other: 'अन्य',
    description: 'विवरण',
    location: 'स्थान',
    captureLocation: 'स्थान कैप्चर करें',
    urgencyLevel: 'तत्कालता स्तर',
    low: 'कम',
    medium: 'मध्यम',
    high: 'उच्च',
    critical: 'तत्काल',
    photos: 'फोटो',
    gallery: 'गैलरी',
    camera: 'कैमरा',
    contactPhone: 'संपर्क फोन',
    submitReport: 'रिपोर्ट जमा करें',
    reportSubmitted: 'रिपोर्ट सबमिट हो गई',
    nearbyNGOsNotified: 'पास के एनजीओ को सूचित कर दिया जाएगा',
    
    // Disease Knowledge
    diseaseKnowledge: 'रोग ज्ञान आधार',
    symptoms: 'लक्षण',
    causes: 'कारण',
    firstAid: 'प्रथम उपचार',
    whenToCallVet: 'जब वेट को बुलाएं',
    prevention: 'रोकथाम',
    contagious: 'संक्रामक',
    recoveryTime: 'रिकवरी समय',
    
    // Tele-consultation
    teleConsultation: 'टेली-कंसल्टेशन',
    title: 'शीर्षक',
    subject: 'विषय',
    detailedDescription: 'विस्तृत विवरण',
    preferredTime: 'पसंदीदा समय',
    consultationRequest: 'परामर्श अनुरोध',
    requestSubmitted: 'अनुरोध सबमिट हो गया',
    vetWillContact: 'वेट जल्द ही आपसे संपर्क करेंगे',
    
    // Medicine
    medicineAvailability: 'दवा उपलब्धता',
    medicines: 'दवाएं',
    stores: 'स्टोर',
    pharmacy: 'फार्मेसी',
    veterinaryClinic: 'पशु चिकित्सा क्लिनिक',
    ngo: 'एनजीओ',
    gaushala: 'गौशाला',
    prescription: 'प्रिस्क्रिप्शन',
    price: 'मूल्य',
    stock: 'स्टॉक',
    delivery: 'डिलीवरी',
    emergency: 'आपातकालीन',
    verified: 'सत्यापित',
    call: 'कॉल',
    directions: 'दिशाएं',
    
    // Gaushala
    gaushalaAnimals: 'गौशाला जानवर',
    addAnimal: 'जानवर जोड़ें',
    animalName: 'जानवर का नाम',
    tagNumber: 'टैग नंबर',
    breed: 'नस्ल',
    gender: 'लिंग',
    male: 'नर',
    female: 'मादा',
    dateOfBirth: 'जन्म तिथि',
    dateOfArrival: 'आगमन तिथि',
    healthStatus: 'स्वास्थ्य स्थिति',
    excellent: 'उत्कृष्ट',
    good: 'अच्छा',
    fair: 'ठीक',
    poor: 'खराब',
    bull: 'बैल',
    
    // Medical Records
    medicalRecords: 'चिकित्सा रिकॉर्ड',
    vaccination: 'टीकाकरण',
    treatment: 'इलाज',
    checkup: 'जांच',
    medication: 'दवा',
    dosage: 'खुराक',
    frequency: 'आवृत्ति',
    duration: 'अवधि',
    veterinarian: 'पशु चिकित्सक',
    
    // Messages
    fillRequiredFields: 'कृपया सभी आवश्यक फ़ील्ड भरें',
    operationSuccessful: 'ऑपरेशन सफलतापूर्वक पूरा हुआ',
    operationFailed: 'ऑपरेशन विफल',
    noDataFound: 'कोई डेटा नहीं मिला',
    tryAgain: 'कृपया फिर से कोशिश करें',
    networkError: 'नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें',
  },
  cg: {
    // Navigation
    dashboard: 'डैशबोर्ड',
    animals: 'पशु',
    consultations: 'मशवरा',
    community: 'समाज',
    leaderboard: 'लीडरबोर्ड',
    profile: 'प्रोफाइल',
    
    // Common
    loading: 'लोड होवत हे...',
    error: 'गलती',
    success: 'सफलता',
    cancel: 'रद करब',
    save: 'सेव करब',
    delete: 'मेटाब',
    edit: 'सुधारब',
    add: 'जोड़ब',
    search: 'खोजब',
    filter: 'फिल्टर',
    back: 'पीछे',
    next: 'आगे',
    done: 'हो गय',
    yes: 'हां',
    no: 'ना',
    ok: 'ठीक',
    
    // Auth
    login: 'लॉग इन',
    register: 'रजिस्टर',
    logout: 'लॉग आउट',
    email: 'ईमेल',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड कन्फर्म करब',
    fullName: 'पूरा नाम',
    phone: 'फोन',
    role: 'भूमिका',
    farmer: 'किसान',
    vet: 'पशु डाक्टर',
    admin: 'एडमिन',
    
    // Rescue
    rescueReport: 'पशु बचाव रिपोर्ट',
    animalType: 'पशु के प्रकार',
    cow: 'गाय',
    dog: 'कुत्ता',
    goat: 'बकरी',
    other: 'अन्य',
    description: 'विवरण',
    location: 'जगह',
    captureLocation: 'जगह कैप्चर करब',
    urgencyLevel: 'जरूरत के स्तर',
    low: 'कम',
    medium: 'मध्यम',
    high: 'जादा',
    critical: 'बहुत जरूरी',
    photos: 'फोटो',
    gallery: 'गैलरी',
    camera: 'कैमरा',
    contactPhone: 'संपर्क फोन',
    submitReport: 'रिपोर्ट जमा करब',
    reportSubmitted: 'रिपोर्ट जमा हो गय',
    nearbyNGOsNotified: 'पास के एनजीओ ल सूचित कर दिय जाही',
    
    // Disease Knowledge
    diseaseKnowledge: 'रोग ज्ञान',
    symptoms: 'लक्षण',
    causes: 'कारण',
    firstAid: 'पहिल इलाज',
    whenToCallVet: 'कब डाक्टर के बुलाब',
    prevention: 'रोकथाम',
    contagious: 'संक्रामक',
    recoveryTime: 'ठीक होय के समय',
    
    // Tele-consultation
    teleConsultation: 'टेली-कंसल्टेशन',
    title: 'शीर्षक',
    subject: 'विषय',
    detailedDescription: 'विस्तृत विवरण',
    preferredTime: 'पसंदीदा समय',
    consultationRequest: 'मशवरा मांग',
    requestSubmitted: 'मांग जमा हो गय',
    vetWillContact: 'डाक्टर जल्दी संपर्क करहीं',
    
    // Medicine
    medicineAvailability: 'दवा उपलब्धता',
    medicines: 'दवाई',
    stores: 'दुकान',
    pharmacy: 'फार्मेसी',
    veterinaryClinic: 'पशु डाक्टर क्लिनिक',
    ngo: 'एनजीओ',
    gaushala: 'गौशाला',
    prescription: 'प्रिस्क्रिप्शन',
    price: 'कीमत',
    stock: 'स्टॉक',
    delivery: 'डिलीवरी',
    emergency: 'आपातकालीन',
    verified: 'सत्यापित',
    call: 'कॉल',
    directions: 'दिशा',
    
    // Gaushala
    gaushalaAnimals: 'गौशाला पशु',
    addAnimal: 'पशु जोड़ब',
    animalName: 'पशु के नाम',
    tagNumber: 'टैग नंबर',
    breed: 'नस्ल',
    gender: 'लिंग',
    male: 'नर',
    female: 'मादा',
    dateOfBirth: 'जन्म तारीख',
    dateOfArrival: 'आय के तारीख',
    healthStatus: 'सेहत के हाल',
    excellent: 'बहुत अच्छा',
    good: 'अच्छा',
    fair: 'ठीक',
    poor: 'खराब',
    bull: 'सांड',
    
    // Medical Records
    medicalRecords: 'मेडिकल रिकॉर्ड',
    vaccination: 'टीका',
    treatment: 'इलाज',
    checkup: 'जांच',
    medication: 'दवाई',
    dosage: 'खुराक',
    frequency: 'आवृत्ति',
    duration: 'अवधि',
    veterinarian: 'पशु डाक्टर',
    
    // Messages
    fillRequiredFields: 'सब जरूरी फील्ड भरब',
    operationSuccessful: 'काम सफल रहे',
    operationFailed: 'काम फेल हो गय',
    noDataFound: 'कोई डेटा ना मिले',
    tryAgain: 'फिर से कोशिश करब',
    networkError: 'नेटवर्क गलती। कनेक्शन जांच करब',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('hi'); // Default to Hindi for rural users

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // Store preference locally
    try {
      localStorage.setItem('preferred-language', lang);
    } catch (error) {
      console.log('Could not save language preference');
    }
  };

  const t = (key: string, fallback?: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found in current language
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return fallback || key;
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : fallback || key;
  };

  const isRTL = false; // Hindi and English are both LTR

  // Load saved language preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('preferred-language');
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'cg')) {
        setLanguageState(saved);
      }
    } catch (error) {
      console.log('Could not load language preference');
    }
  }, []);

  const value = {
    language,
    setLanguage,
    t,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Helper function for direct translation usage
export const translate = (key: string, language: Language = 'hi'): string => {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key;
        }
      }
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
};
