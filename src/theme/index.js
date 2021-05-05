import { createMuiTheme } from "@material-ui/core/styles";

export const cssVariables = {
    colorTheme: "#2b3e4d",
};

export const theme = createMuiTheme({
    palette: {
        primary: {
            500: "#2b3e4d",
        },
        secondary: {
            main: "#edf1f6",
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