import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CalendarList } from 'react-native-calendars';
import workoutsDb from '../database/workoutsDb'
import  moment  from 'moment';
import { colors } from '../styles/colors';

export const ViewHistoryScreen = () => {
  const [markedDates, setMarkedDates] = useState({});

  // ... your other code ...
useEffect(() => {
  const fetchWorkoutData = async () => {
    workoutsDb.transaction((tx) => {
      tx.executeSql(
        'SELECT completed_at FROM workouts WHERE completed_at IS NOT NULL',
        [],
        (_, { rows }) => {
          const data = rows._array;
          // console.log('#####data: ', data)
          const markedDates = data.reduce((acc, workout) => {
            console.log("### acc: ", acc)
            console.log("@@@ workout: ", workout)
            // const date = workout.completed_at.split(' ')[0]; // Extract the date part
            const localDate = moment(workout.completed_at).local().format('YYYY-MM-DD');


            console.log('#####$$$$date: ', localDate)
            acc[localDate] = {
              customStyles: {
                container: {
                  backgroundColor: colors.green,
                  color: colors.black
                },
              },
            };
            return acc;
          }, {});
          setMarkedDates(markedDates);
        },
        (_, error) => {
          console.error('Error fetching workout data:', error);
          return false
        },
      );
    });
  };

  fetchWorkoutData();
}, []);

  return (
    <View style={styles.container}>
      <CalendarList
        pastScrollRange={24} // Scroll back up to 24 months
        futureScrollRange={24} // Scroll forward up to 24 months
        scrollEnabled={true}
        showScrollIndicator={true}
        markingType={'custom'}
        markedDates={markedDates}
        // Customize the appearance of the calendar, e.g., colors, selected day style, etc.
        theme={{
          backgroundColor: colors.yellow,
          calendarBackground: colors.yellow,
          textSectionTitleColor: colors.black,
          selectedDayBackgroundColor: colors.red,
          selectedDayTextColor: colors.white,
          todayTextColor: colors.red,
          dayTextColor: colors.black,
          textDisabledColor: colors.grey,
          arrowColor: colors.black,
          monthTextColor: colors.black,
          textMonthFontWeight: 'bold',
          textDayFontSize: 18,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 18,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.yellow,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
  },
});
