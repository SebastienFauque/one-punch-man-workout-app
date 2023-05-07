import workoutsDb from "./workoutsDb";


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
export const loadWorkouts = () => {
  return new Promise((resolve, reject) => {
    workoutsDb.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM workouts;',
        [],
        (tx, results) => {
          // send the resolved promise back to the requester.
          resolve(results.rows);
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


