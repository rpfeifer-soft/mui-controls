/** @format */

import React, { useEffect } from 'react';
import './App.css';
import { observer } from 'mobx-react';
import { Button, createMuiTheme, CssBaseline, ThemeProvider, useMediaQuery } from '@material-ui/core';
import AutoCompleteTest from './package/autocomplete/test';
import AuthCodeTest from './package/authcode/test';
import AlertTest from './package/alert/test';
import DateTimeFieldTest from './package/date/test';

interface ThemeProps {

}

const Theme = observer(({ children }: React.PropsWithChildren<ThemeProps>) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = React.useState(localStorage.getItem('dark') === 'true');
  useEffect(() => {
    if (localStorage.getItem('dark') === null) {
      setDarkMode(prefersDarkMode)
    }
  }, [prefersDarkMode]);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: paletteType,
          primary: {
            main: '#90caf9'
          },
          secondary: {
            main: '#f48fb1'
          }
        }
      }),
    [paletteType]
  );
  const toggleDark = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('dark', darkMode ? 'false' : 'true');
  }
  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <CssBaseline />
        <div style={{ border: '1px solid #888', padding: 8 }}>
          <Button
            onClick={() => toggleDark()}
            style={{
              position: 'absolute',
              right: 0,
              top: 0
            }}
          >{darkMode ? 'Dark' : 'Light'}
          </Button>
          {children}
        </div>
      </React.Fragment>
    </ThemeProvider>
  )
});

function App() {
  const hash = window.location.hash;
  const goto = (hash: string) => {
    window.location.hash = hash;
    window.location.reload();
  }
  return (
    <Theme>
      {hash !== '#autocomplete' || <AutoCompleteTest />}
      {hash !== '#authcode' || <AuthCodeTest />}
      {hash !== '#alert' || <AlertTest />}
      {hash !== '#datetime' || <DateTimeFieldTest />}
      {!hash ? (
        <React.Fragment>
          <Button onClick={() => goto('#autocomplete')}>Autocomplete</Button>
          <Button onClick={() => goto('#authcode')}>AuthCode</Button>
          <Button onClick={() => goto('#alert')}>Alert</Button>
          <Button onClick={() => goto('#datetime')}>DateTime</Button>
        </React.Fragment>
      ) : (
          <Button onClick={() => goto('')} style={{ position: 'absolute', top: 8, left: 8 }}> &lt; Back</Button>
        )}
    </Theme>
  );
}

export default App;
