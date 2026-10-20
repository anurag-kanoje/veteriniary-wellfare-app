import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { RescueService, RescueReport, RescueNGO } from '../services/RescueService';

type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export default function RescueScreen() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'report' | 'my_reports' | 'ngos'>('report');
  const [loading, setLoading] = useState(false);
  const [ngos, setNgos] = useState<RescueNGO[]>([]);
  const [myReports, setMyReports] = useState<RescueReport[]>([]);
  const [formData, setFormData] = useState({
    animal_type: '',
    animal_description: '',
    location: '',
    urgency_level: 'medium' as UrgencyLevel,
    description: '',
    contact_phone: user?.user_metadata?.phone || '+91 ',
  });

  const animalTypes = [
    { id: 'cow', label: language === 'hi' ? 'गाय' : language === 'cg' ? 'गाय' : 'Cow' },
    { id: 'bull', label: language === 'hi' ? 'बैल' : language === 'cg' ? 'सांड' : 'Bull' },
    { id: 'goat', label: language === 'hi' ? 'बकरी' : language === 'cg' ? 'बकरी' : 'Goat' },
    { id: 'dog', label: language === 'hi' ? 'कुत्ता' : language === 'cg' ? 'कुत्ता' : 'Dog' },
    { id: 'cat', label: language === 'hi' ? 'बिल्ली' : language === 'cg' ? 'बिल्ली' : 'Cat' },
    { id: 'other', label: language === 'hi' ? 'अन्य' : language === 'cg' ? 'अन्य' : 'Other' },
  ];

  const urgencyLevels: { level: UrgencyLevel; label: string; color: string }[] = [
    { level: 'low', label: language === 'hi' ? 'कम' : language === 'cg' ? 'कम' : 'Low', color: '#10b981' },
    { level: 'medium', label: language === 'hi' ? 'मध्यम' : language === 'cg' ? 'मध्यम' : 'Medium', color: '#f59e0b' },
    { level: 'high', label: language === 'hi' ? 'उच्च' : language === 'cg' ? 'जादा' : 'High', color: '#f97316' },
    { level: 'critical', label: language === 'hi' ? 'तत्काल' : language === 'cg' ? 'बहुत जरूरी' : 'Critical', color: '#dc2626' },
  ];

  useEffect(() => {
    if (selectedTab === 'ngos') {
      loadNGOs();
    } else if (selectedTab === 'my_reports' && user) {
      loadMyReports();
    }
  }, [selectedTab, user]);

  const loadNGOs = async () => {
    setLoading(true);
    try {
      const result = await RescueService.getAllNGOs();
      if (result.error) {
        Alert.alert('Error', result.error.message);
      } else {
        setNgos(result.data || []);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load NGOs');
    } finally {
      setLoading(false);
    }
  };

  const loadMyReports = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await RescueService.getUserRescueReports(user.id);
      if (result.error) {
        Alert.alert('Error', result.error.message);
      } else {
        setMyReports(result.data || []);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const submitReport = async () => {
    if (!formData.animal_type || !formData.animal_description || !formData.location || !user) {
      Alert.alert(
        language === 'hi' ? 'गलती' : language === 'cg' ? 'गलती' : 'Error',
        language === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें' : language === 'cg' ? 'सब जरूरी फील्ड भरब' : 'Please fill all required fields'
      );
      return;
    }

    setLoading(true);
    try {
      const result = await RescueService.createRescueReport({
        reporter_id: user.id,
        animal_type: formData.animal_type,
        animal_description: formData.animal_description,
        location: { address: formData.location },
        urgency_level: formData.urgency_level,
        description: formData.description,
        contact_phone: formData.contact_phone,
      });

      if (result.error) {
        Alert.alert('Error', result.error.message);
      } else {
        Alert.alert(
          language === 'hi' ? 'सफलता' : language === 'cg' ? 'सफलता' : 'Success',
          language === 'hi' ? 'रिपोर्ट सफलतापूर्वक जमा हो गई' : language === 'cg' ? 'रिपोर्ट सफलतापूर्वक जमा हो गय' : 'Report submitted successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                setFormData({
                  animal_type: '',
                  animal_description: '',
                  location: '',
                  urgency_level: 'medium',
                  description: '',
                  contact_phone: user?.user_metadata?.phone || '+91 ',
                });
              },
            },
          ]
        );
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const renderReportForm = () => (
    <ScrollView style={styles.formContainer}>
      <View style={styles.formSection}>
        <Text style={styles.formLabel}>
          {language === 'hi' ? 'जानवर का प्रकार' : language === 'cg' ? 'जानवर के प्रकार' : 'Animal Type'}
        </Text>
        <View style={styles.animalTypeGrid}>
          {animalTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.animalTypeButton,
                formData.animal_type === type.id && styles.selectedAnimalType,
              ]}
              onPress={() => setFormData({ ...formData, animal_type: type.id })}
            >
              <Text style={[
                styles.animalTypeText,
                formData.animal_type === type.id && styles.selectedAnimalTypeText,
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>
          {language === 'hi' ? 'जानवर का विवरण' : language === 'cg' ? 'जानवर के विवरण' : 'Animal Description'}
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder={
            language === 'hi' 
              ? 'जानवर की स्थिति बताएं...' 
              : language === 'cg' 
              ? 'जानवर के हालत बताब...' 
              : 'Describe the animal condition...'
          }
          value={formData.animal_description}
          onChangeText={(text) => setFormData({ ...formData, animal_description: text })}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>
          {language === 'hi' ? 'स्थान' : language === 'cg' ? 'जगह' : 'Location'}
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder={
            language === 'hi' 
              ? 'जानवर कहां है?' 
              : language === 'cg' 
              ? 'जानवर केंठे हे?' 
              : 'Where is the animal?'
          }
          value={formData.location}
          onChangeText={(text) => setFormData({ ...formData, location: text })}
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>
          {language === 'hi' ? 'तत्कालता स्तर' : language === 'cg' ? 'जरूरत स्तर' : 'Urgency Level'}
        </Text>
        <View style={styles.urgencyContainer}>
          {urgencyLevels.map((level) => (
            <TouchableOpacity
              key={level.level}
              style={[
                styles.urgencyButton,
                { backgroundColor: level.color },
                formData.urgency_level === level.level && styles.selectedUrgency,
              ]}
              onPress={() => setFormData({ ...formData, urgency_level: level.level })}
            >
              <Text style={styles.urgencyText}>{level.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>
          {language === 'hi' ? 'अतिरिक्त जानकारी' : language === 'cg' ? 'अतिरिक्त जानकारी' : 'Additional Information'}
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder={
            language === 'hi' 
              ? 'कोई अन्य जानकारी...' 
              : language === 'cg' 
              ? 'कोई अन्य जानकारी...' 
              : 'Any additional information...'
          }
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.formLabel}>
          {language === 'hi' ? 'संपर्क फोन' : language === 'cg' ? 'संपर्क फोन' : 'Contact Phone'}
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="+91 "
          value={formData.contact_phone}
          onChangeText={(text) => setFormData({ ...formData, contact_phone: text })}
          keyboardType="phone-pad"
        />
      </View>

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
    </ScrollView>
  );

  const renderNGOCard = (ngo: RescueNGO) => (
    <View key={ngo.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{ngo.name}</Text>
        <View style={styles.activeBadge}>
          <Text style={styles.activeText}>Active</Text>
        </View>
      </View>
      <Text style={styles.cardPhone}>{ngo.phone}</Text>
      <Text style={styles.cardLocation}>{ngo.location}</Text>
      <TouchableOpacity style={styles.callButton}>
        <Ionicons name="call" size={20} color="#fff" />
        <Text style={styles.callButtonText}>Call</Text>
      </TouchableOpacity>
    </View>
  );

  const renderReportCard = (report: RescueReport) => (
    <View key={report.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{report.animal_type}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(report.status) }
        ]}>
          <Text style={styles.statusText}>{report.status}</Text>
        </View>
      </View>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {report.animal_description}
      </Text>
      <Text style={styles.cardDate}>
        {new Date(report.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return '#3b82f6';
      case 'in_progress':
        return '#f59e0b';
      case 'completed':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#9ca3af';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {language === 'hi' ? 'बचाव केंद्र' : language === 'cg' ? 'बचाव केंद्र' : 'Rescue Center'}
        </Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'report' && styles.activeTab]}
          onPress={() => setSelectedTab('report')}
        >
          <Text style={[styles.tabText, selectedTab === 'report' && styles.activeTabText]}>
            {language === 'hi' ? 'रिपोर्ट' : language === 'cg' ? 'रिपोर्ट' : 'Report'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'my_reports' && styles.activeTab]}
          onPress={() => setSelectedTab('my_reports')}
        >
          <Text style={[styles.tabText, selectedTab === 'my_reports' && styles.activeTabText]}>
            {language === 'hi' ? 'मेरी रिपोर्ट' : language === 'cg' ? 'मोर रिपोर्ट' : 'My Reports'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'ngos' && styles.activeTab]}
          onPress={() => setSelectedTab('ngos')}
        >
          <Text style={[styles.tabText, selectedTab === 'ngos' && styles.activeTabText]}>
            {language === 'hi' ? 'एनजीओ' : language === 'cg' ? 'एनजीओ' : 'NGOs'}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {selectedTab === 'report' && renderReportForm()}
          {selectedTab === 'my_reports' && (
            myReports.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={64} color="#9ca3af" />
                <Text style={styles.emptyText}>
                  {language === 'hi' ? 'कोई रिपोर्ट नहीं' : language === 'cg' ? 'कोई रिपोर्ट नहीं' : 'No reports yet'}
                </Text>
              </View>
            ) : (
              myReports.map(renderReportCard)
            )
          )}
          {selectedTab === 'ngos' && (
            ngos.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="business-outline" size={64} color="#9ca3af" />
                <Text style={styles.emptyText}>
                  {language === 'hi' ? 'कोई एनजीओ नहीं' : language === 'cg' ? 'कोई एनजीओ नहीं' : 'No NGOs found'}
                </Text>
              </View>
            ) : (
              ngos.map(renderNGOCard)
            )
          )}
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
  formContainer: {
    flex: 1,
  },
  formSection: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  animalTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  animalTypeButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedAnimalType: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  animalTypeText: {
    fontSize: 14,
    color: '#6b7280',
  },
  selectedAnimalTypeText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  urgencyContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  urgencyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedUrgency: {
    borderWidth: 3,
    borderColor: '#111827',
  },
  urgencyText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  cardPhone: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 12,
  },
  cardDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  activeBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  callButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  callButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
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
  },
});
