/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { useInputNumber } from "../package";
import { useActions, useChoice, useSwitch } from "../hooks";
import { OptionGroup } from "../components";

export interface TestNumberHookProps extends Mui.BoxProps {}

const TestNumberHook = (props: TestNumberHookProps) => {
   // The state
   const Number = useInputNumber(null, "Label");
   const [disabled, Disabled] = useSwitch("Disabled");
   const [readOnly, ReadOnly] = useSwitch("ReadOnly");
   const [required, Required] = useSwitch("Required");
   const [variant, Variant] = useChoice("Variant", ["standard", "outlined", "filled", "square"] as const);
   const Values = useActions("Init", ["", "21", "21.10", "-19.78"] as const);
   const Actions = useActions("Actions", ["Focus", "Select", "OnlyNumber"] as const);

   // The props
   const { ...boxProps } = props;

   // Do not allow to empty Text
   const onPositive = React.useCallback((value: number | null) => (value ? Math.abs(value) : value), []);

   // The markup
   return (
      <Mui.Box {...boxProps}>
         <Number.Box autoFocus disabled={disabled} readOnly={readOnly} required={required} variant={variant} />
         <hr />
         <Mui.Paper
            sx={{
               padding: 1,
            }}
            variant="outlined"
         >
            value: '{JSON.stringify(Number.value)}'
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
                  Number.setValue(+text);
               } else {
                  Number.setValue(null);
               }
               return true;
            }}
         />
         <Actions
            onChosen={(chosen) => {
               if (chosen === "Focus") {
                  Number.focus();
               } else if (chosen === "Select") {
                  Number.select();
               } else if (chosen === "OnlyNumber") {
                  Number.onChange = onPositive;
               }
            }}
         />
      </Mui.Box>
   );
};

export default TestNumberHook;
