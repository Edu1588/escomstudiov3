
      tailwind.config = {
          theme: {
              extend: {
                  fontFamily: {
                      geist: ['Geist', 'sans-serif'],
                      inter: ['Inter', 'sans-serif'],
                  },
                  colors: {
                      zinc: {
                          900: '#18181b',
                          950: '#09090b',
                      },
                      lime: {
                          400: '#00ff41',
                          500: '#00cc34',
                      }
                  },
                  transitionTimingFunction: {
                      'expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
                  }
              }
          }
      }
    