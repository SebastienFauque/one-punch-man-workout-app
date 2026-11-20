import * as SQLite from 'expo-sqlite';

// Open Database
const workoutsDb = SQLite.openDatabaseSync("workouts.db");

export default workoutsDb;
