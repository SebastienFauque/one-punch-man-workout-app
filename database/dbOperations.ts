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
  // Get the current date and time in ISO format
  const completedAt = new Date(2023, 5, 2).toISOString();

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
          const workouts: any[] = [];

          for (let i = 0; i < results.rows.length; i++) {
            workouts.push(results.rows.item(i));
          }

          resolve(workouts);
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
export const fetchData = () => {
  workoutsDb.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM workouts;',
      [],
      (_, { rows }) => {
        console.log('rows: ', rows)
      },
      (_, error) => {
        console.error('Error fetching data:', error);

        // Roll back the transaction by returning false.
        return false
      },
    );
  });
};


