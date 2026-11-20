import workoutsDb from "./workoutsDb";
import { Workout } from "../types/types";

// Create the workouts table if it doesn't exist
export const createWorkoutsTable = async () => {
  try {
    await workoutsDb.execAsync(
      `CREATE TABLE IF NOT EXISTS workouts
        (id INTEGER PRIMARY KEY AUTOINCREMENT,
          data TEXT,
        elapsed_seconds INTEGER,
        completed_at TEXT);`
    );
  } catch (error) {
    console.error('Error creating table:', error);
  }
};

// Save the workout data and time to the SQLite database
export const saveWorkout = async (exercises: any[], elapsed_seconds: number) => {
  // Get the current date and time in ISO format to allow tracking workouts with date and time.
  const completedAt = new Date().toISOString();

  try {
    await workoutsDb.runAsync(
      'INSERT INTO workouts (data, elapsed_seconds, completed_at) VALUES (?, ?, ?);',
      [JSON.stringify(exercises), elapsed_seconds, completedAt],
    );
  } catch (error) {
    console.error('Error saving workout:', error);
  }
};

// Load workouts from the SQLite database
export const loadWorkouts = (): Promise<Workout[]> => {
  return workoutsDb.getAllAsync<Workout>('SELECT * FROM workouts;');
};

//! TODO: Finish the sql query or the python to calculate a streak
//! Should allow 1 day between workouts.
