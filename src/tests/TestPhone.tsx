/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { InputPhone, useRefPhone } from "../package";
import { useActions, useChoice, useSwitch } from "../hooks";
import { OptionGroup } from "../components";

export interface TestPhoneProps extends Mui.BoxProps {}

const TestPhone = (props: TestPhoneProps) => {
   // The state
   const refPhone = useRefPhone();
   const [value, setValue] = React.useState<string | null>(null);
   const [label, Label] = useChoice("Label", ["", "Text"] as const);
   const [disabled, Disabled] = useSwitch("Disabled");
   const [readOnly, ReadOnly] = useSwitch("ReadOnly");
   const [required, Required] = useSwitch("Required");
   const [variant, Variant] = useChoice("Variant", ["standard", "outlined", "filled", "square"] as const);
   const Values = useActions("Init", ["", "+49 7246 913229", "0336223792", "0305014034"] as const);
   const Actions = useActions("Actions", ["Focus", "Select"] as const);

   // The props
   const { ...boxProps } = props;

   // The functions
   const onChange = (value: string | null) => {
      setValue(value);
   };

   // The markup
   return (
      <Mui.Box {...boxProps}>
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
                  setValue(text);
               } else {
                  setValue(null);
               }
               return true;
            }}
         />
         <Actions
            onChosen={(chosen) => {
               if (chosen === "Focus") {
                  refPhone.current.focus();
               } else if (chosen === "Select") {
                  refPhone.current.select();
               }
            }}
         />
      </Mui.Box>
   );
};

export default TestPhone;
