import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/shared/ui/Text';
import { Button } from '@/shared/ui/Button';
import { Colors } from '@/shared/constants/themes/Colors';
import { Logger } from '@/shared/utils/helpers/logger';

export default function HomeScreen() {
  const handlePress = () => {
    Logger.log('[HomeScreen] Button pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Your app is ready to build!</Text>

        <View style={styles.buttonContainer}>
          <Button title="Get Started" pressed={handlePress} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.grey_7,
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
  },
});
