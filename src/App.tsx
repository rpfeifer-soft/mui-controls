import React from "react";
import Theme from "./Theme";
import Choice from "./Choice";
import { Box, Paper } from "@material-ui/core";

const choices = ["Alert", "AuthCode", "AutoComplete", "DateTime"] as const;

interface AppProps {}

const App = (props: AppProps) => {
   const [type, Type] = Choice.useChoice(choices, window.location.hash.substr(1));

   React.useEffect(() => {
      window.location.hash = type ? type : "";
   }, [type]);

   return (
      <Theme>
         <Box
            sx={{
               padding: 2,
               marginTop: 5,
               borderTop: "1px solid #888",
            }}
         >
            <Type />
            <hr />
            <Paper sx={{ padding: 2 }}>
               {type === "Alert" && "1."}
               {type === "AuthCode" && "2."}
               {type === "AutoComplete" && "3."}
               {type === "DateTime" && "4."}
            </Paper>
         </Box>
      </Theme>
   );
};

export default App;
