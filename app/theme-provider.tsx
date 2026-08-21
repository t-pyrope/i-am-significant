"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import type { PropsWithChildren } from "react";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#d6a361",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#070809",
      paper: "#070809",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#FFFFFF",
    },
  },
  typography: {
    h1: {
      color: "#CEB687",
    },
    h2: {
      color: "#CEB687",
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        h1: {
          color: "#CEB687",
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: "none",
          fontSize: "1rem",
        },
        contained: {
          color: "#000",
        },
      },
      variants: [
        {
          props: { variant: "outlined", color: "primary" },
          style: {
            color: "#F4D8AF",
            // borderColor: "#E9C995",
            backgroundColor: "rgba(244, 216, 175, 0.12)",
            "@media (hover: hover)": {
              "&:hover": {
                // borderColor: "#F4D8AF",
                backgroundColor: "rgba(244, 216, 175, 0.16)",
              },
            },
          },
        },
      ],
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#FFFFFF",
          "&.Mui-focused": {
            color: "#FFFFFF",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: "#FFFFFF",
        },
        input: {
          "&::placeholder": {
            color: "#FFFFFF",
            opacity: 0.75,
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: "#FFFFFF",
        },
      },
    },
  },
});

export default function AppThemeProvider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
