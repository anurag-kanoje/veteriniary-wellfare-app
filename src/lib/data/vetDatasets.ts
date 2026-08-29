import { Dataset } from '../types/dataset';

// Enhanced dataset with more comprehensive veterinary knowledge
export const veterinaryDataset: Dataset = {
  id: 'veterinary_medicine',
  name: 'Veterinary Medicine Dataset',
  source: 'DokHee/veterinary_medicine_SummarizePrompt',
  entries: [
    {
      id: '1',
      title: 'Bovine Respiratory Disease',
      symptoms: [
        'Nasal discharge',
        'Coughing',
        'Rapid breathing',
        'Fever',
        'Reduced appetite',
        'Depression'
      ],
      diagnosis: 'Common respiratory infection affecting cattle, caused by various pathogens including viruses and bacteria',
      treatment: 'Antibiotics for bacterial infections, anti-inflammatory medication, supportive care including rest and good ventilation',
      prevention: 'Vaccination, proper ventilation, stress reduction, good nutrition, biosecurity measures'
    },
    {
      id: '2',
      title: 'Mastitis',
      symptoms: [
        'Swollen udder',
        'Abnormal milk',
        'Pain and tenderness',
        'Reduced milk production',
        'Fever',
        'Loss of appetite'
      ],
      diagnosis: 'Inflammation of mammary glands often caused by bacterial infection',
      treatment: 'Intramammary antibiotics, frequent milking, anti-inflammatory medication, supportive therapy',
      prevention: 'Proper milking hygiene, clean environment, regular udder health checks, teat dipping'
    },
    {
      id: '3',
      title: 'Foot and Mouth Disease',
      symptoms: [
        'Blisters on mouth and feet',
        'Excessive salivation',
        'Lameness',
        'Reduced appetite',
        'Fever'
      ],
      diagnosis: 'Highly contagious viral disease affecting cloven-hoofed animals',
      treatment: 'Supportive care, pain management, isolation of affected animals',
      prevention: 'Regular vaccination, strict biosecurity measures, movement control'
    }
  ]
};