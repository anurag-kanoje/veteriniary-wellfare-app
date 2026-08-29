import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert,
  Switch,
  TextInput,
  Modal,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';

type Pet = {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  gender: 'Male' | 'Female';
  image: any;
  lastVaccination: string;
  nextAppointment?: string;
};

type SettingItemProps = {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
};

const SettingItem = ({
  icon,
  title,
  subtitle,
  onPress,
  showSwitch = false,
  switchValue = false,
  onSwitchChange
}: SettingItemProps) => (
  <TouchableOpacity 
    style={styles.settingItem} 
    onPress={onPress}
    disabled={!onPress && !showSwitch}
  >
    <View style={styles.settingLeft}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon as any} size={20} color="#4f46e5" />
      </View>
      <View>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {showSwitch ? (
      <Switch
        trackColor={{ false: '#e5e7eb', true: '#c7d2fe' }}
        thumbColor={switchValue ? '#4f46e5' : '#f4f3f4'}
        ios_backgroundColor="#e5e7eb"
        onValueChange={onSwitchChange}
        value={switchValue}
      />
    ) : (
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    )}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, signOut } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(require('../../assets/avatar0.jpg'));
  const [name, setName] = useState(user?.user_metadata?.full_name || 'John Doe');
  const [email, setEmail] = useState(user?.email || 'john.doe@example.com');
  const [phone, setPhone] = useState('(123) 456-7890');
  const [location, setLocation] = useState('New York, USA');
  const [bio, setBio] = useState('Passionate pet lover and animal welfare advocate. Proud parent of two adorable cats and a golden retriever.');
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const [pets, setPets] = useState<Pet[]>([
    {
      id: '1',
      name: 'Max',
      type: 'Dog',
      breed: 'Golden Retriever',
      age: 3,
      gender: 'Male',
      image: require('../../assets/pet1.jpg'),
      lastVaccination: '2023-10-15',
      nextAppointment: '2023-12-20',
    },
    {
      id: '2',
      name: 'Luna',
      type: 'Cat',
      breed: 'Siamese',
      age: 2,
      gender: 'Female',
      image: require('../../assets/pet2.jpg'),
      lastVaccination: '2023-09-20',
    },
  ]);

  const pickImage = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission required',
        'Please allow access to your photo library to change your profile picture.'
      );
      return;
    }
    
    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      // In a real app, you would upload the image to your server
      // and update the user's profile with the new image URL
      const asset = result.assets[0];
      if (asset && asset.uri) {
        setProfileImage({ uri: asset.uri });
      }
    }
  };

  const handleSaveProfile = () => {
    // In a real app, you would update the user's profile in your database
    // and update the user context with the new data
    setIsEditing(false);
    Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
  };

  const handleAddPet = () => {
    navigation.navigate('AddPet');
  };

  const handleEditPet = (petId: string) => {
    navigation.navigate('EditPet', { petId });
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await signOut();
      // The AuthProvider will handle the navigation to the login screen
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    } finally {
      setShowLogoutModal(false);
    }
  };

  const renderPetCard = (pet: Pet) => (
    <View key={pet.id} style={styles.petCard}>
      <Image source={pet.image} style={styles.petImage} />
      <View style={styles.petInfo}>
        <View style={styles.petHeader}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petType}>{pet.type}</Text>
        </View>
        <View style={styles.petDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="paw" size={14} color="#6b7280" />
            <Text style={styles.detailText}>{pet.breed}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time" size={14} color="#6b7280" />
            <Text style={styles.detailText}>{pet.age} years</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons 
              name={pet.gender === 'Male' ? 'male' : 'female'} 
              size={14} 
              color={pet.gender === 'Male' ? '#3b82f6' : '#ec4899'} 
            />
            <Text style={styles.detailText}>{pet.gender}</Text>
          </View>
        </View>
        {pet.nextAppointment && (
          <View style={styles.nextAppointment}>
            <Ionicons name="calendar" size={14} color="#4f46e5" />
            <Text style={styles.appointmentText}>
              Next: {new Date(pet.nextAppointment).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>
      <TouchableOpacity 
        style={styles.editPetButton}
        onPress={() => handleEditPet(pet.id)}
      >
        <Ionicons name="create-outline" size={18} color="#4f46e5" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileHeader}>
            <TouchableOpacity onPress={isEditing ? pickImage : undefined}>
              <View style={styles.avatarContainer}>
                <Image source={profileImage} style={styles.avatar} />
                {isEditing && (
                  <View style={styles.cameraIcon}>
                    <Ionicons name="camera" size={16} color="#fff" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
            
            <View style={styles.userInfo}>
              {isEditing ? (
                <TextInput
                  style={[styles.userName, styles.input]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Full Name"
                />
              ) : (
                <Text style={styles.userName}>{name}</Text>
              )}
              <Text style={styles.userEmail}>{email}</Text>
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{pets.length}</Text>
                  <Text style={styles.statLabel}>Pets</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>42</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>128</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            {isEditing ? (
              <>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={[styles.actionButtonText, styles.cancelButtonText]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={handleSaveProfile}
                >
                  <Text style={[styles.actionButtonText, styles.saveButtonText]}>Save</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Ionicons name="create-outline" size={16} color="#4f46e5" />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          {isEditing ? (
            <TextInput
              style={[styles.bioInput, styles.input]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself..."
              multiline
              numberOfLines={3}
            />
          ) : (
            <Text style={styles.bioText}>{bio}</Text>
          )}
        </View>
        
        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoItem}>
            <Ionicons name="mail" size={18} color="#6b7280" style={styles.infoIcon} />
            {isEditing ? (
              <TextInput
                style={[styles.infoText, styles.input]}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.infoText}>{email}</Text>
            )}
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="call" size={18} color="#6b7280" style={styles.infoIcon} />
            {isEditing ? (
              <TextInput
                style={[styles.infoText, styles.input]}
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone Number"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.infoText}>{phone}</Text>
            )}
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="location" size={18} color="#6b7280" style={styles.infoIcon} />
            {isEditing ? (
              <TextInput
                style={[styles.infoText, styles.input]}
                value={location}
                onChangeText={setLocation}
                placeholder="Location"
              />
            ) : (
              <Text style={styles.infoText}>{location}</Text>
            )}
          </View>
        </View>
        
        {/* My Pets */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Pets</Text>
            <TouchableOpacity onPress={handleAddPet}>
              <Ionicons name="add-circle" size={24} color="#4f46e5" />
            </TouchableOpacity>
          </View>
          
          {pets.length > 0 ? (
            <View style={styles.petsList}>
              {pets.map(renderPetCard)}
            </View>
          ) : (
            <View style={styles.emptyPetsContainer}>
              <Ionicons name="paw" size={48} color="#e5e7eb" />
              <Text style={styles.emptyPetsText}>No pets added yet</Text>
              <TouchableOpacity 
                style={styles.addPetButton}
                onPress={handleAddPet}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addPetButtonText}>Add Pet</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsContainer}>
            <SettingItem
              icon="notifications"
              title="Notifications"
              subtitle={notificationsEnabled ? 'On' : 'Off'}
              showSwitch
              switchValue={notificationsEnabled}
              onSwitchChange={setNotificationsEnabled}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="moon"
              title="Dark Mode"
              showSwitch
              switchValue={darkMode}
              onSwitchChange={setDarkMode}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="lock-closed"
              title="Privacy"
              onPress={() => navigation.navigate('Privacy')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="help-circle"
              title="Help & Support"
              onPress={() => navigation.navigate('Support')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="information-circle"
              title="About"
              onPress={() => navigation.navigate('About')}
            />
          </View>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={20} color="#ef4444" />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.versionText}>VetCare App v1.0.0</Text>
        </View>
      </ScrollView>
      
      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Out</Text>
              <Text style={styles.modalSubtitle}>Are you sure you want to log out?</Text>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.logoutConfirmButton]}
                onPress={confirmLogout}
              >
                <Text style={[styles.modalButtonText, styles.logoutConfirmButtonText]}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#e5e7eb',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    padding: 4,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: '#e5e7eb',
    marginHorizontal: 8,
    alignSelf: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    flex: 1,
  },
  editButtonText: {
    color: '#4f46e5',
    fontWeight: '500',
    marginLeft: 6,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#4f46e5',
    marginLeft: 8,
  },
  actionButtonText: {
    fontWeight: '500',
  },
  cancelButtonText: {
    color: '#6b7280',
  },
  saveButtonText: {
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  bioText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
  },
  bioInput: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoIcon: {
    marginRight: 12,
    width: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#4b5563',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 10,
    fontSize: 14,
    color: '#111827',
  },
  petsList: {
    marginTop: 8,
  },
  petCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  petInfo: {
    flex: 1,
  },
  petHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  petType: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  petDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  nextAppointment: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  appointmentText: {
    fontSize: 12,
    color: '#4f46e5',
    marginLeft: 4,
    fontWeight: '500',
  },
  editPetButton: {
    padding: 4,
    alignSelf: 'flex-start',
  },
  emptyPetsContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyPetsText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    marginBottom: 16,
  },
  addPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addPetButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 6,
  },
  settingsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginLeft: 60,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
  },
  logoutButtonText: {
    color: '#ef4444',
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  modalButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  logoutConfirmButton: {
    borderLeftWidth: 1,
    borderLeftColor: '#f3f4f6',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutConfirmButtonText: {
    color: '#ef4444',
  },
});
