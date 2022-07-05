export const constants = {
  ICON_OPTIONS: {
    RED: {
      colour: 'var(--ish-red)',
      size: '24px',
      background: {
        shape: 'CIRCLE',
        colour: 'transparent',
        size: '32px',
        borderRadius: '16px'
      },
      hover: {
        backgroundColour: 'transparent',
        colour: 'var(--ish-red)'
      }
    },
    BLUE: {
      colour: 'white',
      size: '24px',
      background: {
        shape: 'CIRCLE',
        colour: 'var(--ish-blue)',
        size: '32px',
        borderRadius: '16px'
      },
      hover: {
        backgroundColour: 'white',
        colour: 'var(--ish-blue)'
      }
    },

    BLUE_TRANSPARENT: {
      colour: 'var(--ish-lightblue)',
      size: '24px',
      background: {
        shape: 'CIRCLE',
        colour: 'transparent',
        size: '32px',
        borderRadius: '16px'
      },
      hover: {
        // backgroundColour: "var(--ish-bluehover)",
        colour: 'white'
      },
      menu: null
    },

    ON_WHITE_ACTIONABLE: {
      isClickable: true,
      colour: 'var(--ish-darkgrey)',
      size: '24px',
      background: {
        shape: 'CIRCLEE',
        colour: 'transparent',
        size: '32px',
        borderRadius: '16px'
      },
      hover: {
        backgroundColour: 'var(--ish-lightgrey)',
        colour: 'black'
      }
    },
    ON_WHITE: {
      isClickable: false,
      colour: 'var(--ish-darkgrey)',
      size: '24px',
      background: {
        shape: 'CIRCLEE',
        colour: 'transparent',
        size: '32px',
        borderRadius: '16px'
      }
    },

    ON_DARK: {
      colour: 'white',
      size: '24px',
      background: {
        shape: 'CIRCLE',
        colour: 'transparent',
        size: '32px',
        borderRadius: '16px'
      },
      hover: {
        backgroundColour: 'var(--ish-bluehover)',
        colour: 'white'
      },
      menu: null
    }
  },
  COLOURS: {
    BLUE: '#004aad',
    LIGHTBLUE: '#5263FA',
    ORANGE: '#ff914d',
    GREEN: '#6aa84f',
    BUTTON_TEXT_DEFAULT: 'rgb(95, 99, 104)',
    BUTTON_TEXT_HOVER: 'rgb(0, 0, 0)'
  },

  ICONCOLOUR: {
    DARK: '',
    LIGHT: ''
  },

  ICONSIZE: {
    SMALL: 18,
    MEDIUM: 24,
    LARGE: 36,
    HUGE: 48
  }
}
