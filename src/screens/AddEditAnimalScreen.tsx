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
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { AnimalService, CreateAnimalInput, UpdateAnimalInput, Animal } from '../services/AnimalService';
import { ImageService } from '../services/ImageService';

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
  const route = useRoute();
  const params = route.params as RouteParams['AddEditAnimal'] || {};
  const animalId = params.animalId;
  const { language } = useLanguage();
  const [isEditing, setIsEditing] = useState(!!animalId);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

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
        if (data.photo_url) {
          setImageUri(data.photo_url);
        }
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        language === 'hi' ? 'Permission Required' : language === 'cg' ? 'Permission Required' : 'Permission Required',
        language === 'hi' ? 'Please allow photo library access' : language === 'cg' ? 'Please allow photo library access' : 'Please allow photo library access'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0 && result.assets[0]) {
      setImageUri(result.assets[0].uri);
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
    let photoUrl: string | undefined = undefined;

    try {
      // Upload image if selected
      if (imageUri) {
        setUploadingImage(true);
        const imageResult = await ImageService.uploadImage(
          imageUri,
          'animal-profiles',
          `animal-${Date.now()}`
        );
        if (imageResult.error) {
          throw imageResult.error;
        }
        photoUrl = imageResult.data?.publicUrl;
        setUploadingImage(false);
      }

      const input: CreateAnimalInput = {
        name: formData.name.trim(),
        species: formData.species,
        breed: formData.breed.trim() || undefined,
        date_of_birth: formData.date_of_birth || undefined,
        health_status: formData.health_status,
        photo_url: photoUrl,
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
      setUploadingImage(false);
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
        {/* Photo Upload */}
        <View style={styles.field}>
          <Text style={styles.label}>
            {language === 'hi' ? 'फोटो' : language === 'cg' ? 'फोटो' : 'Photo'}
          </Text>
          <TouchableOpacity style={styles.imageUploadButton} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera-outline" size={32} color="#9ca3af" />
                <Text style={styles.imagePlaceholderText}>
                  {language === 'hi' ? 'फोटो जोड़ें' : language === 'cg' ? 'फोटो जोड़ब' : 'Add Photo'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {imageUri && (
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setImageUri(null)}
            >
              <Ionicons name="close-circle" size={20} color="#ef4444" />
              <Text style={styles.removeImageText}>
                {language === 'hi' ? 'हटाएं' : language === 'cg' ? 'हटाब' : 'Remove'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

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
  imageUploadButton: {
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  removeImageText: {
    fontSize: 14,
    color: '#ef4444',
    marginLeft: 4,
  },
});
