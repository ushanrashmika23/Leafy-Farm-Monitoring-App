import { Slot, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNav from './components/BottomNavBar';
import TopBar from './components/TopBar';
import FirstTimeSetup from './FirstTimeSetup';
import { isFirstTimeUser } from './utils/Storage';

export default function Layout() {
  const insets = useSafeAreaInsets();
  const hideBottomNavScreens = ['/AddPlant', '/EditUser', '/EditPlant', '/ConnectLeafy', '/NotificationType', '/HelpSupport', '/EraseAllData'];
  const segments = useSegments();
  const currentRoute = '/' + segments.join('/');
  
  const [showFirstTimeSetup, setShowFirstTimeSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFirstTimeUser = async () => {
      try {
        const isFirstTime = await isFirstTimeUser();
        setShowFirstTimeSetup(isFirstTime);
      } catch (error) {
        console.error('Error checking first time user:', error);
        setShowFirstTimeSetup(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstTimeUser();
  }, []);

  const handleSetupComplete = () => {
    setShowFirstTimeSetup(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <StatusBar style="dark" backgroundColor="#F9F9F9" />
        <View style={styles.container}>
          {/* Loading state */}
        </View>
      </SafeAreaView>
    );
  }

  if (showFirstTimeSetup) {
    return (
      <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <StatusBar style="dark" backgroundColor="#F9F9F9" />
        <FirstTimeSetup onComplete={handleSetupComplete} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="dark" backgroundColor="#F9F9F9" />
      <View style={styles.container}>
        {!hideBottomNavScreens.includes(currentRoute) &&
          <TopBar />
        }
        <View style={styles.content}>
          <Slot />
        </View>
        {!hideBottomNavScreens.includes(currentRoute) &&
          <BottomNav />
        }
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F9F9F9',
  },
  content: {
    flex: 1,
    paddingBottom: 0, // leave space for floating navbar
  },
});