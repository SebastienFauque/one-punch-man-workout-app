import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { colors } from '../styles/colors';


interface MainScreenProps {
  navigation: any;
}

export const MainScreen: React.FC<MainScreenProps> = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>One Punch Man</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ViewHistory')}>
        <Text style={styles.buttonText}>View History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NewWorkout')}>
        <Text style={styles.buttonText}>New Workout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.yellow,
  },
  title: {
    color: colors.red,
    fontSize: 32,
    marginBottom: 30,
  },
  button: {
    backgroundColor: colors.red,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
