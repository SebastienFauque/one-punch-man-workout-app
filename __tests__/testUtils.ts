import { NavigationProp } from '@react-navigation/native';

export const createNavigationProp = (): NavigationProp<any, any> => ({
  navigate: jest.fn(),
});
