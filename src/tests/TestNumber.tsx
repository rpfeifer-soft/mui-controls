/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { InputNumber, useInputNumber, useRefNumber } from "../package";
import { useActions, useChoice, useSwitch } from "../hooks";
import { OptionGroup } from "../components";

export interface TestNumberProps extends Mui.BoxProps {
   hook?: boolean;
}

const TestNumber = (props: TestNumberProps) => {
   // The state
   const refNumber = useRefNumber();
   const [value, setValue] = React.useState<number | null>(null);
   const [label, Label] = useChoice("Label", ["", "Label"] as const, "Label");

   const Number = useInputNumber(null, "Label");

   const [disabled, Disabled] = useSwitch("Disabled");
   const [readOnly, ReadOnly] = useSwitch("ReadOnly");
   const [required, Required] = useSwitch("Required");
   const [variant, Variant] = useChoice("Variant", ["standard", "outlined", "filled", "square"] as const);
   const Values = useActions("Init", ["", "21", "21.10", "-19.78", "+0004.4"] as const);
   const Actions = useActions("Actions", ["Focus", "Select"] as const);

   // The props
   const { hook = false, ...boxProps } = props;

   // The functions
   const onChange = (value: number | null) => {
      setValue(value);
   };

   // Do not allow to empty Text
   const onPositive = React.useCallback((value: number | null) => (value ? Math.abs(value) : value), []);

   // The markup
   return (
      <Mui.Box {...boxProps}>
         {hook ? (
            <Number.Box autoFocus disabled={disabled} readOnly={readOnly} required={required} variant={variant} />
         ) : (
            <InputNumber
               autoFocus
               label={label}
               value={value}
               disabled={disabled}
               readOnly={readOnly}
               required={required}
               variant={variant}
               onChange={onChange}
               refCtrl={refNumber}
            />
         )}
         <hr />
         <Mui.Paper
            sx={{
               padding: 1,
            }}
            variant="outlined"
         >
            value: '{JSON.stringify(hook ? Number.value : value)}'
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
                  (hook ? Number.setValue : setValue)(+text);
               } else {
                  (hook ? Number.setValue : setValue)(null);
               }
               return true;
            }}
         />
         <Actions
            onChosen={(chosen) => {
               if (chosen === "Focus") {
                  (hook ? Number : refNumber.current).focus();
               } else if (chosen === "Select") {
                  (hook ? Number : refNumber.current).select();
               } else if (hook && chosen === "OnlyNumber") {
                  Number.onChange = onPositive;
               }
            }}
         />
      </Mui.Box>
   );
};

export default TestNumber;
