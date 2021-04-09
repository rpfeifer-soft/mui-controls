import * as React from "react";
import * as Mui from "@material-ui/core";
import Theme from "./Theme";
import { useChoice, useSwitch } from "../hooks";
import { TestAlert, TestAuthCode, TestDate, TestSelect, TestText } from "../tests";
import OptionGroup from "./OptionGroup";
import TestAddress from "../tests/TestAddress";

const choices = ["Address", "Alert", "AuthCode", "DateTime", "Select", "Text"] as const;

interface AppProps {}

const App = (props: AppProps) => {
   const [type, Type] = useChoice("Type", choices, window.location.hash.substr(1));
   const [dialog, Dialog] = useSwitch("Dialog");

   React.useEffect(() => {
      window.location.hash = type ? type : "";
   }, [type]);

   const test = type && (
      <React.Fragment>
         {!dialog && <hr />}
         <Mui.Paper elevation={5} sx={{ padding: 2 }}>
            {type === "Address" && <TestAddress />}
            {type === "Alert" && <TestAlert />}
            {type === "AuthCode" && <TestAuthCode />}
            {type === "Select" && <TestSelect />}
            {type === "Text" && <TestText />}
            {type === "DateTime" && <TestDate />}
         </Mui.Paper>
      </React.Fragment>
   );

   return (
      <Theme>
         <Mui.Box
            sx={{
               padding: 2,
               marginTop: 5,
               borderTop: "1px solid rgba(128,128,128,0.3)",
            }}
         >
            <Type />
            <OptionGroup title="Options">
               <Dialog />
            </OptionGroup>
            {dialog ? (
               <Mui.Dialog open>
                  <Mui.DialogTitle>Dialog</Mui.DialogTitle>
                  <Mui.DialogContent>{test}</Mui.DialogContent>
                  <Mui.DialogActions>
                     <Dialog />
                  </Mui.DialogActions>
               </Mui.Dialog>
            ) : (
               test
            )}
         </Mui.Box>
      </Theme>
   );
};

export default App;
