import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeSettings } from '@/types/settings';

const initialState: ThemeSettings = {
  primaryColor: '#22c55e', // Green
  secondaryColor: '#64748b', // Slate
  buttonColor: '#22c55e', // Green
  backgroundColor: '#ffffff', // White
  textColor: '#0f172a', // Slate-900
  borderColor: '#e2e8f0', // Slate-200
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Partial<ThemeSettings>>) => {
      return { ...state, ...action.payload };
    },
    resetTheme: () => initialState,
  },
});

export const { setTheme, resetTheme } = themeSlice.actions;
export default themeSlice.reducer;
export const selectTheme = (state: { theme: ThemeSettings }) => state.theme;

