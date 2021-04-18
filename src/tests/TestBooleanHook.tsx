/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { useInputBoolean } from "../package";
import { useActions, useChoice, useSwitch } from "../hooks";
import { OptionGroup } from "../components";

export interface TestBooleanHookProps extends Mui.BoxProps {}

const TestBooleanHook = (props: TestBooleanHookProps) => {
   // The state
   const Boolean = useInputBoolean(null, "Label");
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

   // The markup
   return (
      <Mui.Box {...boxProps}>
         <Boolean.Box
            autoFocus
            type={type}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            labelPlacement={labelPlacement}
            color={color ? color : undefined}
         />
         <hr />
         <Mui.Paper
            sx={{
               padding: 1,
            }}
            variant="outlined"
         >
            value: '{JSON.stringify(Boolean.value)}'
         </Mui.Paper>
         <Type />
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
                  Boolean.setValue(text === "true");
               } else {
                  Boolean.setValue(null);
               }
               return true;
            }}
         />
         <Actions
            onChosen={(chosen) => {
               if (chosen === "Focus") {
                  Boolean.focus();
               } else if (chosen === "Select") {
                  Boolean.select();
               }
            }}
         />
      </Mui.Box>
   );
};

export default TestBooleanHook;
