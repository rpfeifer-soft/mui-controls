import * as React from "react";
import { Button, createMuiTheme, CssBaseline, StylesProvider, ThemeProvider, useMediaQuery } from "@material-ui/core";
import { absolute } from "../styles";
import { css } from "@emotion/css";

interface ThemeProps {
   children: React.ReactNode;
}

const Theme = (props: ThemeProps) => {
   const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
   const [darkMode, setDarkMode] = React.useState(localStorage.getItem("dark") === "true");

   React.useEffect(() => {
      if (localStorage.getItem("dark") === null) {
         setDarkMode(prefersDarkMode);
      }
   }, [prefersDarkMode]);

   // Props
   const { children } = props;

   const paletteType = darkMode ? "dark" : "light";
   const theme = React.useMemo(
      () =>
         createMuiTheme({
            palette: {
               mode: paletteType,
               primary: {
                  main: "#90caf9",
               },
               secondary: {
                  main: "#f48fb1",
               },
            },
         }),
      [paletteType]
   );

   const gotoHome = () => {
      window.location.hash = "";
      window.location.reload();
   };
   const toggleDark = () => {
      setDarkMode(!darkMode);
      localStorage.setItem("dark", darkMode ? "false" : "true");
   };
   return (
      <StylesProvider injectFirst>
         <ThemeProvider theme={theme}>
            <CssBaseline />
            <Button variant="outlined" className={css(absolute, { margin: 2 })} onClick={gotoHome}>
               Home
            </Button>
            <Button
               variant="outlined"
               className={css(absolute, { margin: 2, left: "auto", right: 0 })}
               onClick={toggleDark}
            >
               {!darkMode ? "Dark" : "Light"}
            </Button>
            {children}
         </ThemeProvider>
      </StylesProvider>
   );
};

export default Theme;
