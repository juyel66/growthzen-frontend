import { useTheme } from './useTheme';

export const useBackground = () => {
  const theme = useTheme();
  
  return {
    backgroundColor: theme.backgroundColor || '#ffffff',
    cardBackground: '#f8fafc', // Slate 50
    footerBackground: '#f1f5f9', // Slate 100
    subtleGray: '#f8fafc', // Slate 50
    heroBackground: '#f3fbf6', // Dynamic very soft green to coordinate with primary green theme
  };
};
export default useBackground;
