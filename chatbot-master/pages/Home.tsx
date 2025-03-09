import React, { useEffect, useRef } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Animated, 
    TouchableOpacity, 
    Dimensions,
    Easing,
    Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 60) / 2;

type RootStackParamList = {
    Home: undefined;
    ChatBot: undefined;
    Habit: undefined;
    History: undefined;
    Settings: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Home: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const breatheAnim = useRef(new Animated.Value(1)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        startAnimations();
    }, []);

    const startAnimations = () => {
        // Gentle fade in
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
        }).start();

        // Calming breathing animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(breatheAnim, {
                    toValue: 1.05,
                    duration: 4000, // 4 seconds inhale
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(breatheAnim, {
                    toValue: 1,
                    duration: 4000, // 4 seconds exhale
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                })
            ])
        ).start();

        // Gentle floating animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -10,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                })
            ])
        ).start();

        // Soft glow animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                })
            ])
        ).start();

        // Add particle system animations
        Animated.parallel([
            Animated.loop(
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 10000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ),
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ),
        ]).start();
    };

    const handleCardPress = (type: string) => {
        switch(type) {
            case 'chat':
                navigation.navigate('ChatBot');
                break;
            case 'habit':
                navigation.navigate('Support');
                break;
            case 'history':
                navigation.navigate('History');
                break;
            case 'settings':
                navigation.navigate('Settings');
                break;
            default:
                navigation.navigate('ChatBot');
        }
    };

    const renderCard = (title: string, description: string, icon: string, type: string, index: number) => {
        const translateY = Animated.add(
            floatAnim,
            new Animated.Value(index * 5)
        );

        const cardStyle = {
            opacity: fadeAnim,
            transform: [
                { translateY },
                { scale: breatheAnim }
            ]
        };

        return (
            <Animated.View style={[styles.card, cardStyle]}>
                <TouchableOpacity 
                    style={styles.cardContent}
                    onPress={() => handleCardPress(type)}
                    activeOpacity={0.7}
                >
                    <LinearGradient
                        colors={['#2D3748', '#1A202C']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradient}
                    >
                        <MaterialCommunityIcons 
                            name={icon} 
                            size={32} 
                            color="#7F5AF0" 
                            style={styles.cardIcon}
                        />
                        <Text style={styles.cardTitle}>{title}</Text>
                        <Text style={styles.cardDescription}>{description}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const renderParticleSystem = () => {
        const spin = rotateAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });

        const counterSpin = rotateAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['360deg', '0deg']
        });

        return (
            <View style={styles.particleSystemContainer}>
                <Animated.View style={[styles.particleCore, {
                    transform: [{ scale: pulseAnim }]
                }]}>
                    <LinearGradient
                        colors={['#7F5AF0', '#6B46C1']}
                        style={styles.coreGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />
                </Animated.View>

                <Animated.View style={[styles.orbitRing, {
                    transform: [{ rotate: spin }]
                }]}>
                    {[...Array(12)].map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.orbitParticleContainer,
                                {
                                    transform: [
                                        { rotate: `${i * 30}deg` },
                                        { translateX: 50 }
                                    ]
                                }
                            ]}
                        >
                            <Animated.View style={[styles.particle, {
                                transform: [{ scale: pulseAnim }]
                            }]} />
                        </View>
                    ))}
                </Animated.View>

                <Animated.View style={[styles.orbitRing, {
                    transform: [{ rotate: counterSpin }]
                }]}>
                    {[...Array(8)].map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.orbitParticleContainer,
                                {
                                    transform: [
                                        { rotate: `${i * 45}deg` },
                                        { translateX: 80 }
                                    ]
                                }
                            ]}
                        >
                            <Animated.View style={[styles.particleSmall, {
                                transform: [{ scale: pulseAnim }]
                            }]} />
                        </View>
                    ))}
                </Animated.View>
            </View>
        );
    };

    return (
        <LinearGradient 
            colors={['#171923', '#0D1117']}
            style={styles.container}
        >
            <Animated.Text 
                style={[
                    styles.header,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: floatAnim }]
                    }
                ]}
            >
                Welcome to ChatBot
            </Animated.Text>
            <View style={styles.gridContainer}>
                <View style={styles.row}>
                    {renderCard(
                        "Chat",
                        "Start conversation",
                        "chat-processing",
                        "chat",
                        0
                    )}
                    {renderCard(
                        "Habit",
                        "Track habits",
                        "checkbox-marked-circle-outline",
                        "habit",
                        1
                    )}
                </View>
                <View style={styles.row}>
                    {renderCard(
                        "History",
                        "View past chats",
                        "history",
                        "history",
                        2
                    )}
                    {renderCard(
                        "Settings",
                        "Customize app",
                        "cog",
                        "settings",
                        3
                    )}
                </View>
            </View>
            {renderParticleSystem()}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    header: {
        fontSize: 32,
        fontWeight: '600',
        marginVertical: 30,
        color: '#E2E8F0',
        textAlign: 'center',
        letterSpacing: 0.5,
        textShadowColor: 'rgba(127, 90, 240, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    gridContainer: {
        flex: 1,
        width: '100%',
        paddingTop: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    card: {
        width: CARD_SIZE,
        height: CARD_SIZE,
        backgroundColor: '#2D3748',
        borderRadius: 20,
        elevation: Platform.select({ android: 8, ios: 0 }),
        shadowColor: '#7F5AF0',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#4A5568',
    },
    cardContent: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardIcon: {
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        color: '#7F5AF0',
        letterSpacing: 0.3,
        textAlign: 'center',
        textShadowColor: 'rgba(127, 90, 240, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    cardDescription: {
        fontSize: 14,
        color: '#E2E8F0',
        textAlign: 'center',
        letterSpacing: 0.2,
    },
    particleSystemContainer: {
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    particleCore: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#7F5AF0',
    },
    coreGradient: {
        flex: 1,
        borderRadius: 20,
    },
    orbitRing: {
        position: 'absolute',
        width: 160,
        height: 160,
    },
    orbitParticleContainer: {
        position: 'absolute',
        left: '50%',
        top: '50%',
    },
    particle: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#7F5AF0',
        marginLeft: -4,
        marginTop: -4,
    },
    particleSmall: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#6B46C1',
        marginLeft: -2,
        marginTop: -2,
    }
});

export default Home;