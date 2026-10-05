import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View, Text } from 'react-native';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { OfflineProvider } from './src/contexts/OfflineContext';

import DashboardScreen from './src/screens/DashboardScreen';
import AnimalsScreen from './src/screens/AnimalsScreen';
import ConsultationsScreen from './src/screens/ConsultationsScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RescueScreen from './src/screens/RescueScreen';
import MedicineScreen from './src/screens/MedicineScreen';
import DiseaseKnowledgeScreen from './src/screens/DiseaseKnowledgeScreen';
import GaushalaScreen from './src/screens/GaushalaScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import AddEditAnimalScreen from './src/screens/AddEditAnimalScreen';
import AnimalProfileScreen from './src/screens/AnimalProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Rescue" component={RescueScreen} />
      <Stack.Screen name="Medicine" component={MedicineScreen} />
      <Stack.Screen name="DiseaseKnowledge" component={DiseaseKnowledgeScreen} />
      <Stack.Screen name="Gaushala" component={GaushalaScreen} />
    </Stack.Navigator>
  );
}

function AnimalsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AnimalsList" component={AnimalsScreen} />
      <Stack.Screen name="AddEditAnimal" component={AddEditAnimalScreen} />
      <Stack.Screen name="AnimalProfile" component={AnimalProfileScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: any }) => ({
        tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
          let iconName: any = 'home';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Animals') {
            iconName = focused ? 'paw' : 'paw-outline';
          } else if (route.name === 'Consultations') {
            iconName = focused ? 'medical' : 'medical-outline';
          } else if (route.name === 'Community') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Leaderboard') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Animals" component={AnimalsStack} />
      <Tab.Screen name="Consultations" component={ConsultationsScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={{ marginTop: 16, color: '#6b7280' }}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <AuthStack />;
  }

  return <MainTabs />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <OfflineProvider>
        <LanguageProvider>
          <AuthProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <AppNavigator />
            </NavigationContainer>
          </AuthProvider>
        </LanguageProvider>
      </OfflineProvider>
    </SafeAreaProvider>
  );
}
