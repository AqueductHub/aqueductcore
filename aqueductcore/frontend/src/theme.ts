import { PaletteColor } from "@mui/material";
// import { ThemeOptions } from "@mui/material/styles";

export type PaletteMode = "light" | "dark";

declare module "@mui/material/styles" {
  interface TypeBackground {
    main: string;
    card: string;
    sub: string;
  }
  interface TypeText {
    green: string;
    greenEmphasis: string;
    subtitle: string;
    white: string;
  }
  interface TypeBorder {
    focused: string;
    invert: string;
    light: string;
    primary: string;
    secondary: string;
  }
  interface TypeFill {
    miscChipDefault: string;
    miscOverlayBackground: string;
    miscAqueductLogo: string;
    miscTableHeader: string;
    primaryFillPrimary: string;
    primaryFillPrimaryDark1: string;
    primaryFillPrimaryDark2: string;
    primaryFillPrimaryLight: string;
    primaryFillPrimaryTransparent: string;
    primaryFillPrimaryTransparentLight: string;
    stateActive: string;
    stateHover: string;
    statePressed: string;
    surfaceCommon100: string;
    surfaceCommon50: string;
    surfaceCommonTransparent100: string;
    surfaceCommonTransparent50: string;
  }
  interface TypeNotification {
    alert: string;
  }
  interface Palette {
    disabled: PaletteColor;
    neutral: PaletteColor;
    border: TypeBorder;
    fill: TypeFill;
    notification: TypeNotification;
  }
}
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    neutral: true;
  }
}

interface Theme {
  getColorSchemeSelector: (scheme: "dark" | "light") => string;
}

const commonThemePaletteObject = {
  primary: {
    main: "#00968F",
    dark: "#006F62",
    light: "#53C7BF",
  },
  secondary: {
    main: "#FF9E4C",
    dark: "#C76F1C",
    light: "#FFCF7B",
  },
};

export const cssVariableTheme = {
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          "&.Mui-selected": {
            backgroundColor: "#00968F",
            color: "white",
            [theme.getColorSchemeSelector("dark")]: {
              backgroundColor: "#00968F",
            },
            "& > .MuiListItemIcon-root": {
              color: "white",
            },
            "&.Mui-selected:hover, &.Mui-selected:focus-visible": {
              backgroundColor: "#028b84",
              [theme.getColorSchemeSelector("dark")]: {
                backgroundColor: "#00968fcf",
              },
            },
          },
        }),
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardWarning: ({ theme }: { theme: Theme }) => ({
          background: "#FFEEC4",
          borderRadius: "8px",
          [theme.getColorSchemeSelector("dark")]: {
            color: "black",
          },
        }),
        icon: () => ({
          color: "red",
          alignItems: "center",
          fontSize: "2rem",
        }),
      },
    },
  },
  colorSchemes: {
    light: {
      palette: {
        ...commonThemePaletteObject,
        mode: "light" as PaletteMode,
        disabled: {
          main: "#DBDBDB",
        },
        background: {
          main: "var(--color-grey-0, #FFFFFF)",
          sub: "var(--color-grey-100, #EEEEEE)",
          default: "#FFFFFF",
          paper: "#F5F5F5",
          card: "#F7F6F6",
        },
        text: {
          disabled: "var(--color-grey-400, #AFAFAF)",
          green: "var(--color-primary-main-600, #00968F)",
          greenEmphasis: "var(--color-primary-dark-800, #005A56)",
          primary: "#202020",
          subtitle: "var(--color-grey-600, #7F7F7F)",
          white: "var(--color-grey-50, #F8F8F8)",
        },
        error: {
          main: "#DC4405",
          light: "#FFD2D2",
        },
        success: {
          main: "#3BBE49",
          light: "#D1F8D9",
        },
        neutral: {
          main: "#E0E0E0",
          contrastText: "#000",
        },
        border: {
          focus: "var(--color-primary-main-600, #00968F)",
          invert: "var(--color-grey-50, #F8F8F8)",
          light: "var(--color-grey-200, #D3D3D3)",
          primary: "var(--color-grey-900, #202020)",
          secondary: "var(--color-grey-600, #7F7F7F)",
        },
        fill: {
          miscChipDefault: "var(--color-grey-800, #343434)",
          miscOverlayBackground: "var(--color-transparent-black-50, #00000080)",
          miscAqueductLogo: "var(--color-logo-invert, #FFFFFE)",
          miscTableHeader: "var(--color-grey-900, #202020)",
          primaryFillPrimary: "var(--color-primary-main-600, #00968F)",
          primaryFillPrimaryDark1: "var(--color-primary-dark-700, #006F62)",
          primaryFillPrimaryDark2: "var(--color-primary-dark-800, #005A56)",
          primaryFillPrimaryLight: "var(--color-primary-light-400, #53C7BF)",
          primaryFillPrimaryTransparent: "var(--color-transparent-primary-10, #00968f1a)",
          primaryFillPrimaryTransparentLight: "var(--color-transparent-primary-5, #00968f0d)",
          stateActive: "var(--color-transparent-white-8, #ffffff14)",
          stateHover: "var(--color-transparent-white-5, #ffffff0d)",
          statePressed: "var(--color-transparent-white-10, #ffffff1a)",
          surfaceCommon100: "var(--color-grey-50, #F8F8F8)",
          surfaceCommon50: "var(--color-grey-100, #EEEEEE)",
          surfaceCommonTransparent100: "var(--color-transparent-white-8, #ffffff14)",
          surfaceCommonTransparent50: "var(--color-transparent-white-5, #ffffff0d)",
        },
        notification: {
          alert: "var(--color-others-red, #D13438)",
        },
      },
    },
    dark: {
      palette: {
        ...commonThemePaletteObject,
        mode: "dark" as PaletteMode,
        disabled: {
          main: "#747474",
        },
        background: {
          main: "var(--color-grey-1000, #191919)",
          sub: "var(--color-grey-900, #202020)",
          default: "#2d2d2d",
          paper: "#000000",
          card: "#2f2e2e",
        },
        text: {
          disabled: "var(--color-grey-700, #4D4D4D)",
          green: "var(--color-primary-main-600, #00968F)",
          greenEmphasis: "var(--color-primary-light-400, #53C7BF)",
          primary: "#F8F8F8",
          subtitle: "var(--color-grey-400, #AFAFAF)",
          white: "var(--color-grey-50, #F8F8F8)",
        },
        error: {
          main: "#F44336",
          light: "#E57373",
        },
        success: {
          main: "#66bb6a",
          light: "#184C1D",
        },
        neutral: {
          main: "#545454",
          contrastText: "#fff",
        },
        border: {
          focus: "var(--color-primary-light-400, #53C7BF)",
          invert: "var(--color-grey-900, #202020)",
          light: "var(--color-grey-700, #4D4D4D)",
          primary: "var(--color-grey-50, #F8F8F8)",
          secondary: "var(--color-grey-400, #AFAFAF)",
        },
        fill: {
          miscChipDefault: "var(--color-grey-100, #EEEEEE)",
          miscOverlayBackground: "var(--color-transparent-black-50, #00000080)",
          miscAqueductLogo: "var(--color-logo-dark-green, #20352D)",
          miscTableHeader: "var(--color-grey-50, #F8F8F8)",
          primaryFillPrimary: "var(--color-primary-main-600, #00968F)",
          primaryFillPrimaryDark1: "var(--color-primary-dark-700, #006F62)",
          primaryFillPrimaryDark2: "var(--color-primary-dark-800, #005A56)",
          primaryFillPrimaryLight: "var(--color-primary-light-400, #53C7BF)",
          primaryFillPrimaryTransparent: "var(--color-transparent-primary-10, #00968f1a)",
          primaryFillPrimaryTransparentLight: "var(--color-transparent-primary-5, #00968f0d)",
          stateActive: "var(--color-transparent-black-8, #00000014)",
          stateHover: "var(--color-transparent-black-5, #0000000d)",
          statePressed: "var(--color-transparent-black-10, #0000001a)",
          surfaceCommon100: "var(--color-grey-100, #EEEEEE)",
          surfaceCommon50: "var(--color-grey-50, #F8F8F8)",
          surfaceCommonTransparent100: "var(--color-transparent-black-8, #00000014)",
          surfaceCommonTransparent50: "var(--color-transparent-black-5, #0000000d)",
        },
        notification: {
          alert: "var(--color-others-red, #D13438)",
        },
      },
    },
  },
};
