/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { AuthCode, useAuthCodeRef } from "../package";
import { useActions, useMessage } from "../hooks";

export interface TestAuthCodeProps extends Mui.BoxProps {}

const TestAuthCode = (props: TestAuthCodeProps) => {
   // The state
   const authCodeRef = useAuthCodeRef();
   const [value, setValue] = React.useState("");
   const Values = useActions("Values", ["", "123456", "2bcd34"] as const);
   const States = useActions("States", ["Focus", "Select"] as const);
   const [showMessage, Message] = useMessage();

   // The markup
   return (
      <Mui.Box {...props}>
         <AuthCode
            autoFocus
            value={value}
            authCodeRef={authCodeRef}
            onChange={setValue}
            onSubmit={(value) => {
               showMessage(`You submitted the value: '${value}'`);
            }}
         />
         <hr />
         <Mui.Paper
            sx={{
               padding: 1,
            }}
            variant="outlined"
         >
            value: '{value}'
         </Mui.Paper>
         <Values
            onChosen={(what) => {
               setValue(what);
               authCodeRef.current.focus();
            }}
         />
         <States
            onChosen={(what) => {
               switch (what) {
                  case "Focus":
                     authCodeRef.current.focus();
                     break;
                  case "Select":
                     authCodeRef.current.select();
                     break;
               }
            }}
         />
         <Message />
      </Mui.Box>
   );
};

export default TestAuthCode;
