import { useContext } from 'react';
import { Switch } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Switch
      value={theme === 'dark'}
      onValueChange={toggleTheme}
      trackColor={{ false: '#bfdbfe', true: '#4b5563' }}
      thumbColor={theme === 'dark' ? '#f3f4f6' : '#1f2937'}
      ios_backgroundColor="#bfdbfe"
      style={{
        position: 'absolute',
        top: 16,
        left: 16,
        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
      }}
    />
  );
}
