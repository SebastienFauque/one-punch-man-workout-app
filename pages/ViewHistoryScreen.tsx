import React, { useState, useEffect } from 'react';
import { loadWorkouts } from '../database/dbOperations';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import * as Sharing from 'expo-sharing';
import moment from 'moment';
import * as FileSystem from 'expo-file-system';
import { colors } from '../styles/colors';
import workoutsDb from '../database/workoutsDb';
import { Workout } from '../types/types';

type ContainerStyle = {
  backgroundColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
};

type TextStyle = {
  color: string;
}

const handleExport = async () => {
  // Fetch workout data from database and call exportDataAsJSON
  const workouts = await loadWorkouts()

  // convert and export (share) data.
  await exportDataAsJSON(workouts);

}

const exportDataAsJSON = async (data: Workout[]) => {
  try {
    const json = JSON.stringify(data);
    const fileName = FileSystem.documentDirectory + 'workouts_data.json'
    // Write json to a file
    await FileSystem.writeAsStringAsync(fileName, json, {encoding: FileSystem.EncodingType.UTF8})

    // Check for file sharing availability
    if (!(await Sharing.isAvailableAsync())) {
      alert("Sharing isn't available on this platform.")
      return;
    }
    // Share the json file
    const sharingOptions = {
      mimeType: 'application/json',
      dialogTitle: 'Share workout data',
    };
    await Sharing.shareAsync(fileName, sharingOptions);
  } catch (error) {
    console.error('Error exporting data:', error);
  }
};


export const ViewHistoryScreen = () => {
  const [markedDates, setMarkedDates] = useState<{ [key: string]: { selected: boolean; marked: boolean; customStyles: { container: ContainerStyle; text: TextStyle; }; }; }>({});

  useEffect(() => {
    const fetchCompletedWorkouts = async () => {
      workoutsDb.transaction(tx => {
        tx.executeSql(
          'SELECT completed_at FROM workouts WHERE completed_at IS NOT NULL',
          [],
          (_, result) => {
            const data: string[] = [];
            for (let i = 0; i < result.rows.length; i++) {
              data.push(result.rows.item(i).completed_at);
            }

            const markedDates = data.reduce<{ [key: string]: { selected: boolean; marked: boolean; customStyles: { container: ContainerStyle; text: TextStyle; }; }; }>((acc, dateString) => {
              const localDateString = moment.utc(dateString).local().format('YYYY-MM-DD');
              acc[localDateString] = {
                selected: false,
                marked: false,
                customStyles: {
                  container: {
                    backgroundColor: colors.sky_blue,
                    borderRadius: 10,
                  },
                  text: {
                    color: colors.black,
                  },
                },
              };
              return acc;
            }, {});

            setMarkedDates(markedDates);
          },
          (_ , error ) => {
            console.error('Error fetching data:', error);
            return false;
          }
        );
      });
    };

    fetchCompletedWorkouts();
  }, []);

  const currentMonth = moment().format('YYYY-MM');
  const currentMonthStart = moment(currentMonth).startOf('month').format('YYYY-MM-DD');
  const currentMonthEnd = moment(currentMonth).endOf('month').format('YYYY-MM-DD');

  return (
    <View style={styles.container}>
      <Calendar
        minDate={currentMonthStart}
        maxDate={currentMonthEnd}
        markingType="custom"
        markedDates={markedDates}
        theme={{
          calendarBackground: colors.yellow,
          dayTextColor: colors.black,
          textDayFontSize: 20,
          textDayHeaderFontSize: 14,
          textDayHeaderFontWeight: "bold",
          textSectionTitleColor: colors.black,
          textDisabledColor:colors.red,
          monthTextColor: colors.red,
          textMonthFontSize: 20,
          textMonthFontWeight: "bold",
          arrowColor: colors.red,
        }}

        style={{
          marginTop: 20,

        }}
      />
      <View style={styles.container}>
        <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
          <Text style={styles.exportButtonText}>Export Workouts</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.yellow,
  },
  exportContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
  },
  exportButton: {
    backgroundColor: colors.red,
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    margin: 20,
  },
  exportButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  calendar: {
    flex: 1,
    margin: 20,
  }
});

