import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from './pages/ChatScreen';
import Home from './pages/Home';
import Support from './pages/Support';
import { TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import Habit from './pages/Habit';
const Stack = createStackNavigator();

const App: React.FC = () => {
    return (
        <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor="#171923" />
            <Stack.Navigator 
                initialRouteName="Home"
                screenOptions={{
                    headerBackground: () => (
                        <LinearGradient
                            colors={['#171923', '#1A202C']}
                            style={{ flex: 1 }}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        />
                    ),
                    headerTintColor: '#E2E8F0',
                    headerStyle: {
                        height: 60,
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                    headerTitleStyle: {
                        fontWeight: '600',
                        fontSize: 18,
                        color: '#E2E8F0',
                    },
                    headerTitleAlign: 'center'
                }}
            >
                <Stack.Screen 
                    name="Home" 
                    component={Home}
                    options={{
                        title: 'Welcome'
                    }}
                />
                
                <Stack.Screen 
                    name="ChatBot" 
                    component={ChatScreen}
                    options={({ navigation }) => ({
                        title: 'ChatBot',
                        headerLeft: () => (
                            <TouchableOpacity 
                                onPress={() => navigation.navigate('Home')}
                                style={styles.headerButton}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="home" size={22} color="#7F5AF0" />
                            </TouchableOpacity>
                        ),
                    })}
                />

                <Stack.Screen 
                    name="Support" 
                    component={Support}
                    options={({ navigation }) => ({
                        title: 'Support',
                        headerLeft: () => (
                            <TouchableOpacity 
                                onPress={() => navigation.goBack()}
                                style={styles.headerButton}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="arrow-back" size={22} color="#7F5AF0" />
                            </TouchableOpacity>
                        ),
                    })}
                />
                <Stack.Screen 
    name="Habit" 
    component={Habit}
    options={({ navigation }) => ({
        title: 'Daily Habits',
        headerLeft: () => (
            <TouchableOpacity 
                onPress={() => navigation.goBack()}
                style={styles.headerButton}
                activeOpacity={0.7}
            >
                <Ionicons name="arrow-back" size={22} color="#7F5AF0" />
            </TouchableOpacity>
        ),
    })}
/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    headerButton: {
        marginLeft: 15,
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#2D3748',
    }
});

export default App;
