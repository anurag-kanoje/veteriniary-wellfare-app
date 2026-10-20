import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { CommunityService, Post } from '../services/CommunityService';

export default function CommunityScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPost, setNewPost] = useState('');
  const [creatingPost, setCreatingPost] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await CommunityService.getAllPosts();
      if (result.error) {
        setError(result.error.message);
      } else {
        setPosts(result.data || []);
      }
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return;

    setCreatingPost(true);
    try {
      const result = await CommunityService.createPost({
        user_id: user.id,
        content: newPost.trim(),
        category: 'general',
      });

      if (result.error) {
        Alert.alert('Error', result.error.message);
      } else {
        setNewPost('');
        await loadPosts();
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to create post');
    } finally {
      setCreatingPost(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      const hasLiked = await CommunityService.hasUserLikedPost(postId, user.id);
      
      if (hasLiked.data) {
        await CommunityService.unlikePost(postId, user.id);
      } else {
        await CommunityService.likePost(postId, user.id);
      }
      
      // Reload posts to get updated like count
      await loadPosts();
    } catch (err) {
      Alert.alert('Error', 'Failed to update like');
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={64} color="#9ca3af" />
      <Text style={styles.emptyText}>
        {language === 'hi' ? 'कोई पोस्ट नहीं' : language === 'cg' ? 'कोई पोस्ट नहीं' : 'No posts yet'}
      </Text>
      <Text style={styles.emptySubtext}>
        {language === 'hi' ? 'पहला पोस्ट बनाएं' : language === 'cg' ? 'पहिला पोस्ट बनाब' : 'Be the first to post'}
      </Text>
    </View>
  );

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postMeta}>
          <Text style={styles.postDate}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
          {item.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          )}
        </View>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      {item.image_url && (
        <View style={styles.postImageContainer}>
          <Text style={styles.imagePlaceholderText}>Image</Text>
        </View>
      )}
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(item.id)}>
          <Ionicons name="heart-outline" size={20} color="#6b7280" />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Info', 'Comments feature coming soon')}>
          <Ionicons name="chatbubble-outline" size={20} color="#6b7280" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Info', 'Share feature coming soon')}>
          <Ionicons name="share-outline" size={20} color="#6b7280" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
        <TouchableOpacity style={styles.retryButton} onPress={loadPosts}>
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
          {language === 'hi' ? 'समुदाय' : language === 'cg' ? 'समाज' : 'Community'}
        </Text>
      </View>

      <View style={styles.createPostContainer}>
        <TextInput
          style={styles.createPostInput}
          placeholder={
            language === 'hi' 
              ? 'क्या साझा है?' 
              : language === 'cg' 
              ? 'के सांगा है?' 
              : 'What\'s on your mind?'
          }
          value={newPost}
          onChangeText={setNewPost}
          multiline
        />
        <TouchableOpacity
          style={[styles.createPostButton, !newPost.trim() && styles.disabledButton]}
          onPress={handleCreatePost}
          disabled={!newPost.trim() || creatingPost}
        >
          {creatingPost ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="send" size={20} color="#fff" />
              <Text style={styles.createPostButtonText}>
                {language === 'hi' ? 'पोस्ट' : language === 'cg' ? 'पोस्ट' : 'Post'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={{
          refreshing: false,
          onRefresh: loadPosts,
        }}
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
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  createPostContainer: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  createPostInput: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 8,
    minHeight: 60,
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  createPostButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  postCard: {
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
  postHeader: {
    marginBottom: 8,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  categoryBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#4f46e5',
    textTransform: 'capitalize',
  },
  postContent: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 12,
    lineHeight: 20,
  },
  postImageContainer: {
    height: 200,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
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
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
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
