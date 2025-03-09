import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface HabitItem {
    id: string;
    title: string;
    icon: string;
    completed: boolean;
}

const Habit: React.FC = () => {
    const [habits, setHabits] = useState<HabitItem[]>([
        { id: '1', title: 'Morning Meditation', icon: 'meditation', completed: false },
        { id: '2', title: 'Exercise', icon: 'run', completed: false },
        { id: '3', title: 'Read 30 Minutes', icon: 'book-open-variant', completed: false },
        { id: '4', title: 'Drink Water', icon: 'water', completed: false },
        { id: '5', title: 'Healthy Meal', icon: 'food-apple', completed: false },
        { id: '6', title: 'Journal', icon: 'notebook', completed: false },
        { id: '7', title: 'Evening Walk', icon: 'walk', completed: false },
        { id: '8', title: 'Sleep Early', icon: 'moon-waning-crescent', completed: false },
    ]);

    const toggleHabit = (id: string) => {
        setHabits(habits.map(habit => 
            habit.id === id 
                ? { ...habit, completed: !habit.completed }
                : habit
        ));
    };

    const getCompletedCount = () => habits.filter(habit => habit.completed).length;

    return (
        <View style={styles.mainContainer}>
            <LinearGradient 
                colors={['#171923', '#0D1117']}
                style={styles.container}
            >
                <ScrollView style={styles.content}>
                    <Text style={styles.title}>Daily Habits</Text>
                    <Text style={styles.subtitle}>
                        {getCompletedCount()}/{habits.length} completed
                    </Text>

                    <View style={styles.progressBar}>
                        <LinearGradient
                            colors={['#7F5AF0', '#6B46C1']}
                            style={[styles.progress, { width: `${(getCompletedCount() / habits.length) * 100}%` }]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        />
                    </View>

                    <View style={styles.habitList}>
                        {habits.map((habit) => (
                            <TouchableOpacity
                                key={habit.id}
                                onPress={() => toggleHabit(habit.id)}
                                style={styles.habitItem}
                                activeOpacity={0.7}
                            >
                                <LinearGradient
                                    colors={['#2D3748', '#1A202C']}
                                    style={styles.habitItemGradient}
                                >
                                    <MaterialCommunityIcons 
                                        name={habit.completed ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                                        size={24} 
                                        color={habit.completed ? '#7F5AF0' : '#4A5568'} 
                                    />
                                    <Text style={[
                                        styles.habitItemText,
                                        habit.completed && styles.completedText
                                    ]}>
                                        {habit.title}
                                    </Text>
                                    <MaterialCommunityIcons 
                                        name={habit.icon as keyof typeof MaterialCommunityIcons.glyphMap} 
                                        size={24} 
                                        color="#7F5AF0" 
                                        style={styles.habitIcon}
                                    />

                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingTop: 50,
        paddingBottom: 20,
    },
    content: {
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E2E8F0',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#A0AEC0',
        textAlign: 'center',
        marginBottom: 20,
    },
    progressBar: {
        height: 10,
        width: width * 0.8,
        backgroundColor: '#2D3748',
        borderRadius: 10,
        overflow: 'hidden',
        alignSelf: 'center',
        marginBottom: 20,
    },
    progress: {
        height: '100%',
        borderRadius: 10,
    },
    habitList: {
        marginTop: 10,
    },
    habitItem: {
        marginBottom: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    habitItemGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    habitItemText: {
        flex: 1,
        fontSize: 16,
        color: '#E2E8F0',
        marginLeft: 10,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#A0AEC0',
    },
    habitIcon: {
        marginLeft: 10,
    },
});

export default Habit;
