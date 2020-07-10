module.exports = {
  // https://www.meidev.co/blog/visual-studio-code-css-linting-with-tailwind/
  // https://stackoverflow.com/questions/47607602/how-to-add-a-tailwind-css-rule-to-css-checker

  theme: {
    extend: {
      spacing: {
        "14": "3.5rem",
        "72": "18rem",
        "80": "20rem",
        "128": "32rem"
      },
      padding: {
        "5/6": "83.3333333%"
      }
    },
    customForms: theme => ({
      // https://tailwindcss-custom-forms.netlify.com/
      dark: {
        'input, textarea, multiselect, checkbox, radio': {
          backgroundColor: theme('colors.gray.400'),
          '&:focus': {
            backgroundColor: theme('colors.white'),
          }
        },
        select: {
          backgroundColor: theme('colors.gray.500'),
        },
      },
      sm: {
        'input, textarea, multiselect, select': {
          //fontSize: theme('fontSize.sm'),
          padding: `${theme('spacing.1')} ${theme('spacing.2')}`,
        },
        select: {
          paddingRight: `${theme('spacing.4')}`,
        },
        'checkbox, radio': {
          width: theme('spacing.3'),
          height: theme('spacing.3'),
        },
      }


      // // horizontalPadding: defaultTheme.spacing[3],
      // // verticalPadding: defaultTheme.spacing[2],
      // lineHeight: theme("lineHeight.snug"),
      // // fontSize: defaultTheme.fontSize.base,
      // borderColor: "transparent",
      // // borderWidth: defaultTheme.borderWidth.default,
      // borderRadius: theme("borderRadius.lg"),
      // backgroundColor: theme("colors.gray.700"),
      // focusBorderColor: "transparent",
      // focusShadow: "none",
      // // boxShadow: defaultTheme.boxShadow.none,
      // // checkboxSize: "1.5em",
      // // radioSize: "1.5em",
      // // checkboxIcon: `<svg viewBox="0 0 16 16" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path d="M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z"/></svg>`,
      // // radioIcon: `<svg viewBox="0 0 16 16" fill="#fff" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="3"/></svg>`,
      // checkedColor: theme("colors.indigo.500"),
      // selectIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff"><path d="M15.3 9.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.4l3.3 3.29 3.3-3.3z"/></svg>`
      // // selectIconOffset: defaultTheme.spacing[2],
      // // selectIconSize: '1.5em',
    })
  },
  variants: {
    tableLayout: ['responsive', 'hover', 'focus'],
  },
  plugins: [
    // require("tailwindcss-tables")({
    //   cellPadding: '.75rem',                            // default: .75rem
    //   tableBorderColor: '#dee2e6',                      // default: #dee2e6
    //   tableStripedBackgroundColor: 'rgba(0,0,0,.05)',   // default: rgba(0,0,0,.05)
    //   tableHoverBackgroundColor: 'rgba(0,0,0,.075)',    // default: rgba(0,0,0,.075)
    //   tableBodyBorder: false,                           // default: true. If set to false, borders for the table body will be removed. Only works for normal tables (i.e. does not apply to .table-bordered)
    //   verticalAlign: 'top',                             // default: 'top'
    // }),
    require("@tailwindcss/custom-forms"),
  ],
  corePlugins: {
    placeholderColor: true,
  }
};
