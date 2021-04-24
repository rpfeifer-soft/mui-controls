/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { InputAuthCode, useInputAuthCode, useRefAuthCode } from "../package";
import { useActions, useMessage, useSwitch } from "../hooks";
import { OptionGroup } from "../components";

export interface TestAuthCodeProps extends Mui.BoxProps {
   hook?: boolean;
}

const TestAuthCode = (props: TestAuthCodeProps) => {
   // The state
   const refAuthCode = useRefAuthCode();
   const [value, setValue] = React.useState<string | null>(null);

   const AuthCode = useInputAuthCode(null, "Label");

   const [disabled, Disabled] = useSwitch("Disabled");
   const Values = useActions("Values", ["", "123456", "2bcd34"] as const);
   const States = useActions("States", ["Focus", "Select"] as const);
   const [showMessage, Message] = useMessage();

   const { hook = false, ...boxProps } = props;

   // The markup
   return (
      <Mui.Box {...boxProps}>
         {hook ? (
            <AuthCode.Box
               autoFocus
               disabled={disabled}
               onSubmit={(value) => {
                  showMessage(`You submitted the value: '${value}'`);
               }}
            />
         ) : (
            <InputAuthCode
               autoFocus
               value={value}
               disabled={disabled}
               refCtrl={refAuthCode}
               onChange={setValue}
               onSubmit={(value) => {
                  showMessage(`You submitted the value: '${value}'`);
               }}
            />
         )}
         <hr />
         <Mui.Paper
            sx={{
               padding: 1,
            }}
            variant="outlined"
         >
            value: '{hook ? AuthCode.value : value}'
         </Mui.Paper>
         <Values
            onChosen={(what) => {
               (hook ? AuthCode.setValue : setValue)(what);
               (hook ? AuthCode : refAuthCode.current).focus();
            }}
         />
         <OptionGroup title="Options">
            <Disabled />
         </OptionGroup>
         <States
            onChosen={(what) => {
               switch (what) {
                  case "Focus":
                     (hook ? AuthCode : refAuthCode.current).focus();
                     break;
                  case "Select":
                     (hook ? AuthCode : refAuthCode.current).select();
                     break;
               }
            }}
         />
         <Message />
      </Mui.Box>
   );
};

export default TestAuthCode;
