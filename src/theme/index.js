import { createMuiTheme } from "@material-ui/core/styles";

export const cssVariables = {
    colorTheme: "#fff",
    secondaryTheme: "#123f95"
};

export const theme = createMuiTheme({
    palette: {
        primary: {
            500: "#fff",
        },
        secondary: {
            main: "#123f95",
        },
    },
    typography: {
    },
});

theme.overrides = {
    MuiButton: {
        root: {
            textTransform: "none",
            margin: "0 10px",
        }
    },
    MuiTooltip: {
        tooltip: {
            fontSize: "12px",
            color: "white",
            backgroundColor: "black"
        }
    }
};