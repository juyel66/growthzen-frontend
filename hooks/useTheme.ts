import { useAppSelector } from '@/redux/hooks';

export interface ThemeColors {
  primaryColor: string;
  secondaryColor: string;
  buttonColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
}

export const useTheme = (): ThemeColors => {
  try {
    const theme = useAppSelector((state) => state.theme);
    if (theme) {
      return theme;
    }
  } catch (e) {
    // Fallback if accessed outside of Provider or during SSR initialization
  }

  return {
    primaryColor: '#22c55e', // Green
    secondaryColor: '#64748b', // Slate
    buttonColor: '#22c55e', // Green
    backgroundColor: '#ffffff', // White
    textColor: '#0f172a', // Slate-900
    borderColor: '#e2e8f0', // Slate-200
  };
};
export default useTheme;

