import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { formatTime } from '../formattingHelpers/timerFormatting';
// import { createWorkoutsTable, saveWorkout, loadWorkouts } from '../database/dbOperations';


interface Exercise {
  name: string;
  total: number;
  decrement: number;
  remaining: number;
}
const INITIAL_ROUNDS = 10

const initialExercises: Exercise[] = [
  { name: 'Pullups', total: 50, decrement: 5, remaining: 50 },
  { name: 'Squats', total: 100, decrement: 10, remaining: 100 },
  { name: 'Pushups', total: 100, decrement: 10, remaining: 100 },
  { name: 'Situps', total: 200, decrement: 20, remaining: 200 },
];

export const NewWorkoutScreen: React.FC = () => {
  const [exercises, setExercises] = useState(initialExercises);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [round, setRound] = useState(INITIAL_ROUNDS);
  const formattedTime = formatTime(timer)

  // Build the database table if it doesn't already exist.
  // useEffect(() => {
  //   createWorkoutsTable();
  // }, []);

  const completeRound = () => {
    setExercises(
      exercises.map((exercise) => ({
        ...exercise,
        remaining: Math.max(exercise.remaining - exercise.decrement, 0),
      })),
    );
    setRound(round - 1)
    if (round === 1) {
      if (timerActive) {
        toggleTimer()
      }
    }
  };

  const toggleTimer = () => {
    if (timerActive) {
      if (intervalId) clearInterval(intervalId);
    } else {
      const id = setInterval(() => setTimer((prev) => prev + 1), 1000);
      setIntervalId(id);
    }

    setTimerActive(!timerActive);
  };

  const handleSaveWorkout = () => {
    if (timerActive) {
      toggleTimer();
    }
    // Save the current state of the workout and the timer to the database.
    // saveWorkout(exercises, timer);

    console.log('Workout saved:', { exercises, timer });
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formattedTime}</Text>
        <TouchableOpacity style={styles.timerButton} onPress={toggleTimer}>
          <Text style={styles.timerButtonText}>{timerActive ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.grid}>
        <View style={styles.gridRow}>
          <Text style={[styles.gridCell, styles.header]}>Exercise</Text>
          <Text style={[styles.gridCell, styles.header]}>Remaining</Text>
          <Text style={[styles.gridCell, styles.header]}>Subtract</Text>
        </View>
        {exercises.map((exercise, index) => (
          <View key={index} style={styles.gridRow}>
            <Text style={styles.gridCell}>{exercise.name}</Text>
            <Text style={styles.gridCell}>{exercise.remaining}</Text>
            <Text style={styles.gridCell}>{exercise.decrement}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.completeRoundButton} onPress={completeRound}>
        <Text style={styles.completeRoundButtonText}>Complete Round</Text>
      </TouchableOpacity>
      <View style={styles.saveWorkoutContainer}>
        <TouchableOpacity style={styles.saveWorkoutButton} onPress={handleSaveWorkout}>
          <Text style={styles.saveWorkoutButtonText}>Save Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 30,
  },
  timerButton: {
    padding: 10,
    backgroundColor: '#00f',
    borderRadius: 10,
    marginTop: 10,
  },
  timerButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  grid: {
    width: '90%',
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    flex: 1,
    textAlign: 'center',
    padding: 10,
    borderColor: '#ccc',
    borderBottomWidth: 1,
  },
  header: {
    fontWeight: 'bold',
    backgroundColor: '#00f',
    color: '#fff',
  },
  completeRoundButton: {
    padding: 10,
    backgroundColor: '#0f0',
    borderRadius: 10,
    marginBottom: 20,
  },
  completeRoundButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  saveWorkoutContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  saveWorkoutButton: {
    padding: 10,
    backgroundColor: '#00f',
    borderRadius: 10,
  },
  saveWorkoutButtonText: {
    color: '#fff',
    fontSize: 20,
  },
});
