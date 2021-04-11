/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { InputNumber, useRefNumber } from "../package";
import { useActions, useChoice, useSwitch } from "../hooks";
import { OptionGroup } from "../components";

export interface TestNumberProps extends Mui.BoxProps {}

const TestNumber = (props: TestNumberProps) => {
   // The state
   const refNumber = useRefNumber();
   const [value, setValue] = React.useState<number | null>(null);
   const [label, Label] = useChoice("Label", ["", "Text"] as const);
   const [disabled, Disabled] = useSwitch("Disabled");
   const [readOnly, ReadOnly] = useSwitch("ReadOnly");
   const [required, Required] = useSwitch("Required");
   const [variant, Variant] = useChoice("Variant", ["standard", "outlined", "filled", "square"] as const);
   const Values = useActions("Init", ["", "21", "21.10", "-19.78"] as const);
   const Actions = useActions("Actions", ["Focus", "Select"] as const);

   // The props
   const { ...boxProps } = props;

   // The functions
   const onChange = (value: number | null) => {
      setValue(value);
   };

   // The markup
   return (
      <Mui.Box {...boxProps}>
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
         <hr />
         <Mui.Paper
            sx={{
               padding: 1,
            }}
            variant="outlined"
         >
            value: '{JSON.stringify(value)}'
         </Mui.Paper>
         <Label />
         <Variant />
         <OptionGroup title="Options">
            <Disabled />
            <ReadOnly />
            <Required />
         </OptionGroup>
         <Values
            onChosen={(text) => {
               if (text) {
                  setValue(Number(text));
               } else {
                  setValue(null);
               }
               return true;
            }}
         />
         <Actions
            onChosen={(chosen) => {
               if (chosen === "Focus") {
                  refNumber.current.focus();
               } else if (chosen === "Select") {
                  refNumber.current.select();
               }
            }}
         />
      </Mui.Box>
   );
};

export default TestNumber;
