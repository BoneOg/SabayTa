import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import { BASE_URL } from "../../config";

// 1. Define the type for the Profile state
interface ProfileState {
  name: string;
  mobile: string;
  email: string;
  street: string;
  city: string;
  district: string;
}

export default function CompleteProfile() {
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileState>({
    name: "",
    mobile: "",
    email: "",
    street: "",
    city: "",
    district: "",
  });

  // 2. Define the type for the image URI state (string or null)
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /* ---------------------- LOAD USER DATA ---------------------- */
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (!userData) return;

        const user = JSON.parse(userData);
        setProfile({
          name: user.name || "",
          email: user.email || "",
          mobile: user.phone ? user.phone.replace("+63", "") : "",
          street: user.street || "",
          city: user.city || "",
          district: user.district || "",
        });

        if (user.profileImage) setImage(user.profileImage);
      } catch (err) {
        console.log("Error loading user:", err);
        Alert.alert("Error", "Unable to load profile information.");
      }
    };

    loadUserData();
  }, []);

  /* ---------------------- REQUEST PERMISSIONS ---------------------- */
  const requestImagePermissions = async () => {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!result.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access photos is required to upload a profile picture."
      );
      return false;
    }
    return true;
  };

  /* ---------------------- PICK IMAGE ---------------------- */
  const pickImage = async () => {
    try {
      const hasPermission = await requestImagePermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled) return;

      // 3. Fix: Ensure that uri exists and is a string before setting state
      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        // Assertion: result.assets[0].uri is a string
        setImage(result.assets[0].uri);
      } else if (result.uri) {
        // This 'else if' is technically not needed for modern ImagePicker, 
        // but if it runs, we ensure the type is string.
        setImage(result.uri);
      }
    } catch (err) {
      console.log("Image picker error DETAILS:", err);
      Alert.alert("Error", "Could not pick image.");
    }
  };

  /* ---------------------- HELPERS ---------------------- */
  // 4. Fix: Explicitly define the type for the 'filename' parameter as string | null
  const guessMimeType = (filename: string | null): string => {
    // 5. Fix: Use null check and treat as string
    const ext = (filename || "").split(".").pop()?.toLowerCase() ?? "jpeg";
    if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
    if (ext === "png") return "image/png";
    if (ext === "gif") return "image/gif";
    return "image/jpeg";
  };

  /* ---------------------- SAVE PROFILE ---------------------- */
  const handleSave = async () => {
    // ... (Validation remains the same)

    if (
      !profile.name ||
      !profile.email ||
      !profile.mobile ||
      !profile.street ||
      !profile.city ||
      !profile.district
    ) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "You are not logged in.");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("email", profile.email);
      formData.append("phone", `+63${profile.mobile}`);
      formData.append("street", profile.street);
      formData.append("city", profile.city);
      formData.append("district", profile.district);

      /* ==================================================== */
      /* 🛠️ TypeScript Fixes in handleSave                   */
      /* ==================================================== */
      
      // 6. Fix: Check if image is a string AND doesn't start with "http"
      if (typeof image === 'string' && !image.startsWith("http")) {
        // Since 'image' is guaranteed to be a string here:
        const fileName = image.split("/").pop() || "photo.jpg";
        const mimeType = guessMimeType(fileName);

        const uri = image; 

        // The type for the second argument of append needs to match the required type for file upload
        formData.append("profileImage", {
          uri,
          name: fileName,
          type: mimeType,
          // TypeScript typically requires this object to conform to a specific type
        } as unknown as Blob); // Use 'as unknown as Blob' to satisfy the FormData interface

        console.log("File prepared for upload:", { uri, name: fileName, type: mimeType });
      }

      const response = await fetch(`${BASE_URL}/api/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const text = await response.text();
      let json = null;
      try {
        json = JSON.parse(text);
      } catch (e) {
        console.log("Failed to parse JSON response:", text);
      }

      if (response.ok) {
        Alert.alert("Success", json?.message || "Profile updated!");
        
        if (json?.profile) {
          const stored = await AsyncStorage.getItem("user");
          const parsed = stored ? JSON.parse(stored) : {};
          
          const updatedUser = {
            ...parsed,
            ...json.profile, 
            profileImage: json.profile.profileImage || parsed.profileImage,
          };
          
          await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        }
        
        router.push("/auth/Login");
      } else {
        Alert.alert("Error", json?.message || "Unable to update profile.");
      }
    } catch (err) {
      console.log("Save profile error:", err);
      Alert.alert("Error", "Network or server error.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------------- UI ---------------------- */
  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Profile</Text>

      <View style={styles.avatarWrapper}>
        <TouchableOpacity onPress={pickImage}>
          {image ? (
            // Ensure Image source has a URI property
            <Image source={{ uri: image }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Entypo name="camera" size={28} color="#534889" />
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.uploadText}>Tap to upload photo</Text>
      </View>
      
      {/* ... (Rest of the UI remains the same) */}

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#D0D0D0"
        value={profile.name}
        onChangeText={(text) => setProfile({ ...profile, name: text })}
      />

      <View style={styles.rowInput}>
        <View style={styles.countryCodeBox}>
          <Text style={styles.countryCode}>+63</Text>
        </View>
        <TextInput
          style={[styles.input, styles.mobileInput]}
          placeholder="Mobile Number"
          placeholderTextColor="#D0D0D0"
          keyboardType="number-pad"
          value={profile.mobile}
          onChangeText={(text) => setProfile({ ...profile, mobile: text })}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#D0D0D0"
        keyboardType="email-address"
        value={profile.email}
        onChangeText={(text) => setProfile({ ...profile, email: text })}
        editable={!profile.email} 
      />

      <TextInput
        style={styles.input}
        placeholder="Street"
        placeholderTextColor="#D0D0D0"
        value={profile.street}
        onChangeText={(text) => setProfile({ ...profile, street: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="City"
        placeholderTextColor="#D0D0D0"
        value={profile.city}
        onChangeText={(text) => setProfile({ ...profile, city: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="District"
        placeholderTextColor="#D0D0D0"
        value={profile.district}
        onChangeText={(text) => setProfile({ ...profile, district: text })}
      />

      <View style={styles.buttonRow}>
        <Button
          label="Cancel"
          variant="outline"
          style={styles.halfButton}
          onPress={() => router.back()}
        />
        <Button
          label={isLoading ? "Saving..." : "Save"}
          style={styles.halfButton}
          onPress={handleSave}
          disabled={isLoading}
        />
      </View>
    </View>
  );
}

// ... (Styles remain the same)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: Platform.OS === "android" ? 50 : 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontFamily: "Poppins",
    fontWeight: "600",
    color: "#414141",
    textAlign: "center",
  },
  avatarWrapper: {
    alignItems: "center",
    marginVertical: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#D0D0D0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  uploadText: {
    fontFamily: "Poppins",
    fontSize: 13,
    marginTop: 5,
    color: "#534889",
  },
  input: {
    fontFamily: "Poppins",
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 6,
    padding: 12,
    marginVertical: 7,
    backgroundColor: "#fff",
    color: "#414141",
  },
  rowInput: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 7,
  },
  countryCodeBox: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginRight: 8,
  },
  countryCode: { fontFamily: "Poppins", fontSize: 15 },
  mobileInput: { flex: 1 },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  halfButton: { flex: 1 },
});