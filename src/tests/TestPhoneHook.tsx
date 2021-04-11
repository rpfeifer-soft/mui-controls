/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { useInputPhone } from "../package";
import { useActions, useChoice, useSwitch } from "../hooks";
import { OptionGroup } from "../components";

export interface TestPhoneHookProps extends Mui.BoxProps {}

const TestPhoneHook = (props: TestPhoneHookProps) => {
   // The state
   const Phone = useInputPhone(null, "Label");
   const [disabled, Disabled] = useSwitch("Disabled");
   const [readOnly, ReadOnly] = useSwitch("ReadOnly");
   const [required, Required] = useSwitch("Required");
   const [variant, Variant] = useChoice("Variant", ["standard", "outlined", "filled", "square"] as const);
   const Values = useActions("Init", ["", "+49 7246 913229", "0336223792", "0305014034"] as const);
   const Actions = useActions("Actions", ["Focus", "Select", "OnlyDigits"] as const);

   // The props
   const { ...boxProps } = props;

   // Do not allow to empty Text
   const onDigit = React.useCallback((value: string | null) => (value ? value.replaceAll(/ /g, "") : value), []);

   // The markup
   return (
      <Mui.Box {...boxProps}>
         <Phone.Box autoFocus disabled={disabled} readOnly={readOnly} required={required} variant={variant} />
         <hr />
         <Mui.Paper
            sx={{
               padding: 1,
            }}
            variant="outlined"
         >
            value: '{JSON.stringify(Phone.value)}'
         </Mui.Paper>
         <Variant />
         <OptionGroup title="Options">
            <Disabled />
            <ReadOnly />
            <Required />
         </OptionGroup>
         <Values
            onChosen={(text) => {
               if (text) {
                  Phone.setValue(text);
               } else {
                  Phone.setValue(null);
               }
               return true;
            }}
         />
         <Actions
            onChosen={(chosen) => {
               if (chosen === "Focus") {
                  Phone.focus();
               } else if (chosen === "Select") {
                  Phone.select();
               } else if (chosen === "OnlyDigits") {
                  Phone.onChange = onDigit;
               }
            }}
         />
      </Mui.Box>
   );
};

export default TestPhoneHook;
