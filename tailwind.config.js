const withMT = require("@material-tailwind/react/utils/withMT");

const colors = require('tailwindcss/colors')

const path = [
  // "./*.{html,js,ts,jsx,tsx}",
  "./index.{html,js,ts,jsx,tsx}",
  // "./src/*.{html,js,ts,jsx,tsx}",
  // "./src/**/*.{html,js,ts,jsx,tsx}",
  // "./src/**/**/*.{html,js,ts,jsx,tsx}",
  // "./src/**/**/**/*.{html,js,ts,jsx,tsx}",
  "./src/App.{html,js,ts,jsx,tsx}",
  "./src/main.{html,js,ts,jsx,tsx}",
  "./src/components/*.{html,js,ts,jsx,tsx}",
  "./src/components/**/*.{html,js,ts,jsx,tsx}",
  "./src/pages/*.{html,js,ts,jsx,tsx}",
  "./src/pages/**/*.{html,js,ts,jsx,tsx}",
]

const color = {
  ...colors,
  DEFAULT: '#2196f3',
  'blue-gray': { ...colors.slate, DEFAULT: colors.slate['500'] },
  'blue-grey': { ...colors.slate, DEFAULT: colors.slate['500'] },
  'gray': { ...colors.gray, DEFAULT: colors.gray['500'] },
  'grey': { ...colors.gray, DEFAULT: colors.gray['500'] },
  'brown': '#795548',
  'deep-orange': '#ff5722',
  'orange': '#ff9800',
  'amber': { ...colors.amber, DEFAULT: colors.amber['500'] },
  'yellow': { ...colors.yellow, DEFAULT: colors.yellow['500'] },
  'lime': { ...colors.lime, DEFAULT: colors.lime['500'] },
  'light-green': '#8bc34a',
  'green': { ...colors.green, DEFAULT: colors.green['500'] },
  'teal': { ...colors.teal, DEFAULT: colors.teal['500'] },
  'cyan': { ...colors.cyan, DEFAULT: colors.cyan['500'] },
  'light-blue': { ...colors.sky, DEFAULT: colors.sky['500'] },
  'blue': { ...colors.blue, DEFAULT: colors.blue['500'] },
  'indigo': { ...colors.indigo, DEFAULT: colors.indigo['500'] },
  'deep-purple': '#673ab7',
  'purple': { ...colors.purple, DEFAULT: colors.purple['500'] },
  'pink': { ...colors.pink, DEFAULT: colors.pink['500'] },
  'red': { ...colors.red, DEFAULT: colors.red['500'] },
  'primaryMain': '#e3b980'
}

module.exports = withMT({
  // important: true,
  // purge: path,
  content: path,
  theme: {
    fontFamily: {
      sans: ["Kanit", "sans-serif"],
      serif: ["Kanit", "sans-serif"],
      body: ["Kanit", "sans-serif"],
    },
    colors: {
      ...color,
      DEFAULT: '#2196f3',
      primary: color,
      'successCustom': '#4BB04F',
      'waringCustom': '#FFC007',
      'errorCustom': '#F44336',
      'infoCustom': '#2197F3',
      bgHeder: "#34495e",
      bgDark: "#013468",
      bgPage: "#f5f4f4",
      bgCover: "#f3f4f6",
    },
    screens: {
      'sm': '480px',
      'ls': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      'mobile': { 'max': '767px' },
      'tablet': { 'min': '768px', 'max': '1023px' },
      'laptop': { 'min': '1024px', 'max': '1279px' },
      'desktop': { 'min': '1280px', 'max': '1991px' },
      'extra': { 'min': '1920px' },
    },
    opacity: {
      '0': '0',
      '10': '0.1',
      '20': '0.2',
      '30': '0.3',
      '40': '0.4',
      '50': '0.5',
      '60': '0.6',
      '70': '0.7',
      '80': '0.8',
      '90': '0.9',
      '100': '1',
    },
    minWidth: {
      '1/2': '50%',
    },
    maxWidth: {
      '1/2': '50%',
    },
    extend: {
      boxShadow: {
        'buttonCookie': '0px 2px 4px rgba(0, 0, 0, 0.25)',
        'card': '-4px 4px 18px -9px rgba(107, 99, 99, 0.75)',
      },
      dropShadow: {
        'icon': '0 0 20px #ffffff',
        'text': '1px 1px 1px #ffffff',
      },
      scale: {
        '70': '0.7',
        '75': '0.75',
        '80': '0.8',
        '85': '0.85',
        '90': '0.9',
        '95': '0.95',
        '100': '1',
        '105': '1.5',
        '110': '1.1',
        '115': '1.15',
        '120': '1.2',
        '125': '1.25',
        '130': '1.3',
        '135': '1.35',
        '14': '1.4',
        '145': '1.45',
        '150': '1.5',
      },
      spacing: {
        px: '1px',
        'selectItemCard': '50px',
        0: '0',
        0.5: '0.125rem',
        1: '0.25rem',
        1.5: '0.375rem',
        2: '0.5rem',
        2.5: '0.625rem',
        3: '0.75rem',
        3.5: '0.875rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
        11: '2.75rem',
        12: '3rem',
        14: '3.5rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        28: '7rem',
        32: '8rem',
        36: '9rem',
        40: '10rem',
        44: '11rem',
        48: '12rem',
        52: '13rem',
        56: '14rem',
        60: '15rem',
        64: '16rem',
        72: '18rem',
        80: '20rem',
        96: '24rem',
      },
      borderRadius: {
        'none': '0',
        DEFAULT: '.25rem',
        'sm': '.125rem',
        'lg': '.5rem',
        'full': '9999px',
        card: '10px',
        cardSM: '5px',
        circle: '50%',
      },
      zIndex: {
        '9000': '9000',
        '8000': '8000',
        '7000': '7000',
        '6000': '6000',
        '5000': '5000',
        '4000': '4000',
        '3000': '3000',
        '2000': '2000',
        '1000': '1000',
        '900': '900',
        '800': '800',
        '700': '700',
        '600': '600',
        '500': '500',
        '400': '400',
        '300': '300',
        '200': '200',
        '100': '100',
        '90': '90',
        '80': '80',
        '70': '70',
        '60': '60',
        '50': '50',
        '40': '40',
        '30': '30',
        '20': '20',
        '10': '10',
        '90': '9',
        '80': '8',
        '70': '7',
        '60': '6',
        '50': '5',
        '40': '4',
        '30': '3',
        '20': '2',
        '10': '1',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
});