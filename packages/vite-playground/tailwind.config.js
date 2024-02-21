module.exports = {
  content: ['./index.html', './src/**/*.tsx', '../base/src/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        'black-85': 'rgba(0,0,0,0.85)',
        'black-65': 'rgba(0,0,0,0.65)',
        'black-45': 'rgba(0,0,0,0.45)',
        'black-25': 'rgba(0,0,0,0.25)',
        'white-75': 'rgba(255,255,255,0.75)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
