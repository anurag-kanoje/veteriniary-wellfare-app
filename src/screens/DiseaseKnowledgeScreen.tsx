import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';

interface Disease {
  id: string;
  name: string;
  nameLocal: string;
  affectedAnimals: string[];
  symptoms: string[];
  symptomsLocal: string[];
  causes: string[];
  causesLocal: string[];
  firstAid: string[];
  firstAidLocal: string[];
  prevention: string[];
  preventionLocal: string[];
  contagious: boolean;
  severity: 'mild' | 'moderate' | 'severe';
  recoveryTime: string;
  recoveryTimeLocal: string;
  whenToCallVet: string[];
  whenToCallVetLocal: string[];
}

const DISEASES: Disease[] = [
  {
    id: '1',
    name: 'Foot and Mouth Disease (FMD)',
    nameLocal: 'खुर-पकड़ रोग',
    affectedAnimals: ['Cows', 'Bulls', 'Buffaloes', 'Goats', 'Pigs'],
    symptoms: ['Fever', 'Blisters in mouth', 'Lameness', 'Drooling'],
    symptomsLocal: ['बुखार', 'मुंह में छाले', 'लंगड़ापन', 'लार टपकना'],
    causes: ['Virus infection', 'Contaminated feed', 'Contact with infected animals'],
    causesLocal: ['वायरस संक्रमण', 'दूषित चारा', 'संक्रमित जानवरों के संपर्क में आना'],
    firstAid: ['Isolate the animal', 'Keep clean water available', 'Soft feed'],
    firstAidLocal: ['जानवर को अलग करें', 'साफ पानी उपलब्ध कराएं', 'नरम चारा दें'],
    prevention: ['Vaccination every 6 months', 'Keep clean surroundings', 'Regular health checkups'],
    preventionLocal: ['हर 6 महीने में टीका', 'साफ-सफाई रखें', 'नियमित स्वास्थ्य जांच'],
    contagious: true,
    severity: 'severe',
    recoveryTime: '2-3 weeks',
    recoveryTimeLocal: '2-3 हफ्ते',
    whenToCallVet: ['High fever (>105°F)', 'Not eating', 'Severe lameness'],
    whenToCallVetLocal: ['उच्च बुखार (>105°F)', 'खाना नहीं खा रहा', 'गंभीर लंगड़ापन'],
  },
  {
    id: '2',
    name: 'Black Quarter',
    nameLocal: 'काला ज्वर',
    affectedAnimals: ['Cows', 'Bulls', 'Buffaloes'],
    symptoms: ['Swelling in muscles', 'High fever', 'Depression', 'Lameness'],
    symptomsLocal: ['मांसपेशियों में सूजन', 'उच्च बुखार', 'उदासी', 'लंगड़ापन'],
    causes: ['Bacterial infection', 'Soil contamination', 'Wounds'],
    causesLocal: ['बैक्टीरियल संक्रमण', 'मिट्टी दूषण', 'घाव'],
    firstAid: ['Cold compress on swelling', 'Antibiotics if available', 'Isolate immediately'],
    firstAidLocal: ['सूजन पर ठंडा पानी', 'एंटीबायोटिक्स यदि उपलब्ध', 'तुरंत अलग करें'],
    prevention: ['Annual vaccination', 'Clean wounds immediately', 'Avoid wet areas'],
    preventionLocal: ['वार्षिक टीकाकरण', 'घावों को तुरंत साफ करें', 'गीले क्षेत्रों से बचें'],
    contagious: false,
    severity: 'severe',
    recoveryTime: '1-2 weeks with treatment',
    recoveryTimeLocal: 'इलाज के साथ 1-2 हफ्ते',
    whenToCallVet: ['Rapid swelling', 'Animal down', 'Not responding'],
    whenToCallVetLocal: ['तेजी से सूजन', 'जानवर गिर गया', 'प्रतिक्रिया नहीं कर रहा'],
  },
  {
    id: '3',
    name: 'Mastitis',
    nameLocal: 'स्तन रोग',
    affectedAnimals: ['Cows', 'Buffaloes', 'Goats'],
    symptoms: ['Swollen udder', 'Hot to touch', 'Abnormal milk', 'Pain'],
    symptomsLocal: ['थन में सूजन', 'छूने पर गर्म', 'असामान्य दूध', 'दर्द'],
    causes: ['Bacterial infection', 'Poor hygiene', 'Milking machine issues'],
    causesLocal: ['बैक्टीरियल संक्रमण', 'खराब स्वच्छता', 'दुहने की मशीन की समस्या'],
    firstAid: ['Frequent milking', 'Hot compress', 'Clean bedding'],
    firstAidLocal: ['बार-बार दुहना', 'गर्म पानी का पट्टा', 'साफ बिस्तर'],
    prevention: ['Clean milking practices', 'Post-milking teat dip', 'Regular checks'],
    preventionLocal: ['साफ दुहने की प्रथा', 'दुहने के बाद थन डुबाना', 'नियमित जांच'],
    contagious: true,
    severity: 'moderate',
    recoveryTime: '1-2 weeks',
    recoveryTimeLocal: '1-2 हफ्ते',
    whenToCallVet: ['Blood in milk', 'Systemic illness', 'Not improving'],
    whenToCallVetLocal: ['दूध में खून', 'पूरे शरीर में बीमारी', 'सुधार नहीं हो रहा'],
  },
  {
    id: '4',
    name: 'Enterotoxaemia',
    nameLocal: 'आंत्र विषाक्तता',
    affectedAnimals: ['Goats', 'Sheep'],
    symptoms: ['Diarrhea', 'Abdominal pain', 'Depression', 'Sudden death'],
    symptomsLocal: ['दस्त', 'पेट में दर्द', 'उदासी', 'अचानक मृत्यु'],
    causes: ['Bacterial overgrowth', 'Sudden diet change', 'Stress'],
    causesLocal: ['बैक्टीरिया का अधिक विकास', 'अचानक आहार परिवर्तन', 'तनाव'],
    firstAid: ['Stop grain feeding', 'Provide clean water', 'Isolate'],
    firstAidLocal: ['अनाज खिलाना बंद करें', 'साफ पानी दें', 'अलग करें'],
    prevention: ['Vaccination', 'Gradual diet changes', 'Stress reduction'],
    preventionLocal: ['टीकाकरण', 'धीरे-धीरे आहार बदलें', 'तनाव कम करें'],
    contagious: false,
    severity: 'severe',
    recoveryTime: '3-5 days with treatment',
    recoveryTimeLocal: 'इलाज के साथ 3-5 दिन',
    whenToCallVet: ['Sudden death in herd', 'Severe diarrhea', 'Convulsions'],
    whenToCallVetLocal: ['झुंड में अचानक मृत्यु', 'गंभीर दस्त', 'मिरगी'],
  },
  {
    id: '5',
    name: 'Hemorrhagic Septicemia',
    nameLocal: 'रक्तस्रावी रक्तपित्त',
    affectedAnimals: ['Cows', 'Bulls', 'Buffaloes'],
    symptoms: ['High fever', 'Swelling in throat', 'Difficulty breathing', 'Depression'],
    symptomsLocal: ['उच्च बुखार', 'गले में सूजन', 'सांस लेने में कठिनाई', 'उदासी'],
    causes: ['Bacterial infection', 'Stress', 'Poor nutrition'],
    causesLocal: ['बैक्टीरियल संक्रमण', 'तनाव', 'खराब पोषण'],
    firstAid: ['Keep animal cool', 'Provide fresh water', 'Isolate'],
    firstAidLocal: ['जानवर को ठंडा रखें', 'ताजा पानी दें', 'अलग करें'],
    prevention: ['Annual vaccination', 'Good nutrition', 'Stress management'],
    preventionLocal: ['वार्षिक टीकाकरण', 'अच्छा पोषण', 'तनाव प्रबंधन'],
    contagious: true,
    severity: 'severe',
    recoveryTime: '1-2 weeks with treatment',
    recoveryTimeLocal: 'इलाज के साथ 1-2 हफ्ते',
    whenToCallVet: ['Breathing difficulty', 'Not eating', 'Collapse'],
    whenToCallVetLocal: ['सांस लेने में कठिनाई', 'खाना नहीं खा रहा', 'गिर गया'],
  },
];

export default function DiseaseKnowledgeScreen() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<string>('all');

  const animals = ['all', 'Cows', 'Bulls', 'Buffaloes', 'Goats', 'Sheep', 'Pigs'];

  const filteredDiseases = DISEASES.filter(disease => {
    const matchesSearch = 
      disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disease.nameLocal.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAnimal = selectedAnimal === 'all' || disease.affectedAnimals.includes(selectedAnimal);
    
    return matchesSearch && matchesAnimal;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'severe': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'mild': return language === 'hi' ? 'हल्का' : language === 'cg' ? 'हल्का' : 'Mild';
      case 'moderate': return language === 'hi' ? 'मध्यम' : language === 'cg' ? 'मध्यम' : 'Moderate';
      case 'severe': return language === 'hi' ? 'गंभीर' : language === 'cg' ? 'गंभीर' : 'Severe';
      default: return severity;
    }
  };

  const renderDiseaseCard = (disease: Disease) => (
    <TouchableOpacity
      key={disease.id}
      style={styles.diseaseCard}
      onPress={() => setSelectedDisease(disease)}
    >
      <View style={styles.diseaseHeader}>
        <View style={styles.diseaseInfo}>
          <Text style={styles.diseaseName}>{language === 'hi' || language === 'cg' ? disease.nameLocal : disease.name}</Text>
          <View style={styles.diseaseMeta}>
            <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(disease.severity) + '20' }]}>
              <Text style={[styles.severityText, { color: getSeverityColor(disease.severity) }]}>
                {getSeverityLabel(disease.severity)}
              </Text>
            </View>
            {disease.contagious && (
              <View style={styles.contagiousBadge}>
                <Ionicons name="warning" size={12} color="#f59e0b" />
                <Text style={styles.contagiousText}>
                  {language === 'hi' ? 'संक्रामक' : language === 'cg' ? 'संक्रामक' : 'Contagious'}
                </Text>
              </View>
            )}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </View>

      <View style={styles.diseaseAnimals}>
        {disease.affectedAnimals.slice(0, 3).map((animal, index) => (
          <View key={index} style={styles.animalTag}>
            <Text style={styles.animalTagText}>{animal}</Text>
          </View>
        ))}
        {disease.affectedAnimals.length > 3 && (
          <Text style={styles.moreAnimals}>+{disease.affectedAnimals.length - 3}</Text>
        )}
      </View>

      <View style={styles.diseasePreview}>
        <Ionicons name="alert-circle" size={16} color="#6b7280" />
        <Text style={styles.diseasePreviewText} numberOfLines={1}>
          {language === 'hi' || language === 'cg' ? disease.symptomsLocal[0] : disease.symptoms[0]}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderDiseaseDetail = () => (
    <Modal
      visible={!!selectedDisease}
      animationType="slide"
      onRequestClose={() => setSelectedDisease(null)}
    >
      {selectedDisease && (
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSelectedDisease(null)}>
              <Ionicons name="close" size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {language === 'hi' || language === 'cg' ? selectedDisease.nameLocal : selectedDisease.name}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Severity & Contagious */}
            <View style={styles.detailSection}>
              <View style={styles.detailRow}>
                <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(selectedDisease.severity) + '20' }]}>
                  <Text style={[styles.severityText, { color: getSeverityColor(selectedDisease.severity) }]}>
                    {getSeverityLabel(selectedDisease.severity)}
                  </Text>
                </View>
                {selectedDisease.contagious && (
                  <View style={styles.contagiousBadge}>
                    <Ionicons name="warning" size={12} color="#f59e0b" />
                    <Text style={styles.contagiousText}>
                      {language === 'hi' ? 'संक्रामक' : language === 'cg' ? 'संक्रामक' : 'Contagious'}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.recoveryTime}>
                {language === 'hi' ? 'रिकवरी समय: ' : language === 'cg' ? 'ठीक होय के समय: ' : 'Recovery Time: '}
                {language === 'hi' || language === 'cg' ? selectedDisease.recoveryTimeLocal : selectedDisease.recoveryTime}
              </Text>
            </View>

            {/* Affected Animals */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>
                {language === 'hi' ? 'प्रभावित जानवर' : language === 'cg' ? 'प्रभावित पशु' : 'Affected Animals'}
              </Text>
              <View style={styles.tagsContainer}>
                {selectedDisease.affectedAnimals.map((animal, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{animal}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Symptoms */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>
                {language === 'hi' ? 'लक्षण' : language === 'cg' ? 'लक्षण' : 'Symptoms'}
              </Text>
              {(language === 'hi' || language === 'cg' ? selectedDisease.symptomsLocal : selectedDisease.symptoms).map((symptom, index) => (
                <View key={index} style={styles.listItem}>
                  <Ionicons name="ellipse" size={8} color="#4f46e5" />
                  <Text style={styles.listItemText}>{symptom}</Text>
                </View>
              ))}
            </View>

            {/* Causes */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>
                {language === 'hi' ? 'कारण' : language === 'cg' ? 'कारण' : 'Causes'}
              </Text>
              {(language === 'hi' || language === 'cg' ? selectedDisease.causesLocal : selectedDisease.causes).map((cause, index) => (
                <View key={index} style={styles.listItem}>
                  <Ionicons name="ellipse" size={8} color="#f59e0b" />
                  <Text style={styles.listItemText}>{cause}</Text>
                </View>
              ))}
            </View>

            {/* First Aid */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>
                {language === 'hi' ? 'प्रथम उपचार' : language === 'cg' ? 'पहिल इलाज' : 'First Aid'}
              </Text>
              {(language === 'hi' || language === 'cg' ? selectedDisease.firstAidLocal : selectedDisease.firstAid).map((aid, index) => (
                <View key={index} style={styles.listItem}>
                  <Ionicons name="ellipse" size={8} color="#10b981" />
                  <Text style={styles.listItemText}>{aid}</Text>
                </View>
              ))}
            </View>

            {/* Prevention */}
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>
                {language === 'hi' ? 'रोकथाम' : language === 'cg' ? 'रोकथाम' : 'Prevention'}
              </Text>
              {(language === 'hi' || language === 'cg' ? selectedDisease.preventionLocal : selectedDisease.prevention).map((prevention, index) => (
                <View key={index} style={styles.listItem}>
                  <Ionicons name="ellipse" size={8} color="#6366f1" />
                  <Text style={styles.listItemText}>{prevention}</Text>
                </View>
              ))}
            </View>

            {/* When to Call Vet */}
            <View style={[styles.detailSection, styles.emergencySection]}>
              <Text style={[styles.detailSectionTitle, styles.emergencyTitle]}>
                {language === 'hi' ? 'जब डॉक्टर को बुलाएं' : language === 'cg' ? 'कब डाक्टर के बुलाब' : 'When to Call Vet'}
              </Text>
              {(language === 'hi' || language === 'cg' ? selectedDisease.whenToCallVetLocal : selectedDisease.whenToCallVet).map((condition, index) => (
                <View key={index} style={styles.listItem}>
                  <Ionicons name="warning" size={8} color="#dc2626" />
                  <Text style={[styles.listItemText, styles.emergencyText]}>{condition}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {language === 'hi' ? 'रोग ज्ञान आधार' : language === 'cg' ? 'रोग ज्ञान' : 'Disease Knowledge Base'}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'hi' ? 'पशु रोगों की जानकारी और उपचार' : language === 'cg' ? 'पशु रोग जानकारी और इलाज' : 'Animal disease information and treatment'}
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder={language === 'hi' ? 'रोग खोजें...' : language === 'cg' ? 'रोग खोजब...' : 'Search diseases...'}
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Animal Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {animals.map((animal) => (
          <TouchableOpacity
            key={animal}
            style={[styles.filterButton, selectedAnimal === animal && styles.activeFilter]}
            onPress={() => setSelectedAnimal(animal)}
          >
            <Text style={[styles.filterText, selectedAnimal === animal && styles.activeFilterText]}>
              {animal === 'all' ? (language === 'hi' ? 'सभी' : language === 'cg' ? 'सब' : 'All') : animal}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Disease List */}
      <ScrollView style={styles.content}>
        {filteredDiseases.length > 0 ? (
          filteredDiseases.map(renderDiseaseCard)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="medkit-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyText}>
              {language === 'hi' ? 'कोई रोग नहीं मिला' : language === 'cg' ? 'कोई रोग ना मिले' : 'No diseases found'}
            </Text>
          </View>
        )}
      </ScrollView>

      {renderDiseaseDetail()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    padding: 12,
    marginLeft: 8,
    fontSize: 14,
    color: '#111827',
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  filterText: {
    fontSize: 12,
    color: '#6b7280',
  },
  activeFilterText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  diseaseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  diseaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  diseaseInfo: {
    flex: 1,
  },
  diseaseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  diseaseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  contagiousBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  contagiousText: {
    fontSize: 10,
    color: '#92400e',
    marginLeft: 2,
  },
  diseaseAnimals: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  animalTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 2,
  },
  animalTagText: {
    fontSize: 10,
    color: '#4b5563',
  },
  moreAnimals: {
    fontSize: 10,
    color: '#6b7280',
    marginLeft: 4,
  },
  diseasePreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  diseasePreviewText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recoveryTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#4f46e5',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  listItemText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  emergencySection: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
  },
  emergencyTitle: {
    color: '#dc2626',
  },
  emergencyText: {
    color: '#991b1b',
  },
});