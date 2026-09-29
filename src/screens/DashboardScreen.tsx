import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useOffline } from '../contexts/OfflineContext';

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

  const stats = [
    {
      title: language === 'hi' ? 'मेरे पशु' : language === 'cg' ? 'मोर पशु' : 'My Animals',
      value: '12',
      icon: 'paw',
      color: '#4f46e5',
      onPress: () => navigation.navigate('Animals')
    },
    {
      title: language === 'hi' ? 'आने वाली सलाह' : language === 'cg' ? 'आवत मशवरा' : 'Upcoming Consultations',
      value: '3',
      icon: 'calendar',
      color: '#10b981',
      onPress: () => navigation.navigate('Consultations')
    },
    {
      title: language === 'hi' ? 'बचाव रिपोर्ट' : language === 'cg' ? 'बचाव रिपोर्ट' : 'Rescue Reports',
      value: '2',
      icon: 'alert-circle',
      color: '#ef4444',
      onPress: () => navigation.navigate('Rescue')
    },
    {
      title: language === 'hi' ? 'समुदाय पोस्ट' : language === 'cg' ? 'समाज पोस्ट' : 'Community Posts',
      value: '8',
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
              screen: 'Animals' 
            },
            { 
              icon: 'medkit', 
              label: language === 'hi' ? 'बचाव रिपोर्ट' : language === 'cg' ? 'बचाव रिपोर्ट' : 'Rescue Report', 
              screen: 'Rescue' 
            },
            { 
              icon: 'chatbubbles', 
              label: language === 'hi' ? 'डॉक्टर से बात' : language === 'cg' ? 'डाक्टर से बात' : 'Consult Vet', 
              screen: 'Consultations' 
            },
            { 
              icon: 'medical', 
              label: language === 'hi' ? 'दवा खोजें' : language === 'cg' ? 'दवा खोजब' : 'Find Medicine', 
              screen: 'Medicine' 
            },
            { 
              icon: 'book', 
              label: language === 'hi' ? 'रोग जानकारी' : language === 'cg' ? 'रोग जानकारी' : 'Disease Info', 
              screen: 'DiseaseKnowledge' 
            },
            { 
              icon: 'home', 
              label: language === 'hi' ? 'गौशाला' : language === 'cg' ? 'गौशाला' : 'Gaushala', 
              screen: 'Gaushala' 
            },
          ].map((action, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.actionButton}
              onPress={() => navigation.navigate(action.screen as never)}
            >
              <View style={styles.actionIcon}>
                <Ionicons name={action.icon as any} size={24} color="#4f46e5" />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {language === 'hi' ? 'हालिया गतिविधि' : language === 'cg' ? 'अभी गतिविधि' : 'Recent Activity'}
          </Text>
        </View>
        
        <View style={styles.activityList}>
          {[
            { 
              id: 1, 
              title: language === 'hi' ? 'टीकाकरण बाकी' : language === 'cg' ? 'टीका बाकी' : 'Vaccination Due', 
              description: language === 'hi' ? 'गौरी गाय के लिए FMD टीका' : language === 'cg' ? 'गौरी गाय खर एफएमडी टीका' : 'FMD vaccine for Gauri cow', 
              date: language === 'hi' ? 'कल' : language === 'cg' ? 'नाथा' : 'Tomorrow', 
              type: 'alert' 
            },
            { 
              id: 2, 
              title: language === 'hi' ? 'डॉक्टर मिलना तय' : language === 'cg' ? 'डाक्टर मिलना तय' : 'Vet Visit Confirmed', 
              description: language === 'hi' ? 'डॉ. शर्मा जी - मोती बकरी की जांच' : language === 'cg' ? 'डॉ. शर्मा - मोती बकरी जांच' : 'Dr. Sharma - Moti goat checkup', 
              date: language === 'hi' ? '20 जून 2024' : language === 'cg' ? '20 जून 2024' : 'Jun 20, 2024', 
              type: 'info' 
            },
            { 
              id: 3, 
              title: language === 'hi' ? 'नया संदेश' : language === 'cg' ? 'नवा संदेश' : 'New Message', 
              description: language === 'hi' ? 'गौशाला से - बैल के बारे में' : language === 'cg' ? 'गौशाला ल - सांड बारे में' : 'From Gaushala - about bull', 
              date: language === 'hi' ? '2 घंटे पहले' : language === 'cg' ? '2 घंटा पहिली' : '2h ago', 
              type: 'message' 
            },
          ].map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={[
                styles.activityIcon,
                { backgroundColor: 
                  activity.type === 'alert' ? '#fef2f2' : 
                  activity.type === 'message' ? '#eff6ff' : '#f0fdf4'
                }
              ]}>
                <Ionicons 
                  name={
                    activity.type === 'alert' ? 'alert-circle' :
                    activity.type === 'message' ? 'chatbubble' : 'checkmark-circle'
                  } 
                  size={20} 
                  color={
                    activity.type === 'alert' ? '#dc2626' :
                    activity.type === 'message' ? '#2563eb' : '#16a34a'
                  } 
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDescription} numberOfLines={1}>{activity.description}</Text>
              </View>
              <Text style={styles.activityDate}>{activity.date}</Text>
            </View>
          ))}
        </View>
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
});
