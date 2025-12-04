module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      animation: {
        'fall': 'fall linear infinite',
      },
      keyframes: {
        fall: {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '0.7' },
          '100%': { transform: 'translateY(110vh) rotate(360deg)', opacity: '0' }
        }
      }
    },
  },
  plugins: [],
}