import React, { useEffect, useRef, useState } from 'react';
import { 
    View, 
    Text,
    StyleSheet, 
    Animated, 
    TouchableOpacity, 
    Dimensions,
    Easing,
    TextInput,
    FlatList,
    Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const Home = () => {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const expandAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCards] = useState([
        { icon: "chat", title: "ChatScreen", index: 0 },
        { icon: "history", title: "History", index: 1 },
        { icon: "cog", title: "Settings", index: 2 },
        { icon: "help-circle", title: "Support", index: 3 },
        { icon: "bell", title: "Notifications", index: 4 },
        { icon: "account", title: "Profile", index: 5 },
        { icon: "calendar", title: "Calendar", index: 6 },
        { icon: "star", title: "Favorites", index: 7 },
        { icon: "folder", title: "Documents", index: 8 },
        { icon: "chart-bar", title: "Analytics", index: 9 }
    ]);

    useEffect(() => {
        startAnimations();
    }, []);

    const startAnimations = () => {
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

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
        Animated.parallel([
            Animated.spring(expandAnim, {
                toValue: isExpanded ? 0 : 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: isExpanded ? 1 : 0.8,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            })
        ]).start();
    };

    const renderCard = (icon: string, title: string, index: number) => {
        const angleRad = ((index * 36) * Math.PI) / 180;
        const distance = 180;
        const verticalOffset = -150; // Increased from -100 to -150 to move cards higher
        
        return (
            <Animated.View
                style={[
                    styles.card,
                    {
                        transform: [
                            {
                                translateX: expandAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, distance * Math.cos(angleRad)]
                                })
                            },
                            {
                                translateY: expandAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, (distance * Math.sin(angleRad)) + verticalOffset]
                                })
                            },
                            { scale: expandAnim },
                            {
                                rotate: expandAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '360deg']
                                })
                            }
                        ],
                        opacity: expandAnim
                    }
                ]}
            >
                <TouchableOpacity
                    style={styles.cardButton}
                    onPress={() => navigation.navigate(title)}
                >
                    <LinearGradient
                        colors={['#2D3748', '#1A202C']}
                        style={styles.cardContent}
                    >
                        <MaterialCommunityIcons name={icon} size={24} color="#7F5AF0" />
                        <Text style={styles.cardText}>{title}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const renderCircleAnimation = () => {
        return (
            <Animated.View style={styles.circleContainer}>
                <LinearGradient
                    colors={['#7F5AF0', '#6B46C1']}
                    style={styles.circleGradient}
                >
                    <Animated.View style={{
                        transform: [
                            { rotate: rotateAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '360deg']
                            })}
                        ]
                    }}>
                        <View style={styles.particleRing}>
                            {[...Array(8)].map((_, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.particle,
                                        {
                                            transform: [
                                                { rotate: `${i * 45}deg` },
                                                { translateX: 30 }
                                            ]
                                        }
                                    ]}
                                />
                            ))}
                        </View>
                    </Animated.View>
                </LinearGradient>
            </Animated.View>
        );
    };

    const renderParticleRing = () => {
        const spin = rotateAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });

        const counterSpin = rotateAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['360deg', '0deg']
        });

        return (
            <TouchableOpacity 
                style={styles.particleSystemContainer}
                onPress={() => navigation.navigate('ChatBot')}  // Added navigation
                activeOpacity={0.7}
            >
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
            </TouchableOpacity>
        );
    };

    const getFilteredCards = () => {
        if (!searchQuery) return [];
        return filteredCards.filter(card => 
            card.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <MaterialCommunityIcons 
                    name="magnify" 
                    size={24} 
                    color="#7F5AF0" 
                    style={styles.searchIcon}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search cards..."
                    placeholderTextColor="#4A5568"
                    value={searchQuery}
                    onChangeText={(text) => {
                        setSearchQuery(text);
                        if (text.length > 0 && isExpanded) {
                            // Collapse cards if they're expanded when search starts
                            toggleExpansion();
                        }
                    }}
                />
            </View>
            
            <Animated.View 
                style={[
                    styles.profileCard,
                    { opacity: Animated.subtract(1, expandAnim) } // Fade out when cards expand
                ]}
            >
                <LinearGradient
                    colors={['#2D3748', '#1A202C']}
                    style={styles.profileGradient}
                >
                    <Image
                        source={{ uri: 'https://via.placeholder.com/120' }}
                        style={styles.profileImage}
                    />
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>John Doe</Text>
                        <Text style={styles.profileStatus}>Online</Text>
                        <Text style={styles.profileRole}>Software Developer</Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton}>
                        <MaterialCommunityIcons
                            name="chevron-right"
                            size={28}
                            color="#7F5AF0"
                        />
                    </TouchableOpacity>
                </LinearGradient>
            </Animated.View>

            {searchQuery.length > 0 && (
                <View style={styles.suggestionsContainer}>
                    <FlatList
                        data={getFilteredCards()}
                        keyExtractor={(item) => item.title}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                style={styles.suggestionItem}
                                onPress={() => {
                                    navigation.navigate(item.title);
                                    setSearchQuery('');
                                }}
                            >
                                <MaterialCommunityIcons 
                                    name={item.icon} 
                                    size={24} 
                                    color="#7F5AF0" 
                                />
                                <Text style={styles.suggestionText}>{item.title}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
            
            <View style={styles.menuContainer}>
                {renderCard("chat", "ChatScreen", 0)}      // Top Left
                {renderCard("history", "History", 1)}      // Top Center
                {renderCard("cog", "Settings", 2)}         // Top Right
                {renderCard("help-circle", "Support", 3)}  // Middle Left
                {renderCard("bell", "Notifications", 4)}   // Middle Center
                {renderCard("account", "Profile", 5)}      // Middle Right
                {renderCard("calendar", "Calendar", 6)}    // Bottom Left
                {renderCard("star", "Favorites", 7)}       // Bottom Center
                {renderCard("folder", "Documents", 8)}     // Bottom Right
                {renderCard("chart-bar", "Analytics", 9)}  // Extra card will be in center bottom

                <TouchableOpacity
                    style={[
                        styles.centerButton, 
                        styles.centeredPosition,
                        { opacity: searchQuery.length > 0 ? 0 : 1 }
                    ]}
                    onPress={toggleExpansion}
                    activeOpacity={0.8}
                    pointerEvents={searchQuery.length > 0 ? 'none' : 'auto'}
                >
                    <LinearGradient
                        colors={['#7F5AF0', '#6B46C1']}
                        style={styles.centerButtonGradient}
                    >
                        <Animated.View style={{
                            transform: [
                                { rotate: rotateAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '360deg']
                                })},
                                { scale: scaleAnim }
                            ]
                        }}>
                            <MaterialCommunityIcons
                                name={isExpanded ? "close" : "plus"}
                                size={32}
                                color="#FFFFFF"
                            />
                        </Animated.View>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
            {renderParticleRing()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#171923',
    },
    menuContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingTop: 150, // Increased padding to push content up further
    },
    centerButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#2D3748',
        elevation: 8,
        shadowColor: '#7F5AF0',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        zIndex: 2,
    },
    centerButtonGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centeredPosition: {
        position: 'absolute',
        left: '50%',
        top: '35%', // Moved down from 30% to 45%
        transform: [
            { translateX: -30 }, // Half of button width
            { translateY: -30 }  // Half of button height
        ],
        zIndex: 3, // Ensure it stays on top
    },
    card: {
        position: 'absolute',
        width: 90, // Increased from 70
        height: 90, // Increased from 70
        zIndex: 1,
    },
    cardButton: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#7F5AF0',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    cardContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15, // Increased padding
    },
    cardText: {
        marginTop: 8,
        fontSize: 14, // Increased from 12
        color: '#E2E8F0',
        fontWeight: '600',
    },
    circleContainer: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
    },
    circleGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: '#7F5AF0',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    particleRing: {
        width: 60,
        height: 60,
        position: 'absolute',
    },
    particle: {
        position: 'absolute',
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
    },
    bottomCircleContainer: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
        zIndex: 1,
    },
    bottomCircleGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: '#7F5AF0',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    particleSystemContainer: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 50,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        zIndex: 1,
    },
    particleCore: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#7F5AF0',
        elevation: 8,
        shadowColor: '#7F5AF0',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
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
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2D3748',
        margin: 16,
        marginTop: 10,
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#4A5568',
    },
    
    searchIcon: {
        marginRight: 12,
    },
    
    searchInput: {
        flex: 1,
        height: 50,
        color: '#E2E8F0',
        fontSize: 16,
    },
    
    suggestionsContainer: {
        position: 'absolute',
        top: 110,
        left: 16,
        right: 16,
        backgroundColor: '#2D3748',
        borderRadius: 12,
        maxHeight: 200,
        zIndex: 10,
        borderWidth: 1,
        borderColor: '#4A5568',
    },
    
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#4A5568',
    },
    
    suggestionText: {
        marginLeft: 12,
        color: '#E2E8F0',
        fontSize: 16,
    },
    profileCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#7F5AF0',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        height: 120, // Increased height
    },
    
    profileGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 0, // Removed padding
        borderWidth: 1,
        borderColor: '#4A5568',
        borderRadius: 16,
        height: '100%',
    },
    
    profileImage: {
        width: 120, // Square size matching card height
        height: 120,
        borderRadius: 0, // Remove border radius
        borderRightWidth: 2,
        borderColor: '#7F5AF0',
    },
    
    profileInfo: {
        flex: 1,
        marginLeft: 16,
        paddingVertical: 12,
    },
    
    profileName: {
        fontSize: 20, // Increased size
        fontWeight: '700',
        color: '#E2E8F0',
        marginBottom: 6,
    },
    
    profileStatus: {
        fontSize: 16,
        color: '#48BB78',
        marginBottom: 4,
    },

    profileRole: {
        fontSize: 14,
        color: '#A0AEC0',
    },
    
    profileButton: {
        padding: 16,
        height: '100%',
        justifyContent: 'center',
    }
});

export default Home;
