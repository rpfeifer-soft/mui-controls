/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { InputPhone, useInputPhone, useRefPhone } from "../package";
import { useActions, useChoice, useSwitch } from "../hooks";
import { OptionGroup } from "../components";

export interface TestPhoneProps extends Mui.BoxProps {
   hook?: boolean;
}

const TestPhone = (props: TestPhoneProps) => {
   // The state
   const refPhone = useRefPhone();
   const [value, setValue] = React.useState<string | null>(null);
   const [label, Label] = useChoice("Label", ["", "Label"] as const, "Label");

   const Phone = useInputPhone(null, "Label");

   const [disabled, Disabled] = useSwitch("Disabled");
   const [readOnly, ReadOnly] = useSwitch("ReadOnly");
   const [required, Required] = useSwitch("Required");
   const [variant, Variant] = useChoice("Variant", ["standard", "outlined", "filled", "square"] as const);
   const Values = useActions("Init", ["", "+49 7246 913229", "0336223792", "0305014034"] as const);
   const Actions = useActions("Actions", ["Focus", "Select"] as const);

   // The props
   const { hook = false, ...boxProps } = props;

   // The functions
   const onChange = (value: string | null) => {
      setValue(value);
   };

   // Do not allow to empty Text
   const onDigit = React.useCallback((value: string | null) => (value ? value.replaceAll(/ /g, "") : value), []);

   // The markup
   return (
      <Mui.Box {...boxProps}>
         {hook ? (
            <Phone.Box autoFocus disabled={disabled} readOnly={readOnly} required={required} variant={variant} />
         ) : (
            <InputPhone
               autoFocus
               label={label}
               value={value}
               disabled={disabled}
               readOnly={readOnly}
               required={required}
               variant={variant}
               onChange={onChange}
               refCtrl={refPhone}
            />
         )}
         <hr />
         <Mui.Paper
            sx={{
               padding: 1,
            }}
            variant="outlined"
         >
            value: '{JSON.stringify(hook ? Phone.value : value)}'
         </Mui.Paper>
         {!hook && <Label />}
         <Variant />
         <OptionGroup title="Options">
            <Disabled />
            <ReadOnly />
            <Required />
         </OptionGroup>
         <Values
            onChosen={(text) => {
               if (text) {
                  (hook ? Phone.setValue : setValue)(text);
               } else {
                  (hook ? Phone.setValue : setValue)(null);
               }
               return true;
            }}
         />
         <Actions
            onChosen={(chosen) => {
               if (chosen === "Focus") {
                  (hook ? Phone : refPhone.current).focus();
               } else if (chosen === "Select") {
                  (hook ? Phone : refPhone.current).select();
               } else if (hook && chosen === "OnlyDigits") {
                  Phone.onChange = onDigit;
               }
            }}
         />
      </Mui.Box>
   );
};

export default TestPhone;
