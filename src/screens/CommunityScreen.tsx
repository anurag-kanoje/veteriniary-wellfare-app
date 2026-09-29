import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';

type Post = {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: any;
    role: 'Vet' | 'Pet Owner' | 'Admin';
  };
  content: string;
  image?: any;
  likes: number;
  comments: number;
  timeAgo: string;
  isLiked: boolean;
  isFollowing: boolean;
};

type Story = {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: any;
  };
  hasUnseen: boolean;
};

export default function CommunityScreen() {
  const navigation = useNavigation();
  const { language } = useLanguage();
  const [refreshing, setRefreshing] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      user: {
        id: 'user1',
        name: language === 'hi' ? 'डॉ. राजेश शर्मा' : language === 'cg' ? 'डॉ. राजेश शर्मा' : 'Dr. Rajesh Sharma',
        avatar: require('../../assets/avatar1.jpg'),
        role: 'Vet',
      },
      content: language === 'hi' 
        ? 'आज FMD टीकाकरण अभियान में 50 गायों का टीका किया। सभी किसान समय पर टीका लगवाएं। 🐄' 
        : language === 'cg' 
        ? 'आज एफएमडी टीका अभियान में 50 गाय के टीका करे। सब किसान समय पर टीका लगवाब। 🐄' 
        : 'Vaccinated 50 cows in today\'s FMD campaign. All farmers should get their animals vaccinated on time. �',
      image: require('../../assets/post1.jpg'),
      likes: 45,
      comments: 12,
      timeAgo: '2h ago',
      isLiked: false,
      isFollowing: true,
    },
    {
      id: '2',
      user: {
        id: 'user2',
        name: language === 'hi' ? 'रामकुमार किसान' : language === 'cg' ? 'रामकुमार किसान' : 'Ramkumar Farmer',
        avatar: require('../../assets/avatar2.jpg'),
        role: 'Pet Owner',
      },
      content: language === 'hi' 
        ? 'मेरी बकरी को खांसी हो रही है। कोई घरेलू उपाय बताएं? 🐐' 
        : language === 'cg' 
        ? 'मोर बकरी ल खांसी होवत हे। कोई घरेलू उपाय बताब? 🐐' 
        : 'My goat has been coughing. Any home remedies? 🐐',
      likes: 28,
      comments: 23,
      timeAgo: '5h ago',
      isLiked: true,
      isFollowing: false,
    },
    {
      id: '3',
      user: {
        id: 'user3',
        name: language === 'hi' ? 'गौशाला प्रबंधक' : language === 'cg' ? 'गौशाला प्रबंधक' : 'Gaushala Manager',
        avatar: require('../../assets/avatar3.jpg'),
        role: 'Admin',
      },
      content: language === 'hi' 
        ? 'गौशाला में 5 नई गायें आई हैं। जो कोई बैल चाहिए, संपर्क करें। 🐂' 
        : language === 'cg' 
        ? 'गौशाला में 5 नवी गाय आई हे। जे कोई सांड चाही, संपर्क करब। 🐂' 
        : '5 new cows arrived at the gaushala. Contact if anyone needs a bull. 🐂',
      likes: 34,
      comments: 8,
      timeAgo: '1d ago',
      isLiked: false,
      isFollowing: true,
    },
  ]);

  const stories: Story[] = [
    { id: 's1', user: { id: 'user3', name: language === 'hi' ? 'सुरेंद्र' : language === 'cg' ? 'सुरेंद्र' : 'Surendra', avatar: require('../../assets/avatar3.jpg') }, hasUnseen: true },
    { id: 's2', user: { id: 'user4', name: language === 'hi' ? 'मीना' : language === 'cg' ? 'मीना' : 'Meena', avatar: require('../../assets/avatar4.jpg') }, hasUnseen: true },
    { id: 's3', user: { id: 'user5', name: language === 'hi' ? 'डॉ. प्रकाश' : language === 'cg' ? 'डॉ. प्रकाश' : 'Dr. Prakash', avatar: require('../../assets/avatar5.jpg') }, hasUnseen: false },
    { id: 's4', user: { id: 'user6', name: language === 'hi' ? 'लक्ष्मी' : language === 'cg' ? 'लक्ष्मी' : 'Lakshmi', avatar: require('../../assets/avatar6.jpg') }, hasUnseen: true },
  ];

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleFollow = (userId: string) => {
    setPosts(posts.map(post => {
      if (post.user.id === userId) {
        return {
          ...post,
          isFollowing: !post.isFollowing
        };
      }
      return post;
    }));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate network request
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) return;
    
    const newPostObj: Post = {
      id: Date.now().toString(),
      user: {
        id: 'currentUser',
        name: language === 'hi' ? 'आप' : language === 'cg' ? 'तोहर' : 'You',
        avatar: require('../../assets/avatar0.jpg'),
        role: 'Pet Owner',
      },
      content: newPost,
      likes: 0,
      comments: 0,
      timeAgo: language === 'hi' ? 'अभी' : language === 'cg' ? 'अभी' : 'Just now',
      isLiked: false,
      isFollowing: false,
    };
    
    setPosts([newPostObj, ...posts]);
    setNewPost('');
  };

  const renderStory = ({ item }: { item: Story }) => (
    <TouchableOpacity 
      style={styles.storyContainer}
      onPress={() => navigation.navigate('Story', { storyId: item.id })}
    >
      <View style={[
        styles.story,
        item.hasUnseen && styles.unseenStory
      ]}>
        <Image source={item.user.avatar} style={styles.storyAvatar} />
      </View>
      <Text style={styles.storyName} numberOfLines={1}>{item.user.name}</Text>
    </TouchableOpacity>
  );

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postUser}>
          <Image source={item.user.avatar} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.user.name}</Text>
            <View style={styles.postMeta}>
              <Text style={styles.userRole}>{item.user.role}</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.timeAgo}>{item.timeAgo}</Text>
            </View>
          </View>
        </View>
        <View style={styles.postActions}>
          <TouchableOpacity 
            style={styles.followButton}
            onPress={() => handleFollow(item.user.id)}
          >
            <Text style={[
              styles.followButtonText,
              item.isFollowing && styles.followingButtonText
            ]}>
              {item.isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.postContent}>{item.content}</Text>
      
      {item.image && (
        <Image source={item.image} style={styles.postImage} resizeMode="cover" />
      )}
      
      <View style={styles.postFooter}>
        <View style={styles.likeCommentContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleLike(item.id)}
          >
            <Ionicons 
              name={item.isLiked ? 'heart' : 'heart-outline'} 
              size={20} 
              color={item.isLiked ? '#ef4444' : '#6b7280'} 
            />
            <Text style={[
              styles.actionText,
              item.isLiked && styles.likedText
            ]}>
              {item.likes}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('PostComments', { postId: item.id })}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#6b7280" />
            <Text style={styles.actionText}>{item.comments}</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-social-outline" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {language === 'hi' ? 'समुदाय' : language === 'cg' ? 'समाज' : 'Community'}
        </Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#111827" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.createPostContainer}>
        <Image 
          source={require('../../assets/avatar0.jpg')} 
          style={styles.currentUserAvatar} 
        />
        <TextInput
          style={styles.postInput}
          placeholder={
            language === 'hi' 
              ? 'अपने मन की बात शेयर करें...' 
              : language === 'cg' 
              ? 'मन के बात शेयर करब...' 
              : "What's on your mind?"
          }
          placeholderTextColor="#9ca3af"
          value={newPost}
          onChangeText={setNewPost}
          onSubmitEditing={handleCreatePost}
        />
        <TouchableOpacity 
          style={styles.postButton}
          onPress={handleCreatePost}
          disabled={!newPost.trim()}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.postsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#4f46e5']}
            tintColor="#4f46e5"
          />
        }
      />
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
  storiesContainer: {
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  storiesList: {
    paddingHorizontal: 12,
  },
  storyContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  story: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  unseenStory: {
    borderColor: '#4f46e5',
  },
  storyAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#fff',
  },
  storyName: {
    fontSize: 12,
    color: '#4b5563',
    textAlign: 'center',
    width: '100%',
  },
  createPostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  currentUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 12,
    fontSize: 14,
    color: '#111827',
  },
  postButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postsList: {
    paddingBottom: 24,
  },
  postCard: {
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  postUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userRole: {
    fontSize: 12,
    color: '#4f46e5',
    fontWeight: '500',
  },
  dot: {
    fontSize: 12,
    color: '#9ca3af',
    marginHorizontal: 4,
  },
  timeAgo: {
    fontSize: 12,
    color: '#9ca3af',
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginRight: 8,
  },
  followButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4b5563',
  },
  followingButtonText: {
    color: '#4f46e5',
  },
  postContent: {
    fontSize: 15,
    color: '#111827',
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  likeCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 4,
  },
  likedText: {
    color: '#ef4444',
  },
  shareButton: {
    padding: 4,
  },
});
