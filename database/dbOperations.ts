import workoutsDb from "./workoutsDb";
import { Workout } from "../types/types";
// import SQLite, { SQLiteDatabase, Transaction, ResultSet, ResultSetRowList } from "react-native-sqlite-storage";
import { SQLTransaction, SQLResultSet } from 'expo-sqlite';

// Create the workouts table if it doesn't exist
export const createWorkoutsTable = () => {
  workoutsDb.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS workouts
        (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT,
        elapsed_seconds INTEGER, completed_at TEXT);`,
      [],
      () => {
      console.log('Table created successfully');
    },
    (tx, error) => {
      console.error('Error creating table:', error);
      return false;
    },
    );
  });
};


// Save the workout data and time to the SQLite database
export const saveWorkout = (exercises: any[], elapsed_seconds: number) => {
  // Get the current date and time in ISO format to allow tracking workouts with date and time.
  const completedAt = new Date().toISOString();

  workoutsDb.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO workouts (data, elapsed_seconds, completed_at) VALUES (?, ?, ?);',
      [JSON.stringify(exercises), elapsed_seconds, completedAt],
    );
  });
};

// Load workouts from the SQLite database
export const loadWorkouts = (): Promise<Workout[]> => {
  return new Promise((resolve: (value: Workout[]) => void, reject: (value: any) => void) => {
    workoutsDb.transaction((tx: SQLTransaction) => {
      tx.executeSql(
        'SELECT * FROM workouts;',
        [],
        (_tx: SQLTransaction, results: SQLResultSet) => {
          const workoutData: Workout[] =[];

          for (let i = 0; i < results.rows.length; i++) {
            workoutData.push(results.rows.item(i))
          }
          // send the resolved promise back to the requester.
          resolve(workoutData);
        },
        (error) => {
          reject(error);

        // Roll back the transaction by returning false.
        return false
        },
      );
    });
  });
};


