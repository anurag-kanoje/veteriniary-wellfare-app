import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useOffline } from '../contexts/OfflineContext';

type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

interface RescueReport {
  animalType: string;
  description: string;
  location: string;
  urgencyLevel: UrgencyLevel;
  contactPhone: string;
  images: string[];
}

const LOCAL_NGOS = [
  {
    id: '1',
    name: 'छत्तीसगढ़ पशु कल्याण संघ',
    nameEn: 'Chhattisgarh Animal Welfare Society',
    phone: '+91 771 1234567',
    location: 'Raipur',
    specialties: ['Cattle', 'Stray Animals'],
  },
  {
    id: '2',
    name: 'गौ सेवा दल',
    nameEn: 'Cow Service Team',
    phone: '+91 771 2345678',
    location: 'Bilaspur',
    specialties: ['Cows', 'Bulls'],
  },
  {
    id: '3',
    name: 'पशु चिकित्सा सहायता केंद्र',
    nameEn: 'Veterinary Help Center',
    phone: '+91 771 3456789',
    location: 'Durg',
    specialties: ['All Animals', 'Emergency'],
  },
];

export default function RescueScreen() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { isOffline, addToSyncQueue } = useOffline();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(null);
  
  const [formData, setFormData] = useState<RescueReport>({
    animalType: '',
    description: '',
    location: '',
    urgencyLevel: 'medium',
    contactPhone: user?.user_metadata?.phone || '+91 ',
    images: [],
  });

  const animalTypes = [
    { id: 'cow', label: language === 'hi' ? 'गाय' : language === 'cg' ? 'गाय' : 'Cow', icon: 'leaf' },
    { id: 'bull', label: language === 'hi' ? 'बैल' : language === 'cg' ? 'सांड' : 'Bull', icon: 'person' },
    { id: 'goat', label: language === 'hi' ? 'बकरी' : language === 'cg' ? 'बकरी' : 'Goat', icon: 'paw' },
    { id: 'dog', label: language === 'hi' ? 'कुत्ता' : language === 'cg' ? 'कुत्ता' : 'Dog', icon: 'shield' },
    { id: 'cat', label: language === 'hi' ? 'बिल्ली' : language === 'cg' ? 'बिल्ली' : 'Cat', icon: 'fish' },
    { id: 'other', label: language === 'hi' ? 'अन्य' : language === 'cg' ? 'अन्य' : 'Other', icon: 'ellipsis-horizontal' },
  ];

  const urgencyLevels: { level: UrgencyLevel; label: string; color: string }[] = [
    { level: 'low', label: language === 'hi' ? 'कम' : language === 'cg' ? 'कम' : 'Low', color: '#10b981' },
    { level: 'medium', label: language === 'hi' ? 'मध्यम' : language === 'cg' ? 'मध्यम' : 'Medium', color: '#f59e0b' },
    { level: 'high', label: language === 'hi' ? 'उच्च' : language === 'cg' ? 'जादा' : 'High', color: '#f97316' },
    { level: 'critical', label: language === 'hi' ? 'तत्काल' : language === 'cg' ? 'बहुत जरूरी' : 'Critical', color: '#dc2626' },
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        language === 'hi' ? 'अनुमति आवश्यक' : language === 'cg' ? 'अनुमति जरूरी' : 'Permission Required',
        language === 'hi' ? 'फोटो लिएने के लिए अनुमति दें' : language === 'cg' ? 'फोटो लेबे खर अनुमति देब' : 'Please allow photo library access'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const captureLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          language === 'hi' ? 'अनुमति आवश्यक' : language === 'cg' ? 'अनुमति जरूरी' : 'Permission Required',
          language === 'hi' ? 'स्थान कैप्चर करने के लिए अनुमति दें' : language === 'cg' ? 'जगह कैप्चर करब खर अनुमति देब' : 'Please allow location access'
        );
        setLocationLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`;
      
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address,
      });
      
      setFormData({ ...formData, location: address });
    } catch (error) {
      Alert.alert(
        language === 'hi' ? 'त्रुटि' : language === 'cg' ? 'गलती' : 'Error',
        language === 'hi' ? 'स्थान प्राप्त करने में विफल' : language === 'cg' ? 'जगह मिलब में फेल' : 'Failed to get location'
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const submitReport = async () => {
    if (!formData.animalType || !formData.description || !formData.location) {
      Alert.alert(
        language === 'hi' ? 'गलती' : language === 'cg' ? 'गलती' : 'Error',
        language === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें' : language === 'cg' ? 'सब जरूरी फील्ड भरब' : 'Please fill all required fields'
      );
      return;
    }

    setLoading(true);
    try {
      const reportData = {
        type: 'rescue_report',
        data: {
          ...formData,
          userId: user?.id,
          images,
          location: currentLocation,
        },
      };

      if (isOffline) {
        // Add to sync queue for later
        await addToSyncQueue(reportData);
        
        Alert.alert(
          language === 'hi' ? 'ऑफ़लाइन सेव' : language === 'cg' ? 'ऑफ़लाइन सेव' : 'Saved Offline',
          language === 'hi' ? 'रिपोर्ट सेव हो गई। ऑनलाइन होने पर सबमिट होगी।' : language === 'cg' ? 'रिपोर्ट सेव हो गय। ऑनलाइन होय पर सबमिट होही।' : 'Report saved. Will submit when online.',
          [
            {
              text: language === 'hi' ? 'ठीक है' : language === 'cg' ? 'ठीक' : 'OK',
              onPress: () => {
                setFormData({
                  animalType: '',
                  description: '',
                  location: '',
                  urgencyLevel: 'medium',
                  contactPhone: user?.user_metadata?.phone || '+91 ',
                  images: [],
                });
                setImages([]);
                setCurrentLocation(null);
              },
            },
          ]
        );
      } else {
        // In real implementation, save to Supabase
        // For now, simulate success
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        Alert.alert(
          language === 'hi' ? 'सफलता' : language === 'cg' ? 'सफलता' : 'Success',
          language === 'hi' ? 'रिपोर्ट जमा हो गई। पास के एनजीओ को सूचित कर दिया जाएगा।' : language === 'cg' ? 'रिपोर्ट जमा हो गय। पास के एनजीओ ल सूचित कर दिय जाही।' : 'Report submitted. Nearby NGOs will be notified.',
          [
            {
              text: language === 'hi' ? 'ठीक है' : language === 'cg' ? 'ठीक' : 'OK',
              onPress: () => {
                setFormData({
                  animalType: '',
                  description: '',
                  location: '',
                  urgencyLevel: 'medium',
                  contactPhone: user?.user_metadata?.phone || '+91 ',
                  images: [],
                });
                setImages([]);
                setCurrentLocation(null);
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        language === 'hi' ? 'त्रुटि' : language === 'cg' ? 'गलती' : 'Error',
        language === 'hi' ? 'रिपोर्ट जमा करने में विफल' : language === 'cg' ? 'रिपोर्ट जमा करब में फेल' : 'Failed to submit report'
      );
    } finally {
      setLoading(false);
    }
  };

  const callNGO = (phone: string) => {
    Alert.alert(
      language === 'hi' ? 'कॉल करें' : language === 'cg' ? 'कॉल करब' : 'Call',
      `${phone}`,
      [
        { text: language === 'hi' ? 'रद्द करें' : language === 'cg' ? 'रद करब' : 'Cancel', style: 'cancel' },
        { text: language === 'hi' ? 'कॉल करें' : language === 'cg' ? 'कॉल करब' : 'Call', onPress: () => {} },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {language === 'hi' ? 'पशु बचाव रिपोर्ट' : language === 'cg' ? 'पशु बचाव रिपोर्ट' : 'Animal Rescue Report'}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'hi' ? 'घायल या बीमार जानवरों की सूचना दें' : language === 'cg' ? 'घायल या बीमार पशु के बारे में बताब' : 'Report injured or sick animals'}
        </Text>
      </View>

      {/* NGO Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {language === 'hi' ? 'पास के एनजीओ' : language === 'cg' ? 'पास के एनजीओ' : 'Nearby NGOs'}
        </Text>
        {LOCAL_NGOS.map((ngo) => (
          <View key={ngo.id} style={styles.ngoCard}>
            <View style={styles.ngoInfo}>
              <Text style={styles.ngoName}>{language === 'hi' || language === 'cg' ? ngo.name : ngo.nameEn}</Text>
              <Text style={styles.ngoLocation}>{ngo.location}</Text>
              <View style={styles.specialties}>
                {ngo.specialties.map((spec, index) => (
                  <View key={index} style={styles.specialtyTag}>
                    <Text style={styles.specialtyText}>{spec}</Text>
                  </View>
                ))}
              </View>
            </View>
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => callNGO(ngo.phone)}
            >
              <Ionicons name="call" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Report Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {language === 'hi' ? 'रिपोर्ट फॉर्म' : language === 'cg' ? 'रिपोर्ट फॉर्म' : 'Report Form'}
        </Text>

        {/* Animal Type */}
        <Text style={styles.label}>
          {language === 'hi' ? 'पशु का प्रकार' : language === 'cg' ? 'पशु के प्रकार' : 'Animal Type'}
        </Text>
        <View style={styles.animalTypesContainer}>
          {animalTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.animalTypeButton,
                formData.animalType === type.id && styles.selectedAnimalType,
              ]}
              onPress={() => setFormData({ ...formData, animalType: type.id })}
            >
              <Ionicons
                name={type.icon as any}
                size={24}
                color={formData.animalType === type.id ? '#fff' : '#6b7280'}
              />
              <Text
                style={[
                  styles.animalTypeLabel,
                  formData.animalType === type.id && styles.selectedAnimalTypeLabel,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Description */}
        <Text style={styles.label}>
          {language === 'hi' ? 'विवरण' : language === 'cg' ? 'विवरण' : 'Description'}
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder={
            language === 'hi'
              ? 'जानवर की स्थिति का विवरण दें...'
              : language === 'cg'
              ? 'पशु के हाल के बारे में बताब...'
              : 'Describe the animal condition...'
          }
          placeholderTextColor="#9ca3af"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={4}
        />

        {/* Location */}
        <Text style={styles.label}>
          {language === 'hi' ? 'स्थान' : language === 'cg' ? 'जगह' : 'Location'}
        </Text>
        <View style={styles.locationContainer}>
          <TextInput
            style={styles.locationInput}
            placeholder={
              language === 'hi' ? 'स्थान या GPS निर्देशांक' : language === 'cg' ? 'जगह या GPS' : 'Location or GPS coordinates'
            }
            placeholderTextColor="#9ca3af"
            value={formData.location}
            onChangeText={(text) => setFormData({ ...formData, location: text })}
          />
          <TouchableOpacity
            style={styles.locationButton}
            onPress={captureLocation}
            disabled={locationLoading}
          >
            {locationLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="location" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        {/* Urgency Level */}
        <Text style={styles.label}>
          {language === 'hi' ? 'तत्कालता स्तर' : language === 'cg' ? 'जरूरत के स्तर' : 'Urgency Level'}
        </Text>
        <View style={styles.urgencyContainer}>
          {urgencyLevels.map((urgency) => (
            <TouchableOpacity
              key={urgency.level}
              style={[
                styles.urgencyButton,
                { backgroundColor: urgency.color },
                formData.urgencyLevel === urgency.level && styles.selectedUrgency,
              ]}
              onPress={() => setFormData({ ...formData, urgencyLevel: urgency.level })}
            >
              <Text
                style={[
                  styles.urgencyLabel,
                  formData.urgencyLevel === urgency.level && styles.selectedUrgencyLabel,
                ]}
              >
                {urgency.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Phone */}
        <Text style={styles.label}>
          {language === 'hi' ? 'संपर्क फोन' : language === 'cg' ? 'संपर्क फोन' : 'Contact Phone'}
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="+91 XXXXX XXXXX"
          placeholderTextColor="#9ca3af"
          value={formData.contactPhone}
          onChangeText={(text) => setFormData({ ...formData, contactPhone: text })}
          keyboardType="phone-pad"
        />

        {/* Images */}
        <Text style={styles.label}>
          {language === 'hi' ? 'फोटो (वैकल्पिक)' : language === 'cg' ? 'फोटो (चाहे तब)' : 'Photos (Optional)'}
        </Text>
        <View style={styles.imagesContainer}>
          {images.map((image, index) => (
            <View key={index} style={styles.imageItem}>
              <Image source={{ uri: image }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImages(images.filter((_, i) => i !== index))}
              >
                <Ionicons name="close-circle" size={20} color="#dc2626" />
              </TouchableOpacity>
            </View>
          ))}
          {images.length < 3 && (
            <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
              <Ionicons name="add" size={24} color="#6b7280" />
              <Text style={styles.addImageText}>
                {language === 'hi' ? 'फोटो जोड़ें' : language === 'cg' ? 'फोटो जोड़ब' : 'Add Photo'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={submitReport}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {language === 'hi' ? 'रिपोर्ट जमा करें' : language === 'cg' ? 'रिपोर्ट जमा करब' : 'Submit Report'}
            </Text>
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
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  ngoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  ngoInfo: {
    flex: 1,
  },
  ngoName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  ngoLocation: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  specialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyTag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 2,
  },
  specialtyText: {
    fontSize: 10,
    color: '#4f46e5',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  animalTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  animalTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedAnimalType: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  animalTypeLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  selectedAnimalTypeLabel: {
    color: '#fff',
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    textAlignVertical: 'top',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInput: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 8,
  },
  locationButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  urgencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  urgencyButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    opacity: 0.6,
  },
  selectedUrgency: {
    opacity: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  urgencyLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  selectedUrgencyLabel: {
    fontWeight: '700',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imageItem: {
    position: 'relative',
    marginRight: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});