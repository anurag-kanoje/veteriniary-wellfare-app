import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';

export default function LeaderboardScreen() {
  const { language } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {language === 'hi' ? 'लीडरबोर्ड' : language === 'cg' ? 'लीडरबोर्ड' : 'Leaderboard'}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Ionicons name="trophy-outline" size={64} color="#f59e0b" />
          <Text style={styles.infoTitle}>
            {language === 'hi' ? 'जल्द आ रहा है' : language === 'cg' ? 'जल्दी आवही' : 'Coming Soon'}
          </Text>
          <Text style={styles.infoText}>
            {language === 'hi' 
              ? 'लीडरबोर्ड सुविधा जल्द ही उपलब्ध होगी। अभी के लिए, आप अपने जानवरों का प्रबंधन कर सकते हैं और समुदाय में भाग ले सकते हैं।' 
              : language === 'cg' 
              ? 'लीडरबोर्ड सुझाव जल्दी उपलब्ध होही। अभी बास, तोहर जानवर के प्रबंधन कर सकब और समाज में भाग ले सकब।' 
              : 'Leaderboard feature will be available soon. For now, you can manage your animals and participate in the community.'}
          </Text>
        </View>

        <View style={styles.featureList}>
          <Text style={styles.featureListTitle}>
            {language === 'hi' ? 'जल्द आने वाली सुविधाएं' : language === 'cg' ? 'जल्दी आवत सुझाव' : 'Upcoming Features'}
          </Text>
          <View style={styles.featureItem}>
            <Ionicons name="star-outline" size={20} color="#4f46e5" />
            <Text style={styles.featureText}>
              {language === 'hi' ? 'उपयोगकर्ता रैंकिंग प्रणाली' : language === 'cg' ? 'उपयोगकर्ता रैंकिंग प्रणाली' : 'User Ranking System'}
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="medal-outline" size={20} color="#4f46e5" />
            <Text style={styles.featureText}>
              {language === 'hi' ? 'उपलब्धि बैज' : language === 'cg' ? 'उपलब्धि बैज' : 'Achievement Badges'}
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="ribbon-outline" size={20} color="#4f46e5" />
            <Text style={styles.featureText}>
              {language === 'hi' ? 'साप्ताहिक और मासिक चैलेंज' : language === 'cg' ? 'साप्ताहिक और मासिक चैलेंज' : 'Weekly and Monthly Challenges'}
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="gift-outline" size={20} color="#4f46e5" />
            <Text style={styles.featureText}>
              {language === 'hi' ? 'इनाम और पुरस्कार' : language === 'cg' ? 'इनाम और पुरस्कार' : 'Rewards and Prizes'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="notifications-outline" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>
            {language === 'hi' ? 'अपडेट प्राप्त करें' : language === 'cg' ? 'अपडेट प्राप्त करब' : 'Get Notified'}
          </Text>
        </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  featureList: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  featureListTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 12,
  },
  actionButton: {
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});
