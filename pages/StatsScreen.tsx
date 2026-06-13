import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import moment from 'moment';
import { loadWorkouts } from '../database/dbOperations';
import { colors } from '../styles/colors';

const PERIODS = [
  { label: '2 Weeks', days: 14 },
  { label: '1 Month', days: 30 },
  { label: '3 Months', days: 90 },
  { label: '6 Months', days: 180 },
  { label: '12 Months', days: 365 },
];

const EXERCISES = ['Pullups', 'Squats', 'Pushups', 'Situps'];

interface ExerciseAverage {
  name: string;
  avgPerDay: number;
  total: number;
}

export const StatsScreen: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[1]);
  const [averages, setAverages] = useState<ExerciseAverage[]>([]);
  const [workoutCount, setWorkoutCount] = useState(0);

  useEffect(() => {
    computeAverages();
  }, [selectedPeriod]);

  const computeAverages = async () => {
    const allWorkouts = await loadWorkouts();
    const cutoff = moment().subtract(selectedPeriod.days, 'days').startOf('day');

    const filtered = allWorkouts.filter(
      (w) => w.completed_at && moment(w.completed_at).isAfter(cutoff),
    );

    setWorkoutCount(filtered.length);

    const totals: { [key: string]: number } = {};
    EXERCISES.forEach((e) => (totals[e] = 0));

    filtered.forEach((workout) => {
      try {
        const exercises: { name: string; total: number; remaining: number }[] = JSON.parse(workout.data);
        exercises.forEach((ex) => {
          if (totals[ex.name] !== undefined) {
            totals[ex.name] += ex.total - ex.remaining;
          }
        });
      } catch (_) {}
    });

    setAverages(
      EXERCISES.map((name) => ({
        name,
        total: totals[name],
        avgPerDay: Math.round((totals[name] / selectedPeriod.days) * 10) / 10,
      })),
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Time Period</Text>
      <View style={styles.periodRow}>
        {PERIODS.map((period) => (
          <TouchableOpacity
            key={period.label}
            style={[
              styles.periodButton,
              selectedPeriod.days === period.days && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod.days === period.days && styles.periodButtonTextActive,
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subText}>
        {workoutCount} workout{workoutCount !== 1 ? 's' : ''} in this period
      </Text>

      <View style={styles.grid}>
        <View style={styles.gridRow}>
          <Text style={[styles.gridCell, styles.header]}>Exercise</Text>
          <Text style={[styles.gridCell, styles.header]}>Avg / Day</Text>
          <Text style={[styles.gridCell, styles.header]}>Total</Text>
        </View>
        {averages.map((avg, i) => (
          <View key={i} style={styles.gridRow}>
            <Text style={styles.gridCell}>{avg.name}</Text>
            <Text style={styles.gridCell}>{avg.avgPerDay}</Text>
            <Text style={styles.gridCell}>{avg.total}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.yellow,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark_red,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  periodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.red,
    backgroundColor: 'transparent',
  },
  periodButtonActive: {
    backgroundColor: colors.red,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.red,
  },
  periodButtonTextActive: {
    color: colors.white,
  },
  subText: {
    fontSize: 16,
    color: colors.dark_red,
    marginBottom: 20,
  },
  grid: {
    width: '100%',
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
    padding: 12,
    borderColor: colors.grey,
    borderBottomWidth: 1,
    fontSize: 16,
  },
  header: {
    fontWeight: 'bold',
    backgroundColor: colors.red,
    color: colors.white,
    fontSize: 16,
  },
});
