import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { AnimalService, CreateAnimalInput, UpdateAnimalInput, Animal } from '../services/AnimalService';

type RouteParams = {
  AddEditAnimal: {
    animalId?: string;
  };
};

const SPECIES_OPTIONS = [
  { value: 'dog', label: 'Dog / कुत्ता' },
  { value: 'cat', label: 'Cat / बिल्ली' },
  { value: 'cow', label: 'Cow / गाय' },
  { value: 'buffalo', label: 'Buffalo / भैंस' },
  { value: 'goat', label: 'Goat / बकरी' },
  { value: 'sheep', label: 'Sheep / भेड़' },
  { value: 'horse', label: 'Horse / घोड़ा' },
  { value: 'chicken', label: 'Chicken / मुर्गी' },
  { value: 'other', label: 'Other / अन्य' },
];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male / नर' },
  { value: 'female', label: 'Female / मादा' },
];

export default function AddEditAnimalScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'AddEditAnimal'>>();
  const { animalId } = route.params || {};
  const { language } = useLanguage();
  const [isEditing, setIsEditing] = useState(!!animalId);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    gender: '',
    date_of_birth: '',
    weight: '',
    health_status: 'healthy',
  });

  useEffect(() => {
    if (animalId) {
      loadAnimal();
    }
  }, [animalId]);

  const loadAnimal = async () => {
    setLoading(true);
    try {
      const { data, error } = await AnimalService.getAnimal(animalId!);
      if (error) {
        Alert.alert('Error', error.message);
        navigation.goBack();
      } else if (data) {
        setFormData({
          name: data.name,
          species: data.species,
          breed: data.breed || '',
          gender: '',
          date_of_birth: data.date_of_birth || '',
          weight: '',
          health_status: data.health_status || 'healthy',
        });
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert(
        language === 'hi' ? 'Error' : language === 'cg' ? 'Error' : 'Error',
        language === 'hi' ? 'कृपया पशु का नाम दर्ज करें' : language === 'cg' ? 'कृपया पशु नाम भरब' : 'Please enter the animal name'
      );
      return;
    }

    if (!formData.species) {
      Alert.alert(
        language === 'hi' ? 'Error' : language === 'cg' ? 'Error' : 'Error',
        language === 'hi' ? 'कृपया पशु की प्रजाति चुनें' : language === 'cg' ? 'कृपया पशु प्रजाति चुनब' : 'Please select the animal species'
      );
      return;
    }

    setSaving(true);
    try {
      const input: CreateAnimalInput | UpdateAnimalInput = {
        name: formData.name.trim(),
        species: formData.species,
        breed: formData.breed.trim() || undefined,
        date_of_birth: formData.date_of_birth || undefined,
        health_status: formData.health_status,
      };

      if (isEditing) {
        const { error } = await AnimalService.updateAnimal(animalId!, input);
        if (error) {
          throw error;
        }
      } else {
        const { error } = await AnimalService.createAnimal(input);
        if (error) {
          throw error;
        }
      }

      Alert.alert(
        language === 'hi' ? 'Success' : language === 'cg' ? 'Success' : 'Success',
        isEditing
          ? (language === 'hi' ? 'पशु अपडेट किया गया' : language === 'cg' ? 'पशु अपडेट भयो' : 'Animal updated successfully')
          : (language === 'hi' ? 'पशु जोड़ा गया' : language === 'cg' ? 'पशु जोड़यो' : 'Animal added successfully'),
        [
          {
            text: language === 'hi' ? 'OK' : language === 'cg' ? 'OK' : 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert(
        language === 'hi' ? 'Error' : language === 'cg' ? 'Error' : 'Error',
        err.message || (language === 'hi' ? 'एक त्रुटि हुई' : language === 'cg' ? 'एक त्रुटि भयो' : 'An error occurred')
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>
          {language === 'hi' ? 'लोड हो रहा है...' : language === 'cg' ? 'लोड होए है...' : 'Loading...'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4f46e5" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isEditing
            ? (language === 'hi' ? 'पशु संपादित करें' : language === 'cg' ? 'पशु संपादित करब' : 'Edit Animal')
            : (language === 'hi' ? 'नया पशु जोड़ें' : language === 'cg' ? 'नवा पशु जोड़ब' : 'Add New Animal')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.form}>
        {/* Name */}
        <View style={styles.field}>
          <Text style={styles.label}>
            {language === 'hi' ? 'नाम *' : language === 'cg' ? 'नाम *' : 'Name *'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={language === 'hi' ? 'पशु का नाम' : language === 'cg' ? 'पशु नाम' : 'Animal name'}
            placeholderTextColor="#9ca3af"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
        </View>

        {/* Species */}
        <View style={styles.field}>
          <Text style={styles.label}>
            {language === 'hi' ? 'प्रजाति *' : language === 'cg' ? 'प्रजाति *' : 'Species *'}
          </Text>
          <View style={styles.optionsContainer}>
            {SPECIES_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  formData.species === option.value && styles.optionButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, species: option.value })}
              >
                <Text
                  style={[
                    styles.optionText,
                    formData.species === option.value && styles.optionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Breed */}
        <View style={styles.field}>
          <Text style={styles.label}>
            {language === 'hi' ? 'नस्ल' : language === 'cg' ? 'नस्ल' : 'Breed'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={language === 'hi' ? 'जैसे: गिर, मुर्रा' : language === 'cg' ? 'जैसे: गिर, मुर्रा' : 'e.g., Gir, Murrah'}
            placeholderTextColor="#9ca3af"
            value={formData.breed}
            onChangeText={(text) => setFormData({ ...formData, breed: text })}
          />
        </View>

        {/* Date of Birth */}
        <View style={styles.field}>
          <Text style={styles.label}>
            {language === 'hi' ? 'जन्म तिथि' : language === 'cg' ? 'जनम तिथि' : 'Date of Birth'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#9ca3af"
            value={formData.date_of_birth}
            onChangeText={(text) => setFormData({ ...formData, date_of_birth: text })}
          />
          <Text style={styles.hint}>
            {language === 'hi' ? 'उदाहरण: 2020-05-15' : language === 'cg' ? 'उदाहरण: 2020-05-15' : 'Example: 2020-05-15'}
          </Text>
        </View>

        {/* Health Status */}
        <View style={styles.field}>
          <Text style={styles.label}>
            {language === 'hi' ? 'स्वास्थ्य स्थिति' : language === 'cg' ? 'स्वास्थ्य स्थिति' : 'Health Status'}
          </Text>
          <View style={styles.optionsContainer}>
            {['healthy', 'sick', 'injured', 'recovering'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.optionButton,
                  formData.health_status === status && styles.optionButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, health_status: status })}
              >
                <Text
                  style={[
                    styles.optionText,
                    formData.health_status === status && styles.optionTextActive,
                  ]}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>
                {isEditing
                  ? (language === 'hi' ? 'अपडेट करें' : language === 'cg' ? 'अपडेट करब' : 'Update')
                  : (language === 'hi' ? 'सहेजें' : language === 'cg' ? 'सहेजब' : 'Save')}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  form: {
    padding: 16,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  hint: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 80,
  },
  optionButtonActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  optionText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  optionTextActive: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 16,
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
