module.exports = {
  theme: {
    extend: {
      colors: {
        metrobnb: {
          50: '#fef7f4',
          100: '#fdeee8', 
          200: '#fad9cc',
          300: '#f6bfa5',
          400: '#f09b78',
          500: '#e87750',
          600: '#d84d2a', // Primary brand color
          700: '#b43f24', // Hover accent  
          800: '#943426',
          900: '#7a2e23',
          950: '#421509'
        },
        brand: {
          bg: '#f4f2ee',      // Light background
          'bg-dark': '#121212', // Dark background
          'card-dark': '#1e1e1e', // Dark cards
          text: '#333333',     // Primary text light
          'text-secondary': '#555555', // Secondary text light
          'text-dark': '#ffffff', // Primary text dark
          'text-secondary-dark': '#b3b3b3', // Secondary text dark
          border: '#e6e3df',   // Light borders
          'border-dark': '#2e2e2e' // Dark borders
        }
      }
    }
  }
}