import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

interface Animal {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  lastVisit?: string;
  nextVaccination: string;
  image?: any;
}

const SAMPLE_ANIMALS: Animal[] = [
  {
    id: '1',
    name: 'गौरी',
    type: 'गाय',
    breed: 'गिर',
    age: '4 साल',
    lastVisit: '15 जनवरी 2024',
    nextVaccination: '1 मार्च 2024',
    image: null,
  },
  {
    id: '2',
    name: 'मोती',
    type: 'बकरी',
    breed: 'सानेन',
    age: '2 साल',
    lastVisit: '20 जनवरी 2024',
    nextVaccination: '15 फरवरी 2024',
    image: null,
  },
];

export default function AnimalsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [animals, setAnimals] = useState<Animal[]>(SAMPLE_ANIMALS);

  const renderAnimalCard = ({ item }: { item: Animal }) => (
    <TouchableOpacity
      style={styles.animalCard}
      onPress={() => navigation.navigate('PetDetails', { petId: item.id })}
    >
      <View style={styles.animalInfo}>
        <View style={styles.animalHeader}>
          <Text style={styles.animalName}>{item.name}</Text>
          <Text style={styles.animalType}>{item.type}</Text>
        </View>
        <Text style={styles.animalBreed}>{item.breed} • {item.age}</Text>
        
        <View style={styles.animalDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="medical" size={16} color="#6b7280" />
            <Text style={styles.detailText}>
              अगला टीका: {item.nextVaccination}
            </Text>
          </View>
          {item.lastVisit && (
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={16} color="#6b7280" />
              <Text style={styles.detailText}>
                पिछला दौरा: {item.lastVisit}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </TouchableOpacity>
  );

  const renderAddPetForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>नया पशु जोड़ें</Text>
      <Text style={styles.formSubtitle}>फॉर्म भरने के लिए तैयार नहीं है</Text>
      
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => setShowForm(false)}
      >
        <Text style={styles.cancelButtonText}>रद्द करें</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPetList = () => (
    <FlatList
      data={animals}
      renderItem={renderAnimalCard}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>मेरे पशु</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(!showForm)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {showForm ? renderAddPetForm() : renderPetList()}
      </ScrollView>
      
      {!showForm && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate('AddEditPet')}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.floatingButtonText}>नया पशु जोड़ें</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    paddingBottom: 100,
  },
  animalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  animalInfo: {
    flex: 1,
  },
  animalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  animalName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  animalType: {
    fontSize: 14,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  animalBreed: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  animalDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  floatingButton: {
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
  floatingButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});
