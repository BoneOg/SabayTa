import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<string>('/onboarding/onboarding1');

  useEffect(() => {
    const prepare = async () => {
      // Minimum splash time (2.5 seconds)
      const splashMinTime = new Promise(resolve => setTimeout(resolve, 2500));

      const checkAuth = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          const userStr = await AsyncStorage.getItem('user');

          if (token && userStr) {
            const user = JSON.parse(userStr);
            if (user.role === 'admin') {
              setInitialRoute('/admin');
            } else if (user.role === 'driver') {
              setInitialRoute('/driver/home');
            } else {
              setInitialRoute('/user/home');
            }
          }
        } catch (e) {
          console.error('Error checking auth state:', e);
        }
      };

      await Promise.all([splashMinTime, checkAuth()]);
      setIsReady(true);
    };

    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.container}>
        <Image
          source={require('@/assets/images/SabayTa_logo...png')}
          style={styles.logo}
          contentFit="contain"
        />
      </View>
    );
  }

  return <Redirect href={initialRoute as any} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 400,
    height: 400,
    marginLeft: '5%',
  },
});
