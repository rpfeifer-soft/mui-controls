/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { InputText, useRefText } from "../package";
import { useActions, useChoice, useSwitch } from "../hooks";
import { OptionGroup } from "../components";

export interface TestTextProps extends Mui.BoxProps {}

const TestText = (props: TestTextProps) => {
   // The state
   const refText = useRefText();
   const [value, setValue] = React.useState<string | null>(null);
   const [label, Label] = useChoice("Label", ["", "Text"] as const);
   const [disabled, Disabled] = useSwitch("Disabled");
   const [readOnly, ReadOnly] = useSwitch("ReadOnly");
   const [required, Required] = useSwitch("Required");
   const [variant, Variant] = useChoice("Variant", ["standard", "outlined", "filled", "square"] as const);
   const Values = useActions("Init", ["", "Some random text"] as const);
   const Actions = useActions("Actions", ["Focus", "Select"] as const);

   // The props
   const { ...boxProps } = props;

   // The functions
   const onChange = (text: string | null) => {
      setValue(text);
   };

   // The markup
   return (
      <Mui.Box {...boxProps}>
         <InputText
            autoFocus
            label={label}
            value={value}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            variant={variant}
            onChange={onChange}
            refCtrl={refText}
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
                  refText.current.focus();
               } else if (chosen === "Select") {
                  refText.current.select();
               }
            }}
         />
      </Mui.Box>
   );
};

export default TestText;
