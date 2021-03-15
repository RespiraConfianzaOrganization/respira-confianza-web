import { createMuiTheme } from "@material-ui/core/styles";

export const cssVariables = {
    colorTheme: "#267EBF",
};

export const theme = createMuiTheme({
    palette: {
        primary: {
            500: "#267EBF",
        },
        secondary: {
            main: "#909497",
        },
    },
    typography: {
        fontFamily: "MyriadPro-Regular !important",
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