/** @format */

import * as Mui from "@material-ui/core";
import { useInputAuthCode } from "../package";
import { useActions, useMessage, useSwitch } from "../hooks";
import { OptionGroup } from "../components";

export interface TestAuthCodeHookProps extends Mui.BoxProps {}

const TestAuthCodeHook = (props: TestAuthCodeHookProps) => {
   // The state
   const AuthCode = useInputAuthCode(null, "Label");
   const [disabled, Disabled] = useSwitch("Disabled");
   const Values = useActions("Values", ["", "123456", "2bcd34"] as const);
   const States = useActions("States", ["Focus", "Select"] as const);
   const [showMessage, Message] = useMessage();

   // The markup
   return (
      <Mui.Box {...props}>
         <AuthCode.Box
            autoFocus
            disabled={disabled}
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
            value: '{AuthCode.value}'
         </Mui.Paper>
         <Values
            onChosen={(what) => {
               AuthCode.setValue(what);
               AuthCode.focus();
            }}
         />
         <OptionGroup title="Options">
            <Disabled />
         </OptionGroup>
         <States
            onChosen={(what) => {
               switch (what) {
                  case "Focus":
                     AuthCode.focus();
                     break;
                  case "Select":
                     AuthCode.select();
                     break;
               }
            }}
         />
         <Message />
      </Mui.Box>
   );
};

export default TestAuthCodeHook;
