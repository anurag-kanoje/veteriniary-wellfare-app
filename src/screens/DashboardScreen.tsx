import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useOffline } from '../contexts/OfflineContext';
import { AnimalService } from '../services/AnimalService';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  onPress?: () => void;
};

const StatCard = ({ title, value, icon, color, onPress }: StatCardProps) => (
  <TouchableOpacity
    style={[styles.statCard, { backgroundColor: color + '20', borderLeftColor: color }]}
    onPress={onPress}
  >
    <View style={styles.statContent}>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Ionicons name={icon} size={32} color={color} />
    </View>
  </TouchableOpacity>
);

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { profile } = useAuth();
  const { t, language } = useLanguage();
  const { isOffline } = useOffline();
  const [animalCount, setAnimalCount] = useState(0);
  const [loadingAnimals, setLoadingAnimals] = useState(true);

  useEffect(() => {
    loadAnimalCount();
  }, []);

  const loadAnimalCount = async () => {
    try {
      const { data } = await AnimalService.getMyAnimals();
      setAnimalCount(data?.length || 0);
    } catch (err) {
      console.error('Failed to load animal count:', err);
    } finally {
      setLoadingAnimals(false);
    }
  };

  const stats = [
    {
      title: language === 'hi' ? 'मेरे पशु' : language === 'cg' ? 'मोर पशु' : 'My Animals',
      value: loadingAnimals ? '...' : animalCount,
      icon: 'paw',
      color: '#4f46e5',
      onPress: () => navigation.navigate('Animals')
    },
    {
      title: language === 'hi' ? 'आने वाली सलाह' : language === 'cg' ? 'आवत मशवरा' : 'Upcoming Consultations',
      value: '0',
      icon: 'calendar',
      color: '#10b981',
      onPress: () => navigation.navigate('Consultations')
    },
    {
      title: language === 'hi' ? 'बचाव रिपोर्ट' : language === 'cg' ? 'बचाव रिपोर्ट' : 'Rescue Reports',
      value: '0',
      icon: 'alert-circle',
      color: '#ef4444',
      onPress: () => navigation.navigate('Rescue')
    },
    {
      title: language === 'hi' ? 'समुदाय पोस्ट' : language === 'cg' ? 'समाज पोस्ट' : 'Community Posts',
      value: '0',
      icon: 'chatbubbles',
      color: '#f59e0b',
      onPress: () => navigation.navigate('Community')
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline" size={16} color="#f59e0b" />
          <Text style={styles.offlineText}>
            {language === 'hi' ? 'ऑफ़लाइन मोड - डेटा सिंक होगा जब ऑनलाइन होंगे' : language === 'cg' ? 'ऑफ़लाइन मोड - डेटा सिंक होगा जब ऑनलाइन होही' : 'Offline Mode - Data will sync when online'}
          </Text>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.greeting}>
          {language === 'hi' ? 'नमस्ते' : language === 'cg' ? 'नमस्कार' : 'Hello'}, {profile?.full_name?.split(' ')[0] || 'किसान'}!
        </Text>
        <Text style={styles.subtitle}>
          {language === 'hi' ? 'आज आपके पशु कैसे हैं?' : language === 'cg' ? 'आज तोहर पशु केहन हे?' : 'How are your animals today?'}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {language === 'hi' ? 'त्वरित कार्य' : language === 'cg' ? 'जल्दी काम' : 'Quick Actions'}
          </Text>
        </View>
        
        <View style={styles.actionsGrid}>
          {[
            {
              icon: 'add-circle',
              label: language === 'hi' ? 'नया पशु' : language === 'cg' ? 'नवा पशु' : 'New Animal',
              action: () => navigation.navigate('Animals' as never)
            },
            {
              icon: 'medkit',
              label: language === 'hi' ? 'बचाव रिपोर्ट' : language === 'cg' ? 'बचाव रिपोर्ट' : 'Rescue Report',
              action: () => navigation.navigate('Rescue' as never)
            },
            {
              icon: 'chatbubbles',
              label: language === 'hi' ? 'डॉक्टर से बात' : language === 'cg' ? 'डाक्टर से बात' : 'Consult Vet',
              action: () => navigation.navigate('Consultations' as never)
            },
            {
              icon: 'medical',
              label: language === 'hi' ? 'दवा खोजें' : language === 'cg' ? 'दवा खोजब' : 'Find Medicine',
              action: () => navigation.navigate('Medicine' as never)
            },
            {
              icon: 'book',
              label: language === 'hi' ? 'रोग जानकारी' : language === 'cg' ? 'रोग जानकारी' : 'Disease Info',
              action: () => navigation.navigate('DiseaseKnowledge' as never)
            },
            {
              icon: 'home',
              label: language === 'hi' ? 'गौशाला' : language === 'cg' ? 'गौशाला' : 'Gaushala',
              action: () => navigation.navigate('Gaushala' as never)
            },
          ].map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionButton}
              onPress={action.action}
            >
              <View style={styles.actionIcon}>
                <Ionicons name={action.icon as any} size={24} color="#4f46e5" />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {animalCount === 0 && (
        <View style={styles.section}>
          <View style={styles.emptyState}>
            <Ionicons name="paw-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyTitle}>
              {language === 'hi' ? 'अपना पशु जोड़ना शुरू करें' : language === 'cg' ? 'तोहर पशु जोड़ना शुरू करब' : 'Start by adding your first animal'}
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Animals' as never)}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>
                {language === 'hi' ? 'पशु जोड़ें' : language === 'cg' ? 'पशु जोड़ब' : 'Add Animal'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  offlineText: {
    fontSize: 12,
    color: '#92400e',
    marginLeft: 8,
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  seeAll: {
    color: '#4f46e5',
    fontWeight: '500',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#4b5563',
  },
  activityList: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
    marginRight: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  activityDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});
