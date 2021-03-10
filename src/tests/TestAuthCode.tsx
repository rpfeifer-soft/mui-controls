/** @format */

import { useState } from "react";
import { BoxProps, Box, Paper } from "@material-ui/core";
import { AuthCode } from "../package";
import { useActions } from "../hooks";
import InputRef from "../package/InputRef";

export interface TestAuthCodeProps extends BoxProps {}

const TestAuthCode = (props: TestAuthCodeProps) => {
   // The state
   const [ctrl] = useState(new InputRef());
   const [value, setValue] = useState("");
   const Values = useActions("Values", ["", "123456"] as const);
   const States = useActions("States", ["Focus", "Select"] as const);

   // The markup
   return (
      <Box {...props}>
         <AuthCode autoFocus value={value} inputRef={ctrl} onChange={setValue} />
         <hr />
         <Paper
            sx={{
               padding: 1,
            }}
            variant="outlined"
         >
            value: '{value}'
         </Paper>
         <Values
            onChosen={(what) => {
               setValue(what);
               ctrl.focus();
            }}
         />
         <States
            onChosen={(what) => {
               switch (what) {
                  case "Focus":
                     ctrl.focus();
                     break;
                  case "Select":
                     ctrl.focusAll();
                     break;
               }
            }}
         />
      </Box>
   );
};

export default TestAuthCode;
