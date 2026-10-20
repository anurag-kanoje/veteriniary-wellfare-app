import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ConsultationService, TeleConsultation } from '../services/ConsultationService';

export default function ConsultationsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');
  const [consultations, setConsultations] = useState<TeleConsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConsultations();
  }, [selectedTab, user]);

  const loadConsultations = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      let result;
      if (selectedTab === 'upcoming') {
        result = await ConsultationService.getUpcomingConsultations(user.id);
      } else {
        result = await ConsultationService.getFarmerConsultations(user.id);
      }

      if (result.error) {
        setError(result.error.message);
      } else {
        setConsultations(result.data || []);
      }
    } catch (err) {
      setError('Failed to load consultations');
    } finally {
      setLoading(false);
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={64} color="#9ca3af" />
      <Text style={styles.emptyText}>
        {selectedTab === 'upcoming'
          ? (language === 'hi' ? 'कोई आने वाली सलाह नहीं' : language === 'cg' ? 'कोई आवत मशवरा नहीं' : 'No upcoming consultations')
          : (language === 'hi' ? 'कोई पुरानी सलाह नहीं' : language === 'cg' ? 'कोई पुरानी मशवरा नहीं' : 'No past consultations')}
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => Alert.alert(
          language === 'hi' ? 'सुविधा' : language === 'cg' ? 'सुझाव' : 'Info',
          language === 'hi' ? 'टेल-कंसल्टेशन सुविधा जल्द ही उपलब्ध होगी' : language === 'cg' ? 'टेल-कंसल्टेशन सुझाव जल्दी उपलब्ध होगी' : 'Tele-consultation feature will be available soon'
        )}
      >
        <Ionicons name="information-circle" size={20} color="#fff" />
        <Text style={styles.emptyButtonText}>
          {language === 'hi' ? 'जानकारी' : language === 'cg' ? 'जानकारी' : 'Info'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderConsultationCard = (consultation: TeleConsultation) => (
    <TouchableOpacity
      key={consultation.id}
      style={styles.card}
      onPress={() => Alert.alert(
        consultation.title || 'Consultation',
        consultation.description || 'No description',
        [{ text: 'OK' }]
      )}
    >
      <View style={styles.cardHeader}>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusDot,
            { backgroundColor: getStatusColor(consultation.status) }
          ]} />
          <Text style={styles.statusText}>{consultation.status}</Text>
        </View>
        <Text style={styles.date}>
          {consultation.scheduled_at
            ? new Date(consultation.scheduled_at).toLocaleDateString()
            : new Date(consultation.created_at).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.cardTitle}>{consultation.title || 'Consultation'}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {consultation.description || 'No description provided'}
      </Text>
      {consultation.urgency_level && (
        <View style={styles.urgencyBadge}>
          <Text style={styles.urgencyText}>{consultation.urgency_level}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'scheduled':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'completed':
        return '#6b7280';
      case 'cancelled':
      case 'rejected':
        return '#ef4444';
      default:
        return '#9ca3af';
    }
  };

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
        <TouchableOpacity style={styles.retryButton} onPress={loadConsultations}>
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
          {language === 'hi' ? 'मेरी सलाह' : language === 'cg' ? 'मोर मशवरा' : 'My Consultations'}
        </Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'upcoming' && styles.activeTab]}
          onPress={() => setSelectedTab('upcoming')}
        >
          <Text style={[styles.tabText, selectedTab === 'upcoming' && styles.activeTabText]}>
            {language === 'hi' ? 'आने वाले' : language === 'cg' ? 'आवत' : 'Upcoming'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'past' && styles.activeTab]}
          onPress={() => setSelectedTab('past')}
        >
          <Text style={[styles.tabText, selectedTab === 'past' && styles.activeTabText]}>
            {language === 'hi' ? 'पुराने' : language === 'cg' ? 'पुरानी' : 'Past'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {consultations.length === 0 ? renderEmptyState() : consultations.map(renderConsultationCard)}
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => Alert.alert(
          language === 'hi' ? 'सुविधा' : language === 'cg' ? 'सुझाव' : 'Info',
          language === 'hi' ? 'टेल-कंसल्टेशन सुविधा जल्द ही उपलब्ध होगी' : language === 'cg' ? 'टेल-कंसल्टेशन सुझाव जल्दी उपलब्ध होगी' : 'Tele-consultation feature will be available soon'
        )}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.floatingButtonText}>
          {language === 'hi' ? 'नई सलाह' : language === 'cg' ? 'नवा मशवरा' : 'New'}
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
    margin: 16,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#111827',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
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
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  urgencyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#92400e',
    textTransform: 'capitalize',
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
