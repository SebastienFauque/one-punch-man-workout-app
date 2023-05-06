import 'react-native-gesture-handler';
import React from 'react';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MainScreen } from './pages/MainScreen';
import { ViewHistoryScreen } from './pages/ViewHistoryScreen';
import { NewWorkoutScreen } from './pages/NewWorkoutScreen';
import { colors } from './styles/colors';
const Stack = createStackNavigator();

function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require('./assets/OPM_icon.png')}
    />
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Main" component={MainScreen} options={{ title: '' }} />
        <Stack.Screen name="ViewHistory" component={ViewHistoryScreen} options={{ headerTitle: () => <LogoTitle />, headerShown: true, headerStyle: { "backgroundColor": colors.yellow } }} />
        <Stack.Screen name="NewWorkout" component={NewWorkoutScreen} options={{ headerTitle: () => <LogoTitle />, headerShown: true, headerStyle: { "backgroundColor": colors.yellow } }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
