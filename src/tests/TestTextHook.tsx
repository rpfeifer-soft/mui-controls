/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { useInputText } from "../package";
import { useActions, useChoice, useSwitch } from "../hooks";
import { OptionGroup } from "../components";

export interface TestTextHookProps extends Mui.BoxProps {}

const TestTextHook = (props: TestTextHookProps) => {
   // The state
   const Text = useInputText("test", "Label");
   const [disabled, Disabled] = useSwitch("Disabled");
   const [readOnly, ReadOnly] = useSwitch("ReadOnly");
   const [required, Required] = useSwitch("Required");
   const [variant, Variant] = useChoice("Variant", ["standard", "outlined", "filled", "square"] as const);
   const Values = useActions("Init", ["", "Some random text"] as const);
   const Actions = useActions("Actions", ["Focus", "Select", "OnlyNumber"] as const);

   // The props
   const { ...boxProps } = props;

   // Do not allow to empty Text
   const onOnlyNumber = React.useCallback(
      (value: string | null) => (value ? value.replaceAll(/[^0123456789]/g, "") : value),
      []
   );

   // The markup
   return (
      <Mui.Box {...boxProps}>
         <Text.Box autoFocus disabled={disabled} readOnly={readOnly} required={required} variant={variant} />
         <hr />
         <Mui.Paper
            sx={{
               padding: 1,
            }}
            variant="outlined"
         >
            value: '{JSON.stringify(Text.value)}'
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
                  Text.setValue(text);
               } else {
                  Text.setValue(null);
               }
               return true;
            }}
         />
         <Actions
            onChosen={(chosen) => {
               if (chosen === "Focus") {
                  Text.focus();
               } else if (chosen === "Select") {
                  Text.select();
               } else if (chosen === "OnlyNumber") {
                  Text.onChange = onOnlyNumber;
               }
            }}
         />
      </Mui.Box>
   );
};

export default TestTextHook;
