import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

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

  const stats = [
    {
      title: 'Active Animals',
      value: '24',
      icon: 'paw',
      color: '#4f46e5',
      onPress: () => navigation.navigate('Animals')
    },
    {
      title: 'Upcoming Consultations',
      value: '5',
      icon: 'calendar',
      color: '#10b981',
      onPress: () => navigation.navigate('Consultations')
    },
    {
      title: 'Community Posts',
      value: '12',
      icon: 'chatbubbles',
      color: '#f59e0b',
      onPress: () => navigation.navigate('Community')
    },
    {
      title: 'Your Rank',
      value: '#7',
      icon: 'trophy',
      color: '#ec4899',
      onPress: () => navigation.navigate('Leaderboard')
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, John!</Text>
        <Text style={styles.subtitle}>Welcome back to VetCare</Text>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.actionsGrid}>
          {[
            { icon: 'add-circle', label: 'New Pet', screen: 'AddPet' },
            { icon: 'calendar', label: 'Book Visit', screen: 'BookVisit' },
            { icon: 'medkit', label: 'Health Check', screen: 'HealthCheck' },
            { icon: 'chatbubbles', label: 'Community', screen: 'Community' },
            { icon: 'document-text', label: 'Records', screen: 'Records' },
            { icon: 'settings', label: 'Settings', screen: 'Settings' },
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
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.activityList}>
          {[
            { id: 1, title: 'Vaccination Due', description: 'Rabies vaccine for Max', date: 'Tomorrow', type: 'alert' },
            { id: 2, title: 'Appointment Confirmed', description: 'Dr. Smith - Annual Checkup', date: 'Jun 20, 2023', type: 'info' },
            { id: 3, title: 'New Message', description: 'From Dr. Johnson about Bella', date: '2h ago', type: 'message' },
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
