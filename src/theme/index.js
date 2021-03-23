import { createMuiTheme } from "@material-ui/core/styles";

export const cssVariables = {
    colorTheme: "#293B4E",
};

export const theme = createMuiTheme({
    palette: {
        primary: {
            500: "#293B4E",
        },
        secondary: {
            main: "#fffff",
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
    }
};