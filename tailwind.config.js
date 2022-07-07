/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  safelist: [
    {
      pattern: /(border|bg|text)-(accent-primary|success|warning|error|danger)/,
    }
  ],
  theme: {
    fontFamily: {
      sans: ['Dm Sans'],
    },
    extend: {
      boxShadow: {
        primary: '0 2px 12px 0 rgba(7, 6, 6, 0.1)',
        light: '0 2px 12px 0 rgba(7, 6, 6, 0.05)',
      },
      colors: {
        accent: {
          primary: 'var(--accent-primary)',
          success: 'var(--success)',
          error: 'var(--error)',
          danger: 'var(--danger)',
        },

        gray: {
          primary: 'var(--gray-primary)',
          secondary: 'var(--gray-secondary)',
          tertiary: 'var(--gray-tertiary)',
          quaternary: 'var(--gray-quaternary)',
        }
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        tertiary: 'var(--text-tertiary)',

        input: 'var(--text-input)',
        'input-disabled': 'var(--text-input-disabled)',
        'input-placeholder': 'var(--text-input-placeholder)',
      },
      backgroundColor: {
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
        tertiary: 'var(--bg-tertiary)',

        input: 'var(--bg-input)',
        'input-disabled': 'var(--bg-input-disabled)',

        switch: 'var(--bg-switch)',
      },
      borderColor: {
        primary: 'var(--border-primary)',
        secondary: 'var(--border-secondary)',
        tertiary: 'var(--border-tertiary)',

        input: 'var(--border-input)',
      },
    },
  },
}
