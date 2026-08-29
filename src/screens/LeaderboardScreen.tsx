import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type UserRanking = {
  id: string;
  name: string;
  avatar: any;
  points: number;
  rank: number;
  isCurrentUser: boolean;
  achievements: number;
  role: 'Vet' | 'Pet Owner' | 'Admin';
  progress: number;
};

type TimeRange = 'weekly' | 'monthly' | 'all';

export default function LeaderboardScreen() {
  const [selectedTab, setSelectedTab] = useState<TimeRange>('weekly');
  const [showAchievements, setShowAchievements] = useState(false);

  const leaderboardData: UserRanking[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      avatar: require('../../assets/avatar1.jpg'),
      points: 1250,
      rank: 1,
      isCurrentUser: false,
      achievements: 8,
      role: 'Vet',
      progress: 95,
    },
    {
      id: '2',
      name: 'Mike Peterson',
      avatar: require('../../assets/avatar2.jpg'),
      points: 980,
      rank: 2,
      isCurrentUser: false,
      achievements: 6,
      role: 'Pet Owner',
      progress: 85,
    },
    {
      id: '3',
      name: 'You',
      avatar: require('../../assets/avatar0.jpg'),
      points: 875,
      rank: 3,
      isCurrentUser: true,
      achievements: 5,
      role: 'Pet Owner',
      progress: 78,
    },
    {
      id: '4',
      name: 'Alex Chen',
      avatar: require('../../assets/avatar4.jpg'),
      points: 720,
      rank: 4,
      isCurrentUser: false,
      achievements: 4,
      role: 'Pet Owner',
      progress: 65,
    },
    {
      id: '5',
      name: 'Taylor Wilson',
      avatar: require('../../assets/avatar5.jpg') || null,
      points: 650,
      rank: 5,
      isCurrentUser: false,
      achievements: 3,
      role: 'Vet',
      progress: 58,
    },
  ];

  const achievements = [
    { id: '1', name: 'Pet Lover', description: 'Added 5+ pets', icon: 'paw', unlocked: true },
    { id: '2', name: 'Community Star', description: '50+ likes on posts', icon: 'star', unlocked: true },
    { id: '3', name: 'Health Expert', description: 'Completed all pet health checks', icon: 'medkit', unlocked: true },
    { id: '4', name: 'Early Bird', description: 'Booked 5+ morning appointments', icon: 'sunny', unlocked: true },
    { id: '5', name: 'Vaccination Pro', description: 'Completed all vaccinations', icon: 'shield-checkmark', unlocked: false },
    { id: '6', name: 'Top Contributor', description: '100+ community contributions', icon: 'trophy', unlocked: false },
  ];

  const renderRankingItem = ({ item }: { item: UserRanking }) => (
    <View style={[
      styles.rankingItem,
      item.isCurrentUser && styles.currentUserItem,
    ]}>
      <View style={styles.rankContainer}>
        <Text style={[
          styles.rankText,
          item.rank <= 3 && styles.topRankText,
          item.isCurrentUser && styles.currentUserRankText,
        ]}>
          {item.rank}
        </Text>
      </View>
      
      <Image source={item.avatar} style={styles.avatar} />
      
      <View style={styles.userInfo}>
        <View style={styles.nameContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
            {item.isCurrentUser && ' (You)'}
          </Text>
          <View style={[
            styles.roleBadge,
            item.role === 'Vet' && styles.vetBadge,
          ]}>
            <Text style={[
              styles.roleText,
              item.role === 'Vet' && styles.vetRoleText,
            ]}>
              {item.role}
            </Text>
          </View>
        </View>
        
        <View style={styles.pointsContainer}>
          <Text style={styles.points}>{item.points} pts</Text>
          <View style={styles.achievementsContainer}>
            <Ionicons name="trophy" size={14} color="#f59e0b" />
            <Text style={styles.achievementsText}>{item.achievements}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${item.progress}%` },
              item.rank <= 3 && styles.topRankProgress,
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{item.progress}%</Text>
      </View>
    </View>
  );

  const renderAchievementItem = ({ item }: { item: any }) => (
    <View style={styles.achievementItem}>
      <View style={[
        styles.achievementIcon,
        !item.unlocked && styles.lockedAchievement,
      ]}>
        <Ionicons 
          name={item.unlocked ? (item.icon as any) : 'lock-closed'} 
          size={24} 
          color={item.unlocked ? '#4f46e5' : '#9ca3af'} 
        />
      </View>
      <View style={styles.achievementInfo}>
        <Text style={styles.achievementName}>
          {item.name}
          {!item.unlocked && ' (Locked)'}
        </Text>
        <Text style={styles.achievementDescription}>
          {item.description}
        </Text>
      </View>
      {item.unlocked && (
        <Ionicons name="checkmark-circle" size={24} color="#10b981" />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <TouchableOpacity 
          style={styles.infoButton}
          onPress={() => setShowAchievements(!showAchievements)}
        >
          <Ionicons 
            name={showAchievements ? 'trophy' : 'trophy-outline'} 
            size={24} 
            color="#4f46e5" 
          />
        </TouchableOpacity>
      </View>
      
      {!showAchievements ? (
        <>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'weekly' && styles.activeTab]}
              onPress={() => setSelectedTab('weekly')}
            >
              <Text style={[styles.tabText, selectedTab === 'weekly' && styles.activeTabText]}>
                Weekly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'monthly' && styles.activeTab]}
              onPress={() => setSelectedTab('monthly')}
            >
              <Text style={[styles.tabText, selectedTab === 'monthly' && styles.activeTabText]}>
                Monthly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'all' && styles.activeTab]}
              onPress={() => setSelectedTab('all')}
            >
              <Text style={[styles.tabText, selectedTab === 'all' && styles.activeTabText]}>
                All Time
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.rankingHeader}>
            <Text style={styles.rankingTitle}>Top {leaderboardData.length} Pet Lovers</Text>
            <View style={styles.rankingStats}>
              <View style={styles.statItem}>
                <Ionicons name="trophy" size={16} color="#f59e0b" />
                <Text style={styles.statText}>Your Rank: #3</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="star" size={16} color="#4f46e5" />
                <Text style={styles.statText}>875 pts</Text>
              </View>
            </View>
          </View>
          
          <FlatList
            data={leaderboardData}
            renderItem={renderRankingItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.rankingList}
            showsVerticalScrollIndicator={false}
          />
          
          <View style={styles.howItWorks}>
            <Text style={styles.howItWorksTitle}>How it works?</Text>
            <View style={styles.rulesList}>
              <View style={styles.ruleItem}>
                <View style={styles.ruleIcon}>
                  <Ionicons name="add-circle" size={16} color="#4f46e5" />
                </View>
                <Text style={styles.ruleText}>Earn points by completing pet profiles</Text>
              </View>
              <View style={styles.ruleItem}>
                <View style={styles.ruleIcon}>
                  <Ionicons name="chatbubbles" size={16} color="#4f46e5" />
                </View>
                <Text style={styles.ruleText}>Get points for community engagement</Text>
              </View>
              <View style={styles.ruleItem}>
                <View style={styles.ruleIcon}>
                  <Ionicons name="calendar" size={16} color="#4f46e5" />
                </View>
                <Text style={styles.ruleText}>Bonus points for on-time vet visits</Text>
              </View>
            </View>
          </View>
        </>
      ) : (
        <FlatList
          data={achievements}
          renderItem={renderAchievementItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.achievementsList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.achievementsHeader}>
              <Text style={styles.achievementsTitle}>Your Achievements</Text>
              <Text style={styles.achievementsSubtitle}>
                {achievements.filter(a => a.unlocked).length} of {achievements.length} unlocked
              </Text>
            </View>
          }
        />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  infoButton: {
    padding: 8,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#eef2ff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#4f46e5',
    fontWeight: '600',
  },
  rankingHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  rankingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  rankingStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4b5563',
    marginLeft: 4,
  },
  rankingList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  currentUserItem: {
    borderWidth: 2,
    borderColor: '#4f46e5',
  },
  rankContainer: {
    width: 32,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  topRankText: {
    color: '#f59e0b',
    fontWeight: '700',
  },
  currentUserRankText: {
    color: '#4f46e5',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginHorizontal: 12,
  },
  userInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
    maxWidth: '70%',
  },
  roleBadge: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  vetBadge: {
    backgroundColor: '#e0f2fe',
  },
  roleText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6b7280',
  },
  vetRoleText: {
    color: '#0369a1',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  points: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4f46e5',
    marginRight: 12,
  },
  achievementsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementsText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#f59e0b',
    marginLeft: 2,
  },
  progressContainer: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  progressBar: {
    height: 4,
    width: 60,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#c7d2fe',
    borderRadius: 2,
  },
  topRankProgress: {
    backgroundColor: '#f59e0b',
  },
  progressText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6b7280',
  },
  howItWorks: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  howItWorksTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  rulesList: {
    marginTop: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ruleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ruleText: {
    flex: 1,
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 20,
  },
  achievementsList: {
    padding: 16,
    paddingBottom: 24,
  },
  achievementsHeader: {
    marginBottom: 20,
  },
  achievementsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  achievementsSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  lockedAchievement: {
    backgroundColor: '#f3f4f6',
  },
  achievementInfo: {
    flex: 1,
    marginRight: 12,
  },
  achievementName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
});
