import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MainScreen } from '../../pages/MainScreen';
import { NavigationProp } from '@react-navigation/native';
import { createNavigationProp } from '../testUtils'; // You will create this utility function

describe('MainScreen', () => {
  let navigation: NavigationProp<any, any>;

  beforeEach(() => {
    navigation = createNavigationProp();
  });

  it('renders correctly', () => {
    const { getByText } = render(<MainScreen navigation={navigation} />);
    expect(getByText('OPM Workout')).toBeTruthy();
    expect(getByText('View History')).toBeTruthy();
    expect(getByText('New Workout')).toBeTruthy();
  });

  it('navigates to ViewHistory screen when View History button is pressed', () => {
    const { getByText } = render(<MainScreen navigation={navigation} />);
    fireEvent.press(getByText('View History'));
    expect(navigation.navigate).toHaveBeenCalledWith('ViewHistory');
  });

  it('navigates to NewWorkout screen when New Workout button is pressed', () => {
    const { getByText } = render(<MainScreen navigation={navigation} />);
    fireEvent.press(getByText('New Workout'));
    expect(navigation.navigate).toHaveBeenCalledWith('NewWorkout');
  });
});
