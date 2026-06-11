/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sky: '#bfe9ff',
        skyDeep: '#8fd3f4',
        grass: '#7ec850',
        belt: '#c98a4b',
        beltDark: '#a86b34',
        ink: '#33414a',
        accent: '#ff8a3d',
        good: '#48c774',
        bad: '#ff5b5b',
      },
      fontFamily: {
        round: [
          'Hiragino Maru Gothic ProN',
          'Yu Gothic UI',
          'M PLUS Rounded 1c',
          'sans-serif',
        ],
      },
      backgroundImage: {
        // 空→芝生
        'sky-grass':
          'linear-gradient(#bfe9ff,#8fd3f4 55%,#7ec850 55%,#7ec850)',
        // ベルトのしま模様
        'belt-stripes':
          'repeating-linear-gradient(90deg,#c98a4b 0 38px,#a86b34 38px 44px)',
        // ミスラインの破線
        'miss-stripes':
          'repeating-linear-gradient(#ff5b5b 0 10px,transparent 10px 18px)',
      },
      boxShadow: {
        toy: '0 6px 0 rgba(0,0,0,.12)',
      },
      keyframes: {
        popIn: {
          '0%': { transform: 'translateX(-50%) scale(.5)' },
          '60%': { transform: 'translateX(-50%) scale(1.25)' },
          '100%': { transform: 'translateX(-50%) scale(1)' },
        },
        floatUp: {
          '0%': { transform: 'translate(-50%,-50%)', opacity: '1' },
          '100%': { transform: 'translate(-50%,-110px)', opacity: '0' },
        },
        flashGood: {
          '0%,100%': { backgroundColor: '#ffffff' },
          '40%': { backgroundColor: '#d6f5e0' },
        },
        flashBad: {
          '0%,100%': { backgroundColor: '#ffffff', transform: 'translateX(0)' },
          '20%,60%': { backgroundColor: '#ffdede' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },
      animation: {
        'pop-in': 'popIn .35s ease',
        'float-up': 'floatUp .8s ease-out forwards',
        'flash-good': 'flashGood .4s',
        'flash-bad': 'flashBad .4s',
      },
    },
  },
  plugins: [],
};
