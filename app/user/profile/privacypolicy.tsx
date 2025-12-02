import BackButton from '@/components/ui/BackButton';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const PrivacyPolicy = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <BackButton style={{ marginBottom: 0 }} />

          <Text style={styles.title}>Privacy Policy</Text>

          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.text}>
            At SabayTa, accessible through our campus ridesharing app, we are dedicated to protecting your privacy. This Privacy Policy explains what information we collect and how we use, share, and protect your data when you use SabayTa.

            {'\n\n'}If you have questions or need more details about our Privacy Policy, please contact us any time.

            {'\n\n'}This policy applies only to information collected through the SabayTa app, and not to data gathered offline or via other channels. Our Privacy Policy was developed using trusted privacy resources to ensure transparency and compliance with applicable laws.
          </Text>
        </ScrollView>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 20 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },



  title: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1C1B1F',
  },

  text: {
    fontFamily: 'Poppins',
    fontSize: 16,
    color: '#414141',
    lineHeight: 22,
    textAlign: 'justify',
  },
});

export default PrivacyPolicy;
