import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatTime } from '../formattingHelpers/timerFormatting';
import WheelPicker from 'react-native-wheely';
import { createWorkoutsTable, saveWorkout } from '../database/dbOperations';
import { colors } from '../styles/colors';

const INITIAL_ROUNDS = 10
const TOTAL_LEVELS = 25

interface Exercise {
  name: string;
  total: number;
  remaining: number;
}
interface LevelData {
  pullups: number;
  pushups: number;
  squats: number;
  situps: number;
}

const allLevels: () => {[key: string]: LevelData} = () => {
  const levels: {[key: string]: LevelData} = {}
  for (let i = 0; i < TOTAL_LEVELS; i++) {
    levels[`${i}`] = {pullups: i, pushups: i * 2, squats: i *2, situps: i * 4}
  }
  return levels;
}


const initialExercises: Exercise[] = [
  { name: 'Pullups', total: 50, remaining: 50 },
  { name: 'Squats', total: 100, remaining: 100 },
  { name: 'Pushups', total: 100, remaining: 100},
  { name: 'Situps', total: 200, remaining: 200 },
];


const getDecrementers: (level: number) => { [key: string]: number} = (level) => {
  return {
    Pullups: 1 * level,
    Squats: 2 * level,
    Pushups: 2 * level,
    Situps: 4 * level
  }
}

export const NewWorkoutScreen: React.FC = () => {
  const [exercises, setExercises] = useState(initialExercises);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [round, setRound] = useState(INITIAL_ROUNDS);
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [decrementers, setDecrementers] = useState(getDecrementers(1))
  const formattedTime = formatTime(timer)


  // Build the database table if it doesn't already exist.
  useEffect(() => {
    createWorkoutsTable();
  }, []);

  // Change the decrementers each time the user changes
  // their selected level.
  useEffect(() => {
    setDecrementers(getDecrementers(selectedLevel))
  }, [selectedLevel])

  // Allows the app to automatically stop the timer
  // once the user has reached 0 exercises remaining.
  useEffect(() => {
    checkRemainingValues();
  }, [exercises])

  const completeRound = () => {
    // Subtracks repetitions from the remaining repetitions
    // in the exercise using the decrementers and indexing by
    // exercise name.
    setExercises(
      exercises.map((exercise) => ({
        ...exercise,
        remaining: Math.max(exercise.remaining - decrementers[exercise.name], 0),
      })),
    );
    setRound(round - 1)

  };

  // Stop the workout timer once all exercises remaining hit 0 so that
  // an accurate completion time is recorded. Running time is separate.
  // Currently all exercises will reach 0 at the same time.
  const checkRemainingValues = () => {
    const finishedExercises = exercises.some((exercise) => exercise.remaining <= 0)
    if (finishedExercises && timerActive) {
      toggleTimer();
    }
  }

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
    saveWorkout(exercises, timer);
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flexDirection: 'column', alignItems: 'center', marginRight: 30}}>
          <WheelPicker
            selected={selectedLevel}
            options={Array.from({length: TOTAL_LEVELS}, (_, i) => i + 1)}
            onChange={(level: string) => {setSelectedLevel(Number(level))}}
            containerStyle={{ width: 60, borderColor: colors.mustard, borderWidth: 2, borderRadius: 10}}
            selectedIndicatorStyle={{ backgroundColor: colors.sky_blue}}
            itemHeight={30}
          />
          <Text style={styles.levelText}>Level</Text>
          </View>
        <View style={{flexDirection: 'column', alignItems: 'center', marginLeft: 30}}>
        <Text style={styles.timerText}>{formattedTime}</Text>
        <TouchableOpacity style={styles.timerButton} onPress={toggleTimer}>
          <Text style={styles.timerButtonText}>{timerActive ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
        </View>

        </View>
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
            <Text style={styles.gridCell}>{decrementers[exercise.name]}</Text>
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
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 30,
    color: colors.dark_red,
  },
  levelText: {
    fontSize: 20,
    color: colors.dark_red
  },
  timerButton: {
    padding: 10,
    backgroundColor: colors.red,
    borderRadius: 10,
    marginTop: 10,
  },
  timerButtonText: {
    color: colors.white,
    fontSize: 20,
  },
  grid: {
    width: '90%',
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: colors.sky_blue,
    overflow: 'hidden',
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    flex: 1,
    textAlign: 'center',
    padding: 10,
    borderColor: colors.grey,
    borderBottomWidth: 1,
    fontSize: 18,
  },
  header: {
    fontWeight: 'bold',
    backgroundColor: colors.red,
    color: colors.white,
  },
  completeRoundButton: {
    padding: 10,
    backgroundColor: colors.red,
    borderRadius: 10,
    marginBottom: 20,
  },
  completeRoundButtonText: {
    color: colors.white,
    fontSize: 20,
  },
  saveWorkoutContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  saveWorkoutButton: {
    padding: 10,
    backgroundColor: colors.dark_red,
    borderRadius: 10,
  },
  saveWorkoutButtonText: {
    color: colors.white,
    fontSize: 20,
  },
});
