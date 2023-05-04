import * as SQLite from 'expo-sqlite';

// Open Database
const workoutsDb = SQLite.openDatabase("workouts.db")

export default workoutsDb;
