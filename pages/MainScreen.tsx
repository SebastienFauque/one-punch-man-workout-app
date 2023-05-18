import React from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { colors } from '../styles/colors';



type RootStackParamList = {
  Home: undefined;
  ViewHistory: undefined;
  NewWorkout: undefined;
};

type MainScreenProps = {
  navigation: NavigationProp<RootStackParamList, 'ViewHistory' | 'NewWorkout'>;
};



export const MainScreen: React.FC<MainScreenProps> = ({ navigation }: MainScreenProps) => {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OPM Workout</Text>
    <Image
      style={{ width: '100%', height: '25%', margin: 20 }}
      source={require('../assets/OPM_pose.png')}
    />
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
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: colors.red,
    padding: 10,
    borderRadius: 5,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
