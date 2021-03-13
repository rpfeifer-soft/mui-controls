import * as React from "react";
import * as Mui from "@material-ui/core";
import Theme from "./Theme";
import { useChoice } from "../hooks";
import { TestAlert, TestAuthCode, TestSelect } from "../tests";

const choices = ["Alert", "AuthCode", "Select", "DateTime"] as const;

interface AppProps {}

const App = (props: AppProps) => {
   const [type, Type] = useChoice("Type", choices, window.location.hash.substr(1));

   React.useEffect(() => {
      window.location.hash = type ? type : "";
   }, [type]);

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
            {type && (
               <React.Fragment>
                  <hr />
                  <Mui.Paper sx={{ padding: 2 }}>
                     {type === "Alert" && <TestAlert />}
                     {type === "AuthCode" && <TestAuthCode />}
                     {type === "Select" && <TestSelect />}
                     {type === "DateTime" && "4."}
                  </Mui.Paper>
               </React.Fragment>
            )}
         </Mui.Box>
      </Theme>
   );
};

export default App;
