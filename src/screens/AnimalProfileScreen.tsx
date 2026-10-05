import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { AnimalService, Animal } from '../services/AnimalService';

type RouteParams = {
  AnimalProfile: {
    animalId: string;
  };
};

export default function AnimalProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'AnimalProfile'>>();
  const { animalId } = route.params;
  const { language } = useLanguage();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadAnimal();
  }, [animalId]);

  const loadAnimal = async () => {
    setLoading(true);
    try {
      const { data, error } = await AnimalService.getAnimal(animalId);
      if (error) {
        Alert.alert('Error', error.message);
        navigation.goBack();
      } else if (data) {
        setAnimal(data);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate('AddEditAnimal', { animalId });
  };

  const handleDelete = () => {
    Alert.alert(
      language === 'hi' ? 'पशु हटाएं' : language === 'cg' ? 'पशु हटाब' : 'Delete Animal',
      language === 'hi'
        ? 'क्या आप वाकई इस पशु को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।'
        : language === 'cg'
        ? 'क्या तोह सच में एह पशु के हटाना चाहू? एह काम पूर्ववत नाहीं कर सकत।'
        : 'Are you sure you want to delete this animal? This action cannot be undone.',
      [
        {
          text: language === 'hi' ? 'रद्द करें' : language === 'cg' ? 'रद करब' : 'Cancel',
          style: 'cancel',
        },
        {
          text: language === 'hi' ? 'हटाएं' : language === 'cg' ? 'हटाब' : 'Delete',
          style: 'destructive',
          onPress: confirmDelete,
        },
      ]
    );
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const { error } = await AnimalService.deleteAnimal(animalId);
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert(
          language === 'hi' ? 'Success' : language === 'cg' ? 'Success' : 'Success',
          language === 'hi' ? 'पशु हटा दिया गया' : language === 'cg' ? 'पशु हटा दिहयो' : 'Animal deleted successfully',
          [
            {
              text: language === 'hi' ? 'OK' : language === 'cg' ? 'OK' : 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setDeleting(false);
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

  if (!animal) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text style={styles.errorText}>
          {language === 'hi' ? 'पशु नहीं मिला' : language === 'cg' ? 'पशु नाहीं मिले' : 'Animal not found'}
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
        <Text style={styles.title}>{animal.name}</Text>
        <TouchableOpacity onPress={handleEdit} style={styles.iconButton}>
          <Ionicons name="create-outline" size={24} color="#4f46e5" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Profile Image Placeholder */}
        <View style={styles.profileImagePlaceholder}>
          <Ionicons name="paw" size={64} color="#d1d5db" />
          <Text style={styles.placeholderText}>
            {language === 'hi' ? 'फोटो जोड़ें' : language === 'cg' ? 'फोटो जोड़ब' : 'Add Photo'}
          </Text>
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === 'hi' ? 'बुनियादी जानकारी' : language === 'cg' ? 'बुनियादी जानकारी' : 'Basic Information'}
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {language === 'hi' ? 'नाम' : language === 'cg' ? 'नाम' : 'Name'}
            </Text>
            <Text style={styles.infoValue}>{animal.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {language === 'hi' ? 'प्रजाति' : language === 'cg' ? 'प्रजाति' : 'Species'}
            </Text>
            <Text style={styles.infoValue}>{animal.species}</Text>
          </View>

          {animal.breed && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                {language === 'hi' ? 'नस्ल' : language === 'cg' ? 'नस्ल' : 'Breed'}
              </Text>
              <Text style={styles.infoValue}>{animal.breed}</Text>
            </View>
          )}

          {animal.date_of_birth && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                {language === 'hi' ? 'जन्म तिथि' : language === 'cg' ? 'जनम तिथि' : 'Date of Birth'}
              </Text>
              <Text style={styles.infoValue}>{animal.date_of_birth}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {language === 'hi' ? 'स्वास्थ्य स्थिति' : language === 'cg' ? 'स्वास्थ्य स्थिति' : 'Health Status'}
            </Text>
            <View style={styles.statusBadge}>
              <Ionicons
                name="heart"
                size={16}
                color={animal.health_status === 'healthy' ? '#10b981' : '#f59e0b'}
              />
              <Text style={styles.statusText}>{animal.health_status || 'Unknown'}</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === 'hi' ? 'कार्य' : language === 'cg' ? 'काम' : 'Actions'}
          </Text>

          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <Ionicons name="create-outline" size={20} color="#4f46e5" />
            <Text style={styles.actionButtonText}>
              {language === 'hi' ? 'पशु संपादित करें' : language === 'cg' ? 'पशु संपादित करब' : 'Edit Animal'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="medical-outline" size={20} color="#10b981" />
            <Text style={styles.actionButtonText}>
              {language === 'hi' ? 'स्वास्थ्य रिकॉर्ड' : language === 'cg' ? 'स्वास्थ्य रिकॉर्ड' : 'Health Records'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <ActivityIndicator color="#ef4444" />
            ) : (
              <>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
                <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                  {language === 'hi' ? 'पशु हटाएं' : language === 'cg' ? 'पशु हटाब' : 'Delete Animal'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
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
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ef4444',
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
  iconButton: {
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
  content: {
    padding: 16,
  },
  profileImagePlaceholder: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9ca3af',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 12,
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
  },
  deleteButtonText: {
    color: '#ef4444',
  },
});
