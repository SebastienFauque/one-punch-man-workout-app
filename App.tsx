import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MainScreen } from './pages/MainScreen';
import { ViewHistoryScreen } from './pages/ViewHistoryScreen';
import { NewWorkoutScreen } from './pages/NewWorkoutScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainScreen} options={{ title: 'Workout App' }} />
        <Stack.Screen name="ViewHistory" component={ViewHistoryScreen} options={{ title: 'View History' }} />
        <Stack.Screen name="NewWorkout" component={NewWorkoutScreen} options={{ title: 'New Workout' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
