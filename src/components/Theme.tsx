import * as React from "react";
import * as Mui from "@material-ui/core";
import { absolute } from "../styles";
import { css } from "@emotion/css";

interface ThemeProps {
   children: React.ReactNode;
}

const Theme = (props: ThemeProps) => {
   const prefersDarkMode = Mui.useMediaQuery("(prefers-color-scheme: dark)");
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
         Mui.createMuiTheme({
            palette: {
               mode: paletteType,
               primary: {
                  main: darkMode ? "#90caf9" : "#2d0476",
               },
               secondary: {
                  main: darkMode ? "#f48fb1" : "#197e81",
               },
            },
         }),
      [darkMode, paletteType]
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
      <Mui.StylesProvider injectFirst>
         <Mui.ThemeProvider theme={theme}>
            <Mui.CssBaseline />
            <Mui.Button variant="outlined" className={css(absolute, { margin: 2 })} onClick={gotoHome}>
               Home
            </Mui.Button>
            <Mui.Button
               variant="outlined"
               className={css(absolute, { margin: 2, left: "auto", right: 0 })}
               onClick={toggleDark}
            >
               {!darkMode ? "Dark" : "Light"}
            </Mui.Button>
            {children}
         </Mui.ThemeProvider>
      </Mui.StylesProvider>
   );
};

export default Theme;
