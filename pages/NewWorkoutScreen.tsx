import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

interface Exercise {
  name: string;
  total: number;
  decrement: number;
  remaining: number;
}

const initialExercises: Exercise[] = [
  { name: 'Pullups', total: 50, decrement: 5, remaining: 50 },
  { name: 'Squats', total: 100, decrement: 10, remaining: 100 },
  { name: 'Pushups', total: 100, decrement: 10, remaining: 100 },
  { name: 'Situps', total: 200, decrement: 20, remaining: 200 },
];

export const NewWorkoutScreen: React.FC = () => {
  const [exercises, setExercises] = useState(initialExercises);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const completeRound = () => {
    setExercises(
      exercises.map((exercise) => ({
        ...exercise,
        remaining: Math.max(exercise.remaining - exercise.decrement, 0),
      })),
    );
  };

  const toggleTimer = () => {
    if (timerRunning) {
      if (intervalId) clearInterval(intervalId);
    } else {
      const id = setInterval(() => setTimer((prev) => prev + 1), 1000);
      setIntervalId(id);
    }

    setTimerRunning(!timerRunning);
  };

  const saveWorkout = () => {
    if (timerRunning) {
      toggleTimer();
    }
    // Save the current state of the workout and the timer value here.
    // This can be done using AsyncStorage, a local database, or an API call.

    console.log('Workout saved:', { exercises, timer });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.button} onPress={completeRound}>
          <Text style={styles.buttonText}>Complete Round</Text>
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.remainingText}>Remaining</Text>
          <Text style={styles.subtractText}>Subtract</Text>
        </View>
      </View>
      <View style={styles.exerciseGrid}>
        {exercises.map((exercise, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.exerciseText}>{exercise.name}</Text>
            <Text style={styles.remainingText}>{exercise.remaining}</Text>
            <Text style={styles.decrementText}>{exercise.decrement}</Text>
          </View>
        ))}
      </View>
      <View style={styles.timerRow}>
        <TouchableOpacity style={styles.button} onPress={toggleTimer}>
          <Text style={styles.buttonText}>{timerRunning ? 'Stop' : 'Start'}</Text>
        </TouchableOpacity>
        <Text style={styles.timerText}>{timer}s</Text>
      </View>
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={saveWorkout}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
  },
  remainingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtractText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  exerciseGrid: {
    flexDirection: 'column',
    marginBottom: 20,
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width: '100%',
  },
  exerciseText: {
    fontSize: 18,
  },
  totalText: {
    fontSize: 18,
  },
  decrementText: {
    fontSize: 18,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 24,
    marginLeft: 10,
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
