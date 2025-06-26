import { Slot } from 'expo-router';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNav from './components/BottomNavBar';
import TopBar from './components/TopBar';

export default function Layout() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.container}>
        <TopBar />
        <View style={styles.content}>
          <Slot />
        </View>
        <BottomNav />
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
    paddingBottom: 90, // leave space for floating navbar
  },
});
