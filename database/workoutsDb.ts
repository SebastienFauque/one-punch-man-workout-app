import * as SQLite from 'expo-sqlite/legacy';

// Open Database
const workoutsDb = SQLite.openDatabase("workouts.db")

export default workoutsDb;
