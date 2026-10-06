import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';
import { HealthRecordService, CreateHealthRecordInput } from '../services/HealthRecordService';

type RouteParams = {
  AddHealthRecord: {
    animalId: string;
  };
};

const RECORD_TYPES = [
  { value: 'checkup', label: 'Checkup / जांच', icon: 'medical' },
  { value: 'vaccination', label: 'Vaccination / टीकाकरण', icon: 'shield-checkmark' },
  { value: 'treatment', label: 'Treatment / इलाज', icon: 'construct' },
  { value: 'surgery', label: 'Surgery / सर्जरी', icon: 'scan' },
  { value: 'other', label: 'Other / अन्य', icon: 'document' },
];

export default function AddHealthRecordScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'AddHealthRecord'>>();
  const { animalId } = route.params;
  const { language } = useLanguage();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    record_type: 'checkup' as const,
    title: '',
    description: '',
    veterinarian_name: '',
    clinic_name: '',
    cost: '',
    medications: '',
    notes: '',
    record_date: '',
    next_visit_date: '',
  });

  const handleSave = async () => {
    // Validation
    if (!formData.title.trim()) {
      Alert.alert(
        language === 'hi' ? 'Error' : language === 'cg' ? 'Error' : 'Error',
        language === 'hi' ? 'कृपया शीर्षक दर्ज करें' : language === 'cg' ? 'कृपया शीर्षक भरब' : 'Please enter a title'
      );
      return;
    }

    setSaving(true);
    try {
      const input: CreateHealthRecordInput = {
        animal_id: animalId,
        record_type: formData.record_type,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        veterinarian_name: formData.veterinarian_name.trim() || undefined,
        clinic_name: formData.clinic_name.trim() || undefined,
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        medications: formData.medications.trim() ? formData.medications.split(',').map(m => m.trim()) : undefined,
        notes: formData.notes.trim() || undefined,
        record_date: formData.record_date || undefined,
        next_visit_date: formData.next_visit_date || undefined,
      };

      const { error } = await HealthRecordService.createHealthRecord(input);
      if (error) {
        throw error;
      }

      Alert.alert(
        language === 'hi' ? 'Success' : language === 'cg' ? 'Success' : 'Success',
        language === 'hi' ? 'स्वास्थ्य रिकॉर्ड जोड़ा गया' : language === 'cg' ? 'स्वास्थ्य रिकॉर्ड जोड़यो' : 'Health record added successfully',
        [
          {
            text: language === 'hi' ? 'OK' : language === 'cg' ? 'OK' : 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert(
        language === 'hi' ? 'Error' : language === 'cg' ? 'Error' : 'Error',
        err.message || (language === 'hi' ? 'एक त्रुटि हुई' : language === 'cg' ? 'एक त्रुटि भयो' : 'An error occurred')
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4f46e5" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {language === 'hi' ? 'स्वास्थ्य रिकॉर्ड जोड़ें' : language === 'cg' ? 'स्वास्थ्य रिकॉर्ड जोड़ब' : 'Add Health Record'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.form}>
        {/* Record Type */}
        <View style={styles.field}>
          <Text style={styles.label}>
            {language === 'hi' ? 'रिकॉर्ड प्रकार *' : language === 'cg' ? 'रिकॉर्ड प्रकार *' : 'Record Type *'}
          </Text>
          <View style={styles.optionsContainer}>
            {RECORD_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.optionButton,
                  formData.record_type === type.value && styles.optionButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, record_type: type.value as any })}
              >
                <Ionicons
                  name={type.icon as any}
                  size={20}
                  color={formData.record_type === type.value ? '#fff' : '#4f46e5'}
                />
                <Text
                  style={[
                    styles.optionText,
                    formData.record_type === type.value && styles.optionTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Title */}
        <View style={styles.field}>
          <Text style={styles.label}>
            {language === 'hi' ? 'शीर्षक *' : language === 'cg' ? 'शीर्षक *' : 'Title *'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={language === 'hi' ? 'जैसे: FMD टीकाकरण' : language === 'cg' ? 'जैसे: एफएमडी टीका' : 'e.g., FMD Vaccination'}
            placeholderTextColor="#9ca3af"
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
          />
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.label}>
            {language === 'hi' ? 'विवरण' : language === 'cg' ? 'विवरण' : 'Description'}
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={language === 'hi' ? 'विवरण लिखें...' : language === 'cg' ? 'विवरण लिखब...' : 'Write description...'}
            placeholderTextColor="#9ca3af"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Veterinarian Name */}
        <View style={styles.field}>
          <Text style={styles.label}>
            {language === 'hi' ? 'पशु चिकित्सक का नाम' : language === 'cg' ? 'पशु चिकित्सक नाम' : 'Veterinarian Name'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={language === 'hi' ? 'डॉ. नाम' : language === 'cg' ? 'डॉ. नाम' : 'Dr. Name'}
            placeholderTextColor="#9ca3af"
            value={formData.veterinarian_name}
            onChangeText={(text) => setFormData({ ...formData, veterinarian_name: text })}
          />
        </View>

        {/* Clinic Name */}
        <View style={styles.field}>
          <Text style={styles.label}>
            {language === 'hi' ? 'क्लिनिक का नाम' : language === 'cg' ? 'क्लिनिक नाम' : 'Clinic Name'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={language === 'hi' ? 'क्लिनिक/अस्पताल' : language === 'cg' ? 'क्लिनिक/अस्पताल' : 'Clinic/Hospital'}
            placeholderTextColor="#9ca3af"
            value={formData.clinic_name}
            onChangeText={(text) => setFormData({ ...formData, clinic_name: text })}
          />
        </View>

        {/* Cost */}
        <View style={styles.field}>
          <Text style={styles.label}>
            {language === 'hi' ? 'लागत (₹)' : language === 'cg' ? 'लागत (₹)' : 'Cost (₹)'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor="#9ca3af"
            value={formData.cost}
            onChangeText={(text) => setFormData({ ...formData, cost: text })}
            keyboardType="numeric"
          />
        </View>

        {/* Medications */}
        <View style={styles.field}>
          <Text style={styles.label}>
            {language === 'hi' ? 'दवाएं (अल्पविराम से अलग)' : language === 'cg' ? 'दवा (अल्पविराम से अलग)' : 'Medications (comma separated)'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={language === 'hi' ? 'दवा1, दवा2, दवा3' : language === 'cg' ? 'दवा1, दवा2, दवा3' : 'Medicine1, Medicine2, Medicine3'}
            placeholderTextColor="#9ca3af"
            value={formData.medications}
            onChangeText={(text) => setFormData({ ...formData, medications: text })}
          />
        </View>

        {/* Record Date */}
        <View style={styles.field}>
          <Text style={styles.label}>
            {language === 'hi' ? 'रिकॉर्ड की तारीख' : language === 'cg' ? 'रिकॉर्ड तारीख' : 'Record Date'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#9ca3af"
            value={formData.record_date}
            onChangeText={(text) => setFormData({ ...formData, record_date: text })}
          />
        </View>

        {/* Next Visit Date */}
        <View style={styles.field}>
          <Text style={styles.label}>
            {language === 'hi' ? 'अगली यात्रा की तारीख' : language === 'cg' ? 'अगली यात्रा तारीख' : 'Next Visit Date'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#9ca3af"
            value={formData.next_visit_date}
            onChangeText={(text) => setFormData({ ...formData, next_visit_date: text })}
          />
        </View>

        {/* Notes */}
        <View style={styles.field}>
          <Text style={styles.label}>
            {language === 'hi' ? 'नोट्स' : language === 'cg' ? 'नोट्स' : 'Notes'}
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={language === 'hi' ? 'अतिरिक्त नोट्स...' : language === 'cg' ? 'अतिरिक्त नोट्स...' : 'Additional notes...'}
            placeholderTextColor="#9ca3af"
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>
                {language === 'hi' ? 'सहेजें' : language === 'cg' ? 'सहेजब' : 'Save'}
              </Text>
            </>
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  form: {
    padding: 16,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 100,
  },
  optionButtonActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  optionText: {
    fontSize: 13,
    color: '#374151',
  },
  optionTextActive: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 16,
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
