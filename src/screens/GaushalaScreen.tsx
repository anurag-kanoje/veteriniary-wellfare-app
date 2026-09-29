import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';

interface GaushalaAnimal {
  id: string;
  name: string;
  tagNumber: string;
  breed: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  dateOfArrival: string;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
  lastVaccination: string;
  notes: string;
}

const SAMPLE_GAUSHALA_ANIMALS: GaushalaAnimal[] = [
  {
    id: '1',
    name: 'गंगा',
    tagNumber: 'CG-2024-001',
    breed: 'गिर',
    gender: 'Female',
    dateOfBirth: '2018-05-15',
    dateOfArrival: '2023-01-10',
    healthStatus: 'good',
    lastVaccination: '2024-01-15',
    notes: 'Rescued from stray, healthy',
  },
  {
    id: '2',
    name: 'यमुना',
    tagNumber: 'CG-2024-002',
    breed: 'साहिवाल',
    gender: 'Female',
    dateOfBirth: '2019-08-20',
    dateOfArrival: '2023-03-22',
    healthStatus: 'excellent',
    lastVaccination: '2024-02-10',
    notes: 'Good milk producer',
  },
  {
    id: '3',
    name: 'शिव',
    tagNumber: 'CG-2024-003',
    breed: 'मुर्रा',
    gender: 'Male',
    dateOfBirth: '2017-12-05',
    dateOfArrival: '2022-11-15',
    healthStatus: 'fair',
    lastVaccination: '2024-01-20',
    notes: 'Used for breeding, needs care',
  },
];

export default function GaushalaScreen() {
  const { language } = useLanguage();
  const [animals, setAnimals] = useState<GaushalaAnimal[]>(SAMPLE_GAUSHALA_ANIMALS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<GaushalaAnimal | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newAnimal, setNewAnimal] = useState<Partial<GaushalaAnimal>>({
    name: '',
    tagNumber: '',
    breed: '',
    gender: 'Female',
    dateOfBirth: '',
    dateOfArrival: new Date().toISOString().split('T')[0],
    healthStatus: 'good',
    lastVaccination: '',
    notes: '',
  });

  const healthStatuses = [
    { value: 'excellent', label: language === 'hi' ? 'उत्कृष्ट' : language === 'cg' ? 'बहुत अच्छा' : 'Excellent', color: '#10b981' },
    { value: 'good', label: language === 'hi' ? 'अच्छा' : language === 'cg' ? 'अच्छा' : 'Good', color: '#3b82f6' },
    { value: 'fair', label: language === 'hi' ? 'ठीक' : language === 'cg' ? 'ठीक' : 'Fair', color: '#f59e0b' },
    { value: 'poor', label: language === 'hi' ? 'खराब' : language === 'cg' ? 'खराब' : 'Poor', color: '#ef4444' },
  ];

  const breeds = [
    'गिर', 'साहिवाल', 'मुर्रा', 'थारपारकर', 'कंकरेज', 'हरियाणा', 'अन्य'
  ];

  const filteredAnimals = animals.filter(animal =>
    animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    animal.tagNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    animal.breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getHealthStatusColor = (status: string) => {
    const statusObj = healthStatuses.find(s => s.value === status);
    return statusObj ? statusObj.color : '#6b7280';
  };

  const getHealthStatusLabel = (status: string) => {
    const statusObj = healthStatuses.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  };

  const handleAddAnimal = () => {
    if (!newAnimal.name || !newAnimal.tagNumber || !newAnimal.breed) {
      Alert.alert(
        language === 'hi' ? 'गलती' : language === 'cg' ? 'गलती' : 'Error',
        language === 'hi' ? 'कृपया आवश्यक फ़ील्ड भरें' : language === 'cg' ? 'जरूरी फील्ड भरब' : 'Please fill required fields'
      );
      return;
    }

    const animal: GaushalaAnimal = {
      id: Date.now().toString(),
      name: newAnimal.name || '',
      tagNumber: newAnimal.tagNumber || '',
      breed: newAnimal.breed || '',
      gender: newAnimal.gender || 'Female',
      dateOfBirth: newAnimal.dateOfBirth || '',
      dateOfArrival: newAnimal.dateOfArrival || new Date().toISOString().split('T')[0],
      healthStatus: newAnimal.healthStatus || 'good',
      lastVaccination: newAnimal.lastVaccination || '',
      notes: newAnimal.notes || '',
    };

    setAnimals([...animals, animal]);
    setShowAddModal(false);
    setNewAnimal({
      name: '',
      tagNumber: '',
      breed: '',
      gender: 'Female',
      dateOfBirth: '',
      dateOfArrival: new Date().toISOString().split('T')[0],
      healthStatus: 'good',
      lastVaccination: '',
      notes: '',
    });

    Alert.alert(
      language === 'hi' ? 'सफलता' : language === 'cg' ? 'सफलता' : 'Success',
      language === 'hi' ? 'पशु जोड़ा गया' : language === 'cg' ? 'पशु जोड़ गय' : 'Animal added successfully'
    );
  };

  const renderAnimalCard = (animal: GaushalaAnimal) => (
    <TouchableOpacity
      key={animal.id}
      style={styles.animalCard}
      onPress={() => setSelectedAnimal(animal)}
    >
      <View style={styles.animalHeader}>
        <View style={styles.animalInfo}>
          <Text style={styles.animalName}>{animal.name}</Text>
          <Text style={styles.animalTag}>{animal.tagNumber}</Text>
        </View>
        <View style={[styles.healthBadge, { backgroundColor: getHealthStatusColor(animal.healthStatus) + '20' }]}>
          <Text style={[styles.healthText, { color: getHealthStatusColor(animal.healthStatus) }]}>
            {getHealthStatusLabel(animal.healthStatus)}
          </Text>
        </View>
      </View>

      <View style={styles.animalDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="information-circle" size={16} color="#6b7280" />
          <Text style={styles.detailText}>{animal.breed} • {animal.gender}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color="#6b7280" />
          <Text style={styles.detailText}>
            {language === 'hi' ? 'आय: ' : language === 'cg' ? 'आय: ' : 'Arrived: '}{animal.dateOfArrival}
          </Text>
        </View>
        {animal.lastVaccination && (
          <View style={styles.detailRow}>
            <Ionicons name="medical" size={16} color="#6b7280" />
            <Text style={styles.detailText}>
              {language === 'hi' ? 'टीका: ' : language === 'cg' ? 'टीका: ' : 'Vaccine: '}{animal.lastVaccination}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderAnimalDetail = () => (
    <Modal
      visible={!!selectedAnimal}
      animationType="slide"
      onRequestClose={() => setSelectedAnimal(null)}
    >
      {selectedAnimal && (
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSelectedAnimal(null)}>
              <Ionicons name="close" size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedAnimal.name}</Text>
            <TouchableOpacity onPress={() => {
              // Handle edit/delete
              setSelectedAnimal(null);
            }}>
              <Ionicons name="ellipsis-vertical" size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.detailCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {language === 'hi' ? 'टैग नंबर' : language === 'cg' ? 'टैग नंबर' : 'Tag Number'}
                </Text>
                <Text style={styles.detailValue}>{selectedAnimal.tagNumber}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {language === 'hi' ? 'नस्ल' : language === 'cg' ? 'नस्ल' : 'Breed'}
                </Text>
                <Text style={styles.detailValue}>{selectedAnimal.breed}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {language === 'hi' ? 'लिंग' : language === 'cg' ? 'लिंग' : 'Gender'}
                </Text>
                <Text style={styles.detailValue}>
                  {selectedAnimal.gender === 'Male' ? (language === 'hi' ? 'नर' : language === 'cg' ? 'नर' : 'Male') : (language === 'hi' ? 'मादा' : language === 'cg' ? 'मादा' : 'Female')}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {language === 'hi' ? 'जन्म तिथि' : language === 'cg' ? 'जन्म तारीख' : 'Date of Birth'}
                </Text>
                <Text style={styles.detailValue}>{selectedAnimal.dateOfBirth}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {language === 'hi' ? 'आगमन तिथि' : language === 'cg' ? 'आय के तारीख' : 'Date of Arrival'}
                </Text>
                <Text style={styles.detailValue}>{selectedAnimal.dateOfArrival}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {language === 'hi' ? 'स्वास्थ्य स्थिति' : language === 'cg' ? 'सेहत के हाल' : 'Health Status'}
                </Text>
                <View style={[styles.healthBadge, { backgroundColor: getHealthStatusColor(selectedAnimal.healthStatus) + '20' }]}>
                  <Text style={[styles.healthText, { color: getHealthStatusColor(selectedAnimal.healthStatus) }]}>
                    {getHealthStatusLabel(selectedAnimal.healthStatus)}
                  </Text>
                </View>
              </View>
              {selectedAnimal.lastVaccination && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    {language === 'hi' ? 'अंतिम टीकाकरण' : language === 'cg' ? 'आखिरी टीका' : 'Last Vaccination'}
                  </Text>
                  <Text style={styles.detailValue}>{selectedAnimal.lastVaccination}</Text>
                </View>
              )}
              {selectedAnimal.notes && (
                <View style={styles.notesSection}>
                  <Text style={styles.notesLabel}>
                    {language === 'hi' ? 'टिप्पणियां' : language === 'cg' ? 'टिप्पणी' : 'Notes'}
                  </Text>
                  <Text style={styles.notesText}>{selectedAnimal.notes}</Text>
                </View>
              )}
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="medical" size={20} color="#4f46e5" />
                <Text style={styles.actionButtonText}>
                  {language === 'hi' ? 'टीका अपडेट करें' : language === 'cg' ? 'टीका अपडेट करब' : 'Update Vaccine'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="create" size={20} color="#4f46e5" />
                <Text style={styles.actionButtonText}>
                  {language === 'hi' ? 'संपादित करें' : language === 'cg' ? 'सुधारब' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
    </Modal>
  );

  const renderAddModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      onRequestClose={() => setShowAddModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowAddModal(false)}>
            <Ionicons name="close" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {language === 'hi' ? 'नया पशु जोड़ें' : language === 'cg' ? 'नवा पशु जोड़ब' : 'Add New Animal'}
          </Text>
          <TouchableOpacity onPress={handleAddAnimal}>
            <Ionicons name="checkmark" size={24} color="#4f46e5" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.formSection}>
            <Text style={styles.formLabel}>
              {language === 'hi' ? 'पशु का नाम' : language === 'cg' ? 'पशु के नाम' : 'Animal Name'}
            </Text>
            <TextInput
              style={styles.formInput}
              placeholder={language === 'hi' ? 'जैसे: गंगा' : language === 'cg' ? 'जैसे: गंगा' : 'e.g., Ganga'}
              value={newAnimal.name}
              onChangeText={(text) => setNewAnimal({ ...newAnimal, name: text })}
            />

            <Text style={styles.formLabel}>
              {language === 'hi' ? 'टैग नंबर' : language === 'cg' ? 'टैग नंबर' : 'Tag Number'}
            </Text>
            <TextInput
              style={styles.formInput}
              placeholder="CG-2024-XXX"
              value={newAnimal.tagNumber}
              onChangeText={(text) => setNewAnimal({ ...newAnimal, tagNumber: text })}
            />

            <Text style={styles.formLabel}>
              {language === 'hi' ? 'नस्ल' : language === 'cg' ? 'नस्ल' : 'Breed'}
            </Text>
            <View style={styles.breedContainer}>
              {breeds.map((breed) => (
                <TouchableOpacity
                  key={breed}
                  style={[
                    styles.breedButton,
                    newAnimal.breed === breed && styles.selectedBreed,
                  ]}
                  onPress={() => setNewAnimal({ ...newAnimal, breed })}
                >
                  <Text
                    style={[
                      styles.breedText,
                      newAnimal.breed === breed && styles.selectedBreedText,
                    ]}
                  >
                    {breed}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.formLabel}>
              {language === 'hi' ? 'लिंग' : language === 'cg' ? 'लिंग' : 'Gender'}
            </Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  newAnimal.gender === 'Female' && styles.selectedGender,
                ]}
                onPress={() => setNewAnimal({ ...newAnimal, gender: 'Female' })}
              >
                <Text
                  style={[
                    styles.genderText,
                    newAnimal.gender === 'Female' && styles.selectedGenderText,
                  ]}
                >
                  {language === 'hi' ? 'मादा' : language === 'cg' ? 'मादा' : 'Female'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  newAnimal.gender === 'Male' && styles.selectedGender,
                ]}
                onPress={() => setNewAnimal({ ...newAnimal, gender: 'Male' })}
              >
                <Text
                  style={[
                    styles.genderText,
                    newAnimal.gender === 'Male' && styles.selectedGenderText,
                  ]}
                >
                  {language === 'hi' ? 'नर' : language === 'cg' ? 'नर' : 'Male'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.formLabel}>
              {language === 'hi' ? 'स्वास्थ्य स्थिति' : language === 'cg' ? 'सेहत के हाल' : 'Health Status'}
            </Text>
            <View style={styles.healthContainer}>
              {healthStatuses.map((status) => (
                <TouchableOpacity
                  key={status.value}
                  style={[
                    styles.healthButton,
                    { backgroundColor: status.color + '20' },
                    newAnimal.healthStatus === status.value && styles.selectedHealth,
                  ]}
                  onPress={() => setNewAnimal({ ...newAnimal, healthStatus: status.value as any })}
                >
                  <Text
                    style={[
                      styles.healthButtonText,
                      { color: status.color },
                      newAnimal.healthStatus === status.value && styles.selectedHealthText,
                    ]}
                  >
                    {status.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.formLabel}>
              {language === 'hi' ? 'टिप्पणियां' : language === 'cg' ? 'टिप्पणी' : 'Notes'}
            </Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              placeholder={language === 'hi' ? 'वैकल्पिक टिप्पणियां' : language === 'cg' ? 'चाहे तब टिप्पणी' : 'Optional notes'}
              value={newAnimal.notes}
              onChangeText={(text) => setNewAnimal({ ...newAnimal, notes: text })}
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {language === 'hi' ? 'गौशाला प्रबंधन' : language === 'cg' ? 'गौशाला प्रबंधन' : 'Gaushala Management'}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'hi' ? 'गौशाला के पशुओं का प्रबंधन' : language === 'cg' ? 'गौशाला के पशु प्रबंधन' : 'Manage gaushala animals'}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{animals.length}</Text>
          <Text style={styles.statLabel}>
            {language === 'hi' ? 'कुल पशु' : language === 'cg' ? 'कुल पशु' : 'Total Animals'}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {animals.filter(a => a.healthStatus === 'excellent' || a.healthStatus === 'good').length}
          </Text>
          <Text style={styles.statLabel}>
            {language === 'hi' ? 'स्वस्थ' : language === 'cg' ? 'स्वस्थ' : 'Healthy'}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {animals.filter(a => a.gender === 'Female').length}
          </Text>
          <Text style={styles.statLabel}>
            {language === 'hi' ? 'मादा' : language === 'cg' ? 'मादा' : 'Female'}
          </Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder={language === 'hi' ? 'पशु खोजें...' : language === 'cg' ? 'पशु खोजब...' : 'Search animals...'}
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Animal List */}
      <ScrollView style={styles.content}>
        {filteredAnimals.length > 0 ? (
          filteredAnimals.map(renderAnimalCard)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="paw-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyText}>
              {language === 'hi' ? 'कोई पशु नहीं मिला' : language === 'cg' ? 'कोई पशु ना मिले' : 'No animals found'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>
          {language === 'hi' ? 'पशु जोड़ें' : language === 'cg' ? 'पशु जोड़ब' : 'Add Animal'}
        </Text>
      </TouchableOpacity>

      {renderAnimalDetail()}
      {renderAddModal()}
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4f46e5',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  animalCard: {
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
  animalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  animalInfo: {
    flex: 1,
  },
  animalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  animalTag: {
    fontSize: 12,
    color: '#6b7280',
  },
  healthBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  healthText: {
    fontSize: 10,
    fontWeight: '600',
  },
  animalDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
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
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
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
  detailCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  notesSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2ff',
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4f46e5',
    marginLeft: 8,
  },
  formSection: {
    gap: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  formInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  breedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  breedButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedBreed: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  breedText: {
    fontSize: 12,
    color: '#6b7280',
  },
  selectedBreedText: {
    color: '#fff',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  selectedGender: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  genderText: {
    fontSize: 14,
    color: '#6b7280',
  },
  selectedGenderText: {
    color: '#fff',
  },
  healthContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  healthButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedHealth: {
    borderWidth: 2,
    borderColor: '#4f46e5',
  },
  healthButtonText: {
    fontSize: 12,
  },
  selectedHealthText: {
    fontWeight: '600',
  },
});