/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { InputBoolean, useRefBoolean } from "../package";
import { useActions, useChoice, useSwitch } from "../hooks";
import { OptionGroup } from "../components";

export interface TestBooleanProps extends Mui.BoxProps {}

const TestBoolean = (props: TestBooleanProps) => {
   // The state
   const refBoolean = useRefBoolean();
   const [value, setValue] = React.useState<boolean | null>(null);
   const [label, Label] = useChoice("Label", ["", "Boolean"] as const);
   const [type, Type] = useChoice("Type", ["checkbox", "switch", "radio"] as const, "checkbox");
   const [disabled, Disabled] = useSwitch("Disabled");
   const [readOnly, ReadOnly] = useSwitch("ReadOnly");
   const [required, Required] = useSwitch("Required");
   const Values = useActions("Init", ["", "true", "false"] as const);
   const Actions = useActions("Actions", ["Focus", "Select"] as const);
   const [labelPlacement, LabelPlacement] = useChoice(
      "LabelPlacement",
      ["top", "bottom", "end", "start", "front"] as const,
      "end"
   );
   const [color, Color] = useChoice("Color", ["", "primary", "secondary"] as const);

   // The props
   const { ...boxProps } = props;

   // The functions
   const onChange = (checked: boolean | null) => {
      setValue(checked);
   };

   // The markup
   return (
      <Mui.Box {...boxProps}>
         <InputBoolean
            autoFocus
            type={type}
            label={label}
            labelPlacement={labelPlacement}
            color={color ? color : undefined}
            value={value}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            onChange={onChange}
            refCtrl={refBoolean}
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
         <Type />
         <Label />
         <LabelPlacement />
         <Color />
         <OptionGroup title="Options">
            <Disabled />
            <ReadOnly />
            <Required />
         </OptionGroup>
         <Values
            onChosen={(text) => {
               if (text) {
                  setValue(text === "true");
               } else {
                  setValue(null);
               }
               return true;
            }}
         />
         <Actions
            onChosen={(chosen) => {
               if (chosen === "Focus") {
                  refBoolean.current.focus();
               } else if (chosen === "Select") {
                  refBoolean.current.select();
               }
            }}
         />
      </Mui.Box>
   );
};

export default TestBoolean;
