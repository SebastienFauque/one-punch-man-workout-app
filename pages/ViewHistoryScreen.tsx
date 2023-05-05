import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

import { colors } from '../styles/colors';
import workoutsDb from '../database/workoutsDb';

type ContainerStyle = {
  backgroundColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
};

type TextStyle = {
  color: string;
}

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

