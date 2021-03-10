import React from "react";
import Theme from "./Theme";
import { Box, Paper } from "@material-ui/core";
import AuthCodeTest from "../package/authcode/test";
import { useChoice } from "../hooks";
import { TestAlert } from "../tests";

const choices = ["Alert", "AuthCode", "AutoComplete", "DateTime"] as const;

interface AppProps {}

const App = (props: AppProps) => {
   const [type, Type] = useChoice("Type", choices, window.location.hash.substr(1));

   React.useEffect(() => {
      window.location.hash = type ? type : "";
   }, [type]);

   return (
      <Theme>
         <Box
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
                  <Paper sx={{ padding: 2 }}>
                     {type === "Alert" && <TestAlert />}
                     {type === "AuthCode" && <AuthCodeTest />}
                     {type === "AutoComplete" && "3."}
                     {type === "DateTime" && "4."}
                  </Paper>
               </React.Fragment>
            )}
         </Box>
      </Theme>
   );
};

export default App;
