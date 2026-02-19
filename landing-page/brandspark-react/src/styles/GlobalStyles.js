import { createGlobalStyle } from 'styled-components';
import { useTheme } from './ThemeContext';

const GlobalStyles = () => {
  const { theme } = useTheme();

  const lightTheme = {
    primaryColor: '#6366F1', // Indigo 500
    secondaryColor: '#06B6D4', // Cyan 500
    accentColor: '#F97316', // Orange 500
    textPrimary: '#1F2937', // Gray 900
    textSecondary: '#6B7280', // Gray 500
    background: '#F9FAFB', // Gray 50
    backgroundLight: '#FFFFFF', // White
    borderColor: '#E5E7EB', // Gray 200
  };

  const darkTheme = {
    primaryColor: '#818CF8', // Indigo 400
    secondaryColor: '#22D3EE', // Cyan 400
    accentColor: '#FB923C', // Orange 400
    textPrimary: '#F9FAFB', // Gray 50
    textSecondary: '#9CA3AF', // Gray 400
    background: '#111827', // Gray 900
    backgroundLight: '#1F2937', // Gray 800
    borderColor: '#374151', // Gray 700
  };

  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  const Styles = createGlobalStyle`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; // Changed font to Inter
      line-height: 1.6;
      color: ${currentTheme.textPrimary};
      background-color: ${currentTheme.background};
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    // Custom scrollbar for a more refined look
    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: ${currentTheme.backgroundLight};
    }

    ::-webkit-scrollbar-thumb {
      background: ${currentTheme.primaryColor};
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: ${currentTheme.secondaryColor};
    }
  `;

  return <Styles />;
};

export default GlobalStyles;
