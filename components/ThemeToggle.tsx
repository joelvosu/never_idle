import { useContext } from 'react';
import { Switch, StyleProp, ViewStyle } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  style?: StyleProp<ViewStyle>;
}

export default function ThemeToggle({ style }: ThemeToggleProps) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Switch
      value={theme === 'dark'}
      onValueChange={toggleTheme}
      trackColor={{ false: '#bfdbfe', true: '#4b5563' }}
      thumbColor={theme === 'dark' ? '#f3f4f6' : '#1f2937'}
      ios_backgroundColor="#bfdbfe"
      style={style}
    />
  );
}
