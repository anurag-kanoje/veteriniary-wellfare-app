import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { MedicineService, Medicine } from '../services/MedicineService';

export default function MedicineScreen() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  useEffect(() => {
    loadMedicines();
    loadCategories();
  }, []);

  const loadMedicines = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await MedicineService.getAllMedicines();
      if (result.error) {
        setError(result.error.message);
      } else {
        setMedicines(result.data || []);
      }
    } catch (err) {
      setError('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const result = await MedicineService.getCategories();
      if (result.data) {
        setCategories(result.data);
      }
    } catch (err) {
      console.error('Failed to load categories');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadMedicines();
      return;
    }

    setLoading(true);
    try {
      const result = await MedicineService.searchMedicines(searchQuery);
      if (result.error) {
        setError(result.error.message);
      } else {
        setMedicines(result.data || []);
      }
    } catch (err) {
      setError('Failed to search medicines');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (category: string) => {
    setSelectedCategory(category);
    setLoading(true);

    try {
      const result = category === 'all'
        ? await MedicineService.getAllMedicines()
        : await MedicineService.getMedicinesByCategory(category);

      if (result.error) {
        setError(result.error.message);
      } else {
        setMedicines(result.data || []);
      }
    } catch (err) {
      setError('Failed to filter medicines');
    } finally {
      setLoading(false);
    }
  };

  const renderMedicineCard = (medicine: Medicine) => (
    <TouchableOpacity
      key={medicine.id}
      style={styles.card}
      onPress={() => setSelectedMedicine(medicine)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{medicine.name}</Text>
        {medicine.availability === 'available' && (
          <View style={styles.availableBadge}>
            <Text style={styles.availableText}>Available</Text>
          </View>
        )}
      </View>
      {medicine.category && (
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{medicine.category}</Text>
        </View>
      )}
      {medicine.description && (
        <Text style={styles.cardDescription} numberOfLines={2}>
          {medicine.description}
        </Text>
      )}
      {medicine.manufacturer && (
        <Text style={styles.cardManufacturer}>{medicine.manufacturer}</Text>
      )}
      {medicine.price_range && (
        <Text style={styles.cardPrice}>{medicine.price_range}</Text>
      )}
    </TouchableOpacity>
  );

  const renderMedicineDetail = () => (
    <ScrollView style={styles.detailContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => setSelectedMedicine(null)}>
        <Ionicons name="arrow-back" size={24} color="#4f46e5" />
        <Text style={styles.backButtonText}>
          {language === 'hi' ? 'वापस' : language === 'cg' ? 'वापस' : 'Back'}
        </Text>
      </TouchableOpacity>

      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>{selectedMedicine?.name}</Text>
        {selectedMedicine?.category && (
          <View style={styles.detailCategoryBadge}>
            <Text style={styles.detailCategoryText}>{selectedMedicine.category}</Text>
          </View>
        )}
        {selectedMedicine?.availability === 'available' && (
          <View style={styles.detailAvailableBadge}>
            <Text style={styles.detailAvailableText}>Available</Text>
          </View>
        )}

        {selectedMedicine?.description && (
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>
              {language === 'hi' ? 'विवरण' : language === 'cg' ? 'विवरण' : 'Description'}
            </Text>
            <Text style={styles.detailSectionContent}>{selectedMedicine.description}</Text>
          </View>
        )}

        {selectedMedicine?.manufacturer && (
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>
              {language === 'hi' ? 'निर्माता' : language === 'cg' ? 'निर्माता' : 'Manufacturer'}
            </Text>
            <Text style={styles.detailSectionContent}>{selectedMedicine.manufacturer}</Text>
          </View>
        )}

        {selectedMedicine?.dosage && (
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>
              {language === 'hi' ? 'खुराक' : language === 'cg' ? 'खुराक' : 'Dosage'}
            </Text>
            <Text style={styles.detailSectionContent}>{selectedMedicine.dosage}</Text>
          </View>
        )}

        {selectedMedicine?.side_effects && (
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>
              {language === 'hi' ? 'दुष्प्रभाव' : language === 'cg' ? 'दुष्प्रभाव' : 'Side Effects'}
            </Text>
            <Text style={styles.detailSectionContent}>{selectedMedicine.side_effects}</Text>
          </View>
        )}

        {selectedMedicine?.contraindications && (
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>
              {language === 'hi' ? 'विरोध-संकेत' : language === 'cg' ? 'विरोध-संकेत' : 'Contraindications'}
            </Text>
            <Text style={styles.detailSectionContent}>{selectedMedicine.contraindications}</Text>
          </View>
        )}

        {selectedMedicine?.storage_requirements && (
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>
              {language === 'hi' ? 'भंडारण' : language === 'cg' ? 'भंडारण' : 'Storage'}
            </Text>
            <Text style={styles.detailSectionContent}>{selectedMedicine.storage_requirements}</Text>
          </View>
        )}

        {selectedMedicine?.price_range && (
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>
              {language === 'hi' ? 'मूल्य सीमा' : language === 'cg' ? 'मूल्य सीमा' : 'Price Range'}
            </Text>
            <Text style={styles.detailSectionContent}>{selectedMedicine.price_range}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  if (selectedMedicine) {
    return renderMedicineDetail();
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>
          {language === 'hi' ? 'लोड हो रहा है...' : language === 'cg' ? 'लोड होरहा है...' : 'Loading...'}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadMedicines}>
          <Text style={styles.retryButtonText}>
            {language === 'hi' ? 'पुनः कोशिश करें' : language === 'cg' ? 'फेर कोशिश करें' : 'Retry'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {language === 'hi' ? 'दवा निर्देशिका' : language === 'cg' ? 'दवा निर्देशिका' : 'Medicine Directory'}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={
            language === 'hi' 
              ? 'दवा खोजें...' 
              : language === 'cg' 
              ? 'दवा खोजब...' 
              : 'Search medicines...'
          }
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryScrollContent}
      >
        <TouchableOpacity
          style={[styles.categoryChip, selectedCategory === 'all' && styles.selectedCategoryChip]}
          onPress={() => handleCategoryFilter('all')}
        >
          <Text style={[styles.categoryChipText, selectedCategory === 'all' && styles.selectedCategoryChipText]}>
            {language === 'hi' ? 'सभी' : language === 'cg' ? 'सब' : 'All'}
          </Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryChip, selectedCategory === category && styles.selectedCategoryChip]}
            onPress={() => handleCategoryFilter(category)}
          >
            <Text style={[styles.categoryChipText, selectedCategory === category && styles.selectedCategoryChipText]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content}>
        {medicines.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="medkit-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyText}>
              {language === 'hi' ? 'कोई दवा नहीं मिली' : language === 'cg' ? 'कोई दवा नहीं मिले' : 'No medicines found'}
            </Text>
          </View>
        ) : (
          medicines.map(renderMedicineCard)
        )}
      </ScrollView>
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
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  searchContainer: {
    flexDirection: 'row',
    margin: 16,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#4f46e5',
    width: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryScroll: {
    marginBottom: 8,
  },
  categoryScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedCategoryChip: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#6b7280',
  },
  selectedCategoryChipText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  availableBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  availableText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  categoryBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#4f46e5',
    textTransform: 'capitalize',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  cardManufacturer: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4f46e5',
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4f46e5',
    marginLeft: 8,
    fontWeight: '600',
  },
  detailCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  detailCategoryBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  detailCategoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4f46e5',
    textTransform: 'capitalize',
  },
  detailAvailableBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  detailAvailableText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  detailSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  detailSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  detailSectionContent: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 32,
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#4f46e5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
