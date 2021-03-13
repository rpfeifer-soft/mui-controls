/** @format */

import { useState } from "react";
import { BoxProps, Box, Paper } from "@material-ui/core";
import { AuthCode, AuthCodeRef } from "../package";
import { useActions, useMessage } from "../hooks";

export interface TestAuthCodeProps extends BoxProps {}

const TestAuthCode = (props: TestAuthCodeProps) => {
   // The state
   const [ctrl] = useState(new AuthCodeRef());
   const [value, setValue] = useState("");
   const Values = useActions("Values", ["", "123456", "2bcd34"] as const);
   const States = useActions("States", ["Focus", "Select"] as const);
   const [showMessage, Message] = useMessage();

   // The markup
   return (
      <Box {...props}>
         <AuthCode
            autoFocus
            value={value}
            authCodeRef={ctrl}
            onChange={setValue}
            onSubmit={(value) => {
               showMessage(`You submitted the value: '${value}'`);
            }}
         />
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
                     ctrl.select();
                     break;
               }
            }}
         />
         <Message />
      </Box>
   );
};

export default TestAuthCode;
