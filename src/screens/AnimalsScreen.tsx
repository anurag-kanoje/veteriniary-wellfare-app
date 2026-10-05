import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { AnimalService, Animal } from '../services/AnimalService';

export default function AnimalsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnimals = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await AnimalService.getMyAnimals();
      if (error) {
        setError(error.message);
      } else {
        setAnimals(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnimals();
  }, []);

  const renderAnimalCard = ({ item }: { item: Animal }) => (
    <TouchableOpacity
      style={styles.animalCard}
      onPress={() => navigation.navigate('AnimalProfile', { animalId: item.id })}
    >
      <View style={styles.animalInfo}>
        <View style={styles.animalHeader}>
          <Text style={styles.animalName}>{item.name}</Text>
          <Text style={styles.animalType}>{item.species}</Text>
        </View>
        {item.breed && (
          <Text style={styles.animalBreed}>{item.breed}</Text>
        )}
        {item.date_of_birth && (
          <Text style={styles.animalAge}>
            {language === 'hi' ? 'जन्म: ' : language === 'cg' ? 'जनम: ' : 'Born: '}{item.date_of_birth}
          </Text>
        )}
        {item.health_status && (
          <View style={styles.statusRow}>
            <Ionicons name="heart" size={16} color={item.health_status === 'healthy' ? '#10b981' : '#f59e0b'} />
            <Text style={styles.statusText}>{item.health_status}</Text>
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="paw-outline" size={64} color="#d1d5db" />
      <Text style={styles.emptyTitle}>
        {language === 'hi' ? 'आपने अभी तक कोई पशु नहीं जोड़ा' : language === 'cg' ? 'तोह अभी तक कोई पशु नाहीं जोड़े' : "You haven't added an animal yet"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {language === 'hi' ? 'अपने पशु का रिकॉर्ड शुरू करें' : language === 'cg' ? 'तोहर पशु रिकॉर्ड शुरू करब' : 'Start by adding your first animal'}
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('AddEditAnimal')}
      >
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.emptyButtonText}>
          {language === 'hi' ? 'पशु जोड़ें' : language === 'cg' ? 'पशु जोड़ब' : 'Add Animal'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
      <Text style={styles.emptyTitle}>
        {language === 'hi' ? 'लोड करने में विफल' : language === 'cg' ? 'लोड करन में फेल' : 'Unable to load your animals'}
      </Text>
      <Text style={styles.emptySubtitle}>{error}</Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={loadAnimals}
      >
        <Ionicons name="refresh" size={20} color="#fff" />
        <Text style={styles.emptyButtonText}>
          {language === 'hi' ? 'पुनः प्रयास करें' : language === 'cg' ? 'फिर कोशिश करब' : 'Retry'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#4f46e5" />
      <Text style={styles.loadingText}>
        {language === 'hi' ? 'आपके पशु लोड हो रहे हैं...' : language === 'cg' ? 'तोहर पशु लोड होए हैं...' : 'Loading your animals...'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {language === 'hi' ? 'मेरे पशु' : language === 'cg' ? 'मोर पशु' : 'My Animals'}
          </Text>
        </View>
        {renderLoadingState()}
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {language === 'hi' ? 'मेरे पशु' : language === 'cg' ? 'मोर पशु' : 'My Animals'}
          </Text>
        </View>
        <ScrollView style={styles.content}>{renderErrorState()}</ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {language === 'hi' ? 'मेरे पशु' : language === 'cg' ? 'मोर पशु' : 'My Animals'}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {animals.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={animals}
            renderItem={renderAnimalCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddEditAnimal')}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.floatingButtonText}>
          {language === 'hi' ? 'पशु जोड़ें' : language === 'cg' ? 'पशु जोड़ब' : 'Add Animal'}
        </Text>
      </TouchableOpacity>
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
    marginBottom: 4,
  },
  animalAge: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
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
