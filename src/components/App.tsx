import * as React from "react";
import * as Mui from "@material-ui/core";
import Theme from "./Theme";
import { useChoice, useSwitch } from "../hooks";
import {
   TestAddress,
   TestAddressHook,
   TestAlert,
   TestAuthCode,
   TestAuthCodeHook,
   TestDate,
   TestDateHook,
   TestNumber,
   TestNumberHook,
   TestSelect,
   TestSelectHook,
   TestText,
   TestTextHook,
} from "../tests";
import OptionGroup from "./OptionGroup";

const choices = [
   "Address",
   "AddressHook",
   "AuthCode",
   "AuthCodeHook",
   "DateTime",
   "DateTimeHook",
   "Number",
   "NumberHook",
   "Select",
   "SelectHook",
   "Text",
   "TextHook",
   "Alert",
] as const;

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
            {type === "AddressHook" && <TestAddressHook />}
            {type === "Alert" && <TestAlert />}
            {type === "AuthCode" && <TestAuthCode />}
            {type === "AuthCodeHook" && <TestAuthCodeHook />}
            {type === "Number" && <TestNumber />}
            {type === "NumberHook" && <TestNumberHook />}
            {type === "Select" && <TestSelect />}
            {type === "SelectHook" && <TestSelectHook />}
            {type === "Text" && <TestText />}
            {type === "TextHook" && <TestTextHook />}
            {type === "DateTime" && <TestDate />}
            {type === "DateTimeHook" && <TestDateHook />}
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
            <Type include={(option) => !option.endsWith("Hook")} />
            <br />
            <Type
               include={(option) => option.endsWith("Hook")}
               text={(choice) => choice.substr(0, choice.length - 4)}
               title="Hooks"
            />
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
