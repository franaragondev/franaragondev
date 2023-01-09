module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // that is animation class
      animation: {
        fadeOut: "fadeOut 3s ease-in-out",
        fadeIn: "fadeIn 2.9s ease-in-out",
        fadeIn2: "fadeIn2 .5s ease-in-out",
        fadeOutFast: "fadeOut .5s ease-in-out",
        fadeOut2Fast: "fadeOut2 .5s ease-in-out",
        fadeInFast: "fadeIn .5s ease-in-out",
        "fade-in-left": "fade-in-left 0.6s ease-out",
        "fade-in-down": "fade-in-down 0.6s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        'spin-slow': 'spin 3s ease-in-out 1'
      },
      keyframes: () => ({
        fadeOut: {
          "0%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
            display: "none",
          },
        },
        fadeOut2: {
          "0%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0.7",
            display: "none",
          },
        },
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        fadeIn2: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: ".5",
          },
        },
        "fade-in-left": {
          "0%": {
            opacity: "0",
            transform: "translateX(100%)"
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)"
          }
        },
        "fade-in-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-100%)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(0)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(-100%)"
          }
        },
      }),
      colors: {
        'background': 'rgba(0, 0, 0, 0.5);',
        'backgroundSkills': 'rgba(36, 36, 36, 98)',
        'background-primary-grey': '#E8E8E8'
      },
      height: {
        '110': '32rem',
      },
      width: {
        '11.5/12': '90%',
      },
      margin: {
        '26': '100px',
      }
    },
    fontFamily: {
      montserrat: ["Montserrat"],
    },
  },
  plugins: [],
};
