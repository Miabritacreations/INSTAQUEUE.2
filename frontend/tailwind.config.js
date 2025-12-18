import tailwindcss from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#192C57',
          dark: '#0d1629',
          light: '#2a3d6e',
        },
        accent: {
          DEFAULT: '#CBAE2D',
          light: '#d4bc4a',
          lighter: '#e0ca6f',
        },
        bg: {
          light: '#FFFDD0',
          white: '#ffffff',
          gray: '#f8f9fa',
          darker: '#e9ecef',
        },
        text: {
          primary: '#192C57',
          secondary: '#666666',
          light: '#999999',
          white: '#ffffff',
          muted: '#c0c0c0',
        },
        status: {
          pending: '#ffc107',
          'in-service': '#17a2b8',
          completed: '#28a745',
          cancelled: '#dc3545',
        },
        border: '#e9ecef',
        'border-light': '#f0f0f0',
      },
      fontFamily: {
        serif: ['PT Serif', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", "'Roboto'", "'Oxygen'",
          "'Ubuntu'", "'Cantarell'", "'Fira Sans'", "'Droid Sans'", "'Helvetica Neue'", 'sans-serif'],
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      boxShadow: {
        sm: '0 2px 8px rgba(0, 0, 0, 0.1)',
        md: '0 4px 12px rgba(0, 0, 0, 0.08)',
        lg: '0 8px 25px rgba(0, 0, 0, 0.1)',
        xl: '0 12px 30px rgba(203, 174, 45, 0.15)',
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      transitionDuration: {
        fast: '200ms',
        normal: '300ms',
        slow: '500ms',
      },
    },
  },
  plugins: [],
};
