import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from "../../config";

interface Message {
  id: string;
  text: string;
  image?: string;
  sender: 'user' | 'driver';
  timestamp: Date;
}

interface DriverChatScreenProps {
  onClose: () => void;
}

export default function DriverChatScreen({ onClose }: DriverChatScreenProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const userId = "user123";
  const driverId = "driver456";

  const emojis = ['😊','👍','❤️','😂','🙏','👋','🚗','⏰'];

  // -------------------- Polling: fetch messages every 2s --------------------
  const loadMessages = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/conversations?user=${userId}&driver=${driverId}`);
      const data = await res.json();
      const updatedMessages = (data.messages || []).map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp),
        id: m._id || Date.now().toString(),
      }));
      setMessages(updatedMessages);
      setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadMessages(); // load initially
    const interval = setInterval(loadMessages, 2000); // poll every 2s
    return () => clearInterval(interval);
  }, []);

  // -------------------- Send message --------------------
  const sendMessageToBackend = async (text?: string, image?: string) => {
    try {
      await fetch(`${BASE_URL}/api/conversations/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userId, driver: driverId, sender: "driver", text, image }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async () => {
    if (message.trim()) {
      const newMessage: Message = { id: Date.now().toString(), text: message, sender: "driver", timestamp: new Date() };
      setMessages([...messages, newMessage]);
      setMessage("");
      await sendMessageToBackend(message);
      setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
    }
  };

  const sendEmoji = async (emoji: string) => {
    const newMessage: Message = { id: Date.now().toString(), text: emoji, sender: "driver", timestamp: new Date() };
    setMessages([...messages, newMessage]);
    setShowEmojiPicker(false);
    await sendMessageToBackend(emoji);
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newMessage: Message = { id: Date.now().toString(), text: '', image: result.assets[0].uri, sender: "driver", timestamp: new Date() };
      setMessages([...messages, newMessage]);
      await sendMessageToBackend('', result.assets[0].uri);
      setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
    }
  };

  // -------------------- Keyboard handling --------------------
  useEffect(() => {
    const showSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setKeyboardVisible(false));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const renderMessage = ({ item }: { item: Message }) => {
    const isDriver = item.sender === 'driver';
    return (
      <View style={[styles.messageContainer, isDriver ? styles.driverMessage : styles.userMessage]}>
        {item.image ? <Image source={{ uri: item.image }} style={styles.messageImage} /> : <Text style={[styles.messageText, isDriver ? styles.driverMessageText : styles.userMessageText]}>{item.text}</Text>}
        <Text style={styles.timestamp}>{item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}><Ionicons name="arrow-back" size={24} color="#000" /></TouchableOpacity>
        <Image source={{ uri: 'https://i.pravatar.cc/150?img=45' }} style={styles.headerImage} />
        <View style={styles.headerInfo}><Text style={styles.headerName}>User Testing</Text><Text style={styles.headerStatus}>Online</Text></View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {showEmojiPicker && (
        <View style={styles.emojiPicker}>
          {emojis.map((emoji) => (
            <TouchableOpacity key={emoji} style={styles.emojiButton} onPress={() => sendEmoji(emoji)}>
              <Text style={styles.emoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={[styles.inputContainer, { paddingBottom: isKeyboardVisible ? 10 : 20 }]}>
        <TouchableOpacity onPress={pickImage} style={styles.iconButton}><Ionicons name="image" size={24} color="#534889" /></TouchableOpacity>
        <TouchableOpacity onPress={() => setShowEmojiPicker(!showEmojiPicker)} style={styles.iconButton}><Ionicons name="happy" size={24} color="#534889" /></TouchableOpacity>
        <TextInput style={styles.input} placeholder="Type a message..." placeholderTextColor="#999" value={message} onChangeText={setMessage} multiline />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}><Ionicons name="send" size={20} color="#fff" /></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
// styles remain the same as your original driver chat
const styles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#fff', zIndex: 1000 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingTop: 50, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', backgroundColor: '#fff' },
  backButton: { marginRight: 15 },
  headerImage: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 16, fontWeight: '600', color: '#000' },
  headerStatus: { fontSize: 12, color: '#34A853' },
  messagesList: { padding: 15 },
  messageContainer: { maxWidth: '75%', marginBottom: 15, borderRadius: 15, padding: 12 },
  driverMessage: { alignSelf: 'flex-end', backgroundColor: '#534889' },
  userMessage: { alignSelf: 'flex-start', backgroundColor: '#F0F0F0' },
  messageText: { fontSize: 15, lineHeight: 20 },
  driverMessageText: { color: '#fff' },
  userMessageText: { color: '#000' },
  messageImage: { width: 200, height: 200, borderRadius: 10 },
  timestamp: { fontSize: 10, color: '#999', marginTop: 4, alignSelf: 'flex-end' },
  emojiPicker: { flexDirection: 'row', backgroundColor: '#F8F6FC', padding: 10, borderTopWidth: 1, borderTopColor: '#E0E0E0', flexWrap: 'wrap' },
  emojiButton: { padding: 8 },
  emoji: { fontSize: 28 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F0F0F0', backgroundColor: '#fff' },
  iconButton: { marginRight: 10 },
  input: { flex: 1, backgroundColor: '#F8F6FC', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, fontSize: 15, maxHeight: 100, color: '#000' },
  sendButton: { backgroundColor: '#534889', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
});
