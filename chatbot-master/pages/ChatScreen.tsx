import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    FlatList, 
    Alert, 
    StyleSheet,
    Animated,
    Dimensions,
    Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Sentiment from 'sentiment';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const API_KEY = 'aFnAMxjTpGEhu0LAmbGz5mQiGxaCLNZpvdtcjltf';
const EMERGENCY_CONTACT = '+1234567890'; // Replace with actual contact

// Message Type
type Message = {
    text: string;
    sender: 'user' | 'bot';
};

const ChatScreen: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState<string>('');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        loadChatHistory();
        startAnimations();
    }, []);

    const startAnimations = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 20,
                friction: 7,
                useNativeDriver: true,
            })
        ]).start();

        // Continuous pulse animation for send button
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ])
        ).start();
    };

    const renderMessage = ({ item, index }: { item: Message; index: number }) => {
        const isUser = item.sender === 'user';
        const messageAnim = new Animated.Value(0);

        Animated.timing(messageAnim, {
            toValue: 1,
            duration: 300,
            delay: index * 100,
            useNativeDriver: true,
        }).start();

        return (
            <Animated.View 
                style={[
                    styles.messageContainer,
                    isUser ? styles.userMessage : styles.botMessage,
                    {
                        opacity: messageAnim,
                        transform: [
                            { scale: messageAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.5, 1]
                            })}
                        ]
                    }
                ]}
            >
                <LinearGradient
                    colors={isUser ? ['#7F5AF0', '#6B46C1'] : ['#2D3748', '#1A202C']}
                    style={styles.messageGradient}
                >
                    <Text style={styles.messageText}>{item.text}</Text>
                </LinearGradient>
            </Animated.View>
        );
    };

    // Load chat history from AsyncStorage
    const loadChatHistory = async () => {
        try {
            const history = await AsyncStorage.getItem('chatHistory');
            if (history) setMessages(JSON.parse(history));
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    };

    // Save chat history to AsyncStorage
    const saveChatHistory = async (chat: Message[]) => {
        try {
            await AsyncStorage.setItem('chatHistory', JSON.stringify(chat));
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    };

    // Fetch AI response from Cohere API
    const getAIResponse = async (userMessage: string): Promise<string> => {
        try {
            const response = await axios.post(
                'https://api.cohere.ai/v1/generate',
                {
                    model: 'command',
                    prompt: `You are a mental health support chatbot. A user said: "${userMessage}". How would you respond in a caring, supportive way?`,
                    max_tokens: 100,
                },
                { headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' } }
            );
            return response.data.generations[0].text;
        } catch (error) {
            console.error('Error fetching AI response:', error);
            return 'Sorry, I am having trouble responding right now.';
        }
    };

    // Analyze sentiment of user messages
    const analyzeSentiment = (text: string): number => {
        const sentiment = new Sentiment();
        const result = sentiment.analyze(text);
        return result.score;
    };

    // Handle sending a message
    const sendMessage = async () => {
        if (!inputText.trim()) return;

        const newMessages = [...messages, { text: inputText, sender: 'user' } as Message];
        setMessages(newMessages);
        saveChatHistory(newMessages);
        setInputText('');

        const aiResponse = await getAIResponse(inputText);
        const updatedMessages = [...newMessages, { text: aiResponse, sender: 'bot' } as Message];
        setMessages(updatedMessages);
        saveChatHistory(updatedMessages);

        // Sentiment analysis check
        const sentimentScore = analyzeSentiment(inputText);
        if (sentimentScore < -2) {
            Alert.alert('Alert', 'You seem very emotional. Do you want to contact someone?');
            sendEmergencyMessage();
        }
    };

    // Function to send emergency message
    const sendEmergencyMessage = () => {
        Alert.alert('Emergency Alert', `Message sent to ${EMERGENCY_CONTACT}`);
    };

    return (
        <LinearGradient 
            colors={['#171923', '#0D1117']} 
            style={styles.container}
        >
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <FlatList
                    data={messages}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderMessage}
                    inverted
                    contentContainerStyle={styles.messageList}
                />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        placeholderTextColor="#4A5568"
                        value={inputText}
                        onChangeText={setInputText}
                    />
                    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                        <TouchableOpacity 
                            style={styles.sendButton} 
                            onPress={sendMessage}
                            activeOpacity={0.7}
                        >
                            <MaterialCommunityIcons name="send" size={24} color="#E2E8F0" />
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Animated.View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    messageList: {
        padding: 15,
    },
    messageContainer: {
        marginVertical: 5,
        maxWidth: '85%',
        borderRadius: 20,
        overflow: 'hidden',
    },
    messageGradient: {
        padding: 15,
        borderRadius: 20,
    },
    userMessage: {
        alignSelf: 'flex-end',
    },
    botMessage: {
        alignSelf: 'flex-start',
    },
    messageText: {
        color: '#E2E8F0',
        fontSize: 16,
        lineHeight: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#1A202C',
        borderTopWidth: 1,
        borderTopColor: '#2D3748',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#2D3748',
        padding: 15,
        borderRadius: 25,
        marginRight: 10,
        fontSize: 16,
        color: '#E2E8F0',
        borderWidth: 1,
        borderColor: '#4A5568',
    },
    sendButton: {
        backgroundColor: '#7F5AF0',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#7F5AF0',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
            },
            android: {
                elevation: 8,
            },
        }),
    },
});

export default ChatScreen;
