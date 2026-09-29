import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';

interface MedicineStore {
  id: string;
  name: string;
  nameLocal: string;
  type: 'pharmacy' | 'veterinary' | 'ngo' | 'gaushala';
  location: string;
  phone: string;
  medicines: string[];
  rating: number;
  verified: boolean;
  distance?: string;
}

const MEDICINE_STORES: MedicineStore[] = [
  {
    id: '1',
    name: 'City Veterinary Pharmacy',
    nameLocal: 'शहर पशु चिकित्सा फार्मेसी',
    type: 'veterinary',
    location: 'Raipur, Near Railway Station',
    phone: '+91 771 1234567',
    medicines: ['Antibiotics', 'Vaccines', 'Supplements', 'First Aid'],
    rating: 4.5,
    verified: true,
    distance: '2.5 km',
  },
  {
    id: '2',
    name: 'General Medical Store',
    nameLocal: 'सामान्य मेडिकल स्टोर',
    type: 'pharmacy',
    location: 'Bilaspur, Main Market',
    phone: '+91 771 2345678',
    medicines: ['Basic Medicines', 'Pain Killers', 'Antiseptics'],
    rating: 4.2,
    verified: true,
    distance: '5.0 km',
  },
  {
    id: '3',
    name: 'Animal Welfare NGO Clinic',
    nameLocal: 'पशु कल्याण एनजीओ क्लिनिक',
    type: 'ngo',
    location: 'Durg, Sector 4',
    phone: '+91 771 3456789',
    medicines: ['Free Medicines', 'Vaccines', 'Emergency Supplies'],
    rating: 4.8,
    verified: true,
    distance: '3.2 km',
  },
  {
    id: '4',
    name: 'Local Gaushala',
    nameLocal: 'स्थानीय गौशाला',
    type: 'gaushala',
    location: 'Raipur, Village Area',
    phone: '+91 771 4567890',
    medicines: ['Ayurvedic', 'Traditional Remedies', 'Cattle Feed'],
    rating: 4.0,
    verified: false,
    distance: '1.8 km',
  },
];

const COMMON_MEDICINES = [
  { name: 'Oxytetracycline', nameLocal: 'ऑक्सीटेट्रासाइक्लिन', use: 'Bacterial infections', useLocal: 'बैक्टीरियल संक्रमण' },
  { name: 'Ivermectin', nameLocal: 'इवरमेक्टिन', use: 'Parasite control', useLocal: 'परजीवी नियंत्रण' },
  { name: 'Calcium Supplement', nameLocal: 'कैल्शियम सप्लीमेंट', use: 'Milk fever prevention', useLocal: 'दूध बुखार रोकथाम' },
  { name: 'Vitamin B Complex', nameLocal: 'विटामिन बी कॉम्प्लेक्स', use: 'General health', useLocal: 'सामान्य सेहत' },
  { name: 'Antihistamine', nameLocal: 'एंटीहिस्टामाइन', use: 'Allergic reactions', useLocal: 'एलर्जी प्रतिक्रिया' },
];

export default function MedicineScreen() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pharmacy' | 'veterinary' | 'ngo' | 'gaushala'>('all');
  const [selectedTab, setSelectedTab] = useState<'stores' | 'medicines'>('stores');

  const filteredStores = MEDICINE_STORES.filter(store => {
    const matchesSearch = 
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.nameLocal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || store.type === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const filters = [
    { id: 'all', label: language === 'hi' ? 'सभी' : language === 'cg' ? 'सब' : 'All' },
    { id: 'pharmacy', label: language === 'hi' ? 'फार्मेसी' : language === 'cg' ? 'फार्मेसी' : 'Pharmacy' },
    { id: 'veterinary', label: language === 'hi' ? 'पशु चिकित्सा' : language === 'cg' ? 'पशु डाक्टर' : 'Veterinary' },
    { id: 'ngo', label: 'NGO' },
    { id: 'gaushala', label: language === 'hi' ? 'गौशाला' : language === 'cg' ? 'गौशाला' : 'Gaushala' },
  ];

  const callStore = (phone: string, name: string) => {
    Alert.alert(
      language === 'hi' ? 'कॉल करें' : language === 'cg' ? 'कॉल करब' : 'Call',
      `${phone}`,
      [
        { text: language === 'hi' ? 'रद्द करें' : language === 'cg' ? 'रद करब' : 'Cancel', style: 'cancel' },
        { text: language === 'hi' ? 'कॉल करें' : language === 'cg' ? 'कॉल करब' : 'Call', onPress: () => {} },
      ]
    );
  };

  const renderStoreCard = (store: MedicineStore) => (
    <View key={store.id} style={styles.storeCard}>
      <View style={styles.storeHeader}>
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{language === 'hi' || language === 'cg' ? store.nameLocal : store.name}</Text>
          <View style={styles.storeMeta}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#f59e0b" />
              <Text style={styles.ratingText}>{store.rating}</Text>
            </View>
            {store.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={12} color="#10b981" />
                <Text style={styles.verifiedText}>
                  {language === 'hi' ? 'सत्यापित' : language === 'cg' ? 'सत्यापित' : 'Verified'}
                </Text>
              </View>
            )}
            {store.distance && (
              <Text style={styles.distanceText}>{store.distance}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => callStore(store.phone, store.name)}
        >
          <Ionicons name="call" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.storeDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="location" size={16} color="#6b7280" />
          <Text style={styles.detailText}>{store.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="call" size={16} color="#6b7280" />
          <Text style={styles.detailText}>{store.phone}</Text>
        </View>
      </View>

      <View style={styles.medicinesSection}>
        <Text style={styles.medicinesTitle}>
          {language === 'hi' ? 'उपलब्ध दवाएं' : language === 'cg' ? 'उपलब्ध दवाई' : 'Available Medicines'}
        </Text>
        <View style={styles.medicinesTags}>
          {store.medicines.slice(0, 3).map((medicine, index) => (
            <View key={index} style={styles.medicineTag}>
              <Text style={styles.medicineTagText}>{medicine}</Text>
            </View>
          ))}
          {store.medicines.length > 3 && (
            <Text style={styles.moreMedicines}>+{store.medicines.length - 3}</Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderMedicineItem = (medicine: typeof COMMON_MEDICINES[0]) => (
    <View key={medicine.name} style={styles.medicineItem}>
      <View style={styles.medicineIcon}>
        <Ionicons name="medkit" size={24} color="#4f46e5" />
      </View>
      <View style={styles.medicineDetails}>
        <Text style={styles.medicineName}>{language === 'hi' || language === 'cg' ? medicine.nameLocal : medicine.name}</Text>
        <Text style={styles.medicineUse}>
          {language === 'hi' || language === 'cg' ? medicine.useLocal : medicine.use}
        </Text>
      </View>
      <TouchableOpacity style={styles.infoButton}>
        <Ionicons name="information-circle" size={24} color="#6b7280" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {language === 'hi' ? 'दवा उपलब्धता' : language === 'cg' ? 'दवा उपलब्धता' : 'Medicine Availability'}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'hi' ? 'पास के फार्मेसी और दवाएं खोजें' : language === 'cg' ? 'पास के फार्मेसी और दवाई खोजब' : 'Find nearby pharmacies and medicines'}
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'stores' && styles.activeTab]}
          onPress={() => setSelectedTab('stores')}
        >
          <Text style={[styles.tabText, selectedTab === 'stores' && styles.activeTabText]}>
            {language === 'hi' ? 'दुकानें' : language === 'cg' ? 'दुकान' : 'Stores'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'medicines' && styles.activeTab]}
          onPress={() => setSelectedTab('medicines')}
        >
          <Text style={[styles.tabText, selectedTab === 'medicines' && styles.activeTabText]}>
            {language === 'hi' ? 'दवाएं' : language === 'cg' ? 'दवाई' : 'Medicines'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder={
            selectedTab === 'stores'
              ? language === 'hi' ? 'दुकान खोजें...' : language === 'cg' ? 'दुकान खोजब...' : 'Search stores...'
              : language === 'hi' ? 'दवा खोजें...' : language === 'cg' ? 'दवा खोजब...' : 'Search medicines...'
          }
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {selectedTab === 'stores' ? (
        <>
          {/* Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[styles.filterButton, selectedFilter === filter.id && styles.activeFilter]}
                onPress={() => setSelectedFilter(filter.id as any)}
              >
                <Text style={[styles.filterText, selectedFilter === filter.id && styles.activeFilterText]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Store List */}
          <ScrollView style={styles.content}>
            {filteredStores.length > 0 ? (
              filteredStores.map(renderStoreCard)
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="storefront-outline" size={64} color="#9ca3af" />
                <Text style={styles.emptyText}>
                  {language === 'hi' ? 'कोई दुकान नहीं मिली' : language === 'cg' ? 'कोई दुकान ना मिले' : 'No stores found'}
                </Text>
              </View>
            )}
          </ScrollView>
        </>
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.medicinesHeader}>
            <Text style={styles.medicinesHeaderTitle}>
              {language === 'hi' ? 'सामान्य पशु दवाएं' : language === 'cg' ? 'सामान्य पशु दवाई' : 'Common Animal Medicines'}
            </Text>
            <Text style={styles.medicinesHeaderSubtitle}>
              {language === 'hi' ? 'गाय, बैल, बकरी के लिए' : language === 'cg' ? 'गाय, सांड, बकरी खर' : 'For cows, bulls, goats'}
            </Text>
          </View>
          {COMMON_MEDICINES.map(renderMedicineItem)}
        </ScrollView>
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4f46e5',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
  },
  activeTabText: {
    color: '#4f46e5',
    fontWeight: '600',
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
  filtersContainer: {
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
  storeCard: {
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
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  storeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  verifiedText: {
    fontSize: 10,
    color: '#065f46',
    marginLeft: 2,
  },
  distanceText: {
    fontSize: 12,
    color: '#6b7280',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
  },
  medicinesSection: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  medicinesTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 8,
  },
  medicinesTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  medicineTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  medicineTagText: {
    fontSize: 10,
    color: '#4b5563',
  },
  moreMedicines: {
    fontSize: 10,
    color: '#6b7280',
    marginLeft: 4,
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
  medicinesHeader: {
    marginBottom: 16,
  },
  medicinesHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  medicinesHeaderSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  medicineItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  medicineIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  medicineDetails: {
    flex: 1,
  },
  medicineName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  medicineUse: {
    fontSize: 12,
    color: '#6b7280',
  },
  infoButton: {
    padding: 8,
  },
});