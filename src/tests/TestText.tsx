/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { InputText, useInputText, useRefText } from "../package";
import { useActions, useChoice, useSwitch } from "../hooks";
import { OptionGroup } from "../components";

export interface TestTextProps extends Mui.BoxProps {
   hook?: boolean;
}

const TestText = (props: TestTextProps) => {
   // The state
   const refText = useRefText();
   const [label, Label] = useChoice("Label", ["", "Label"] as const, "Label");
   const [value, setValue] = React.useState<string | null>(null);

   const Text = useInputText(null, "Label");

   const [disabled, Disabled] = useSwitch("Disabled");
   const [readOnly, ReadOnly] = useSwitch("ReadOnly");
   const [required, Required] = useSwitch("Required");
   const [variant, Variant] = useChoice("Variant", ["standard", "outlined", "filled", "square"] as const);
   const Values = useActions("Init", ["", "Some random text"] as const);
   const Actions = useActions("Actions", ["Focus", "Select", "OnlyNumber"] as const);

   // The props
   const { hook = false, ...boxProps } = props;

   // The functions
   const onChange = (text: string | null) => {
      setValue(text);
   };

   // Do not allow to empty Text
   const onOnlyNumber = React.useCallback(
      (value: string | null) => (value ? value.replaceAll(/[^0123456789]/g, "") : value),
      []
   );

   // The markup
   return (
      <Mui.Box {...boxProps}>
         {hook ? (
            <Text.Box autoFocus disabled={disabled} readOnly={readOnly} required={required} variant={variant} />
         ) : (
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
         )}
         <hr />
         <Mui.Paper
            sx={{
               padding: 1,
            }}
            variant="outlined"
         >
            value: '{JSON.stringify(hook ? Text.value : value)}'
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
                  hook ? Text.setValue(text) : setValue(text);
               } else {
                  hook ? Text.setValue(null) : setValue(null);
               }
               return true;
            }}
         />
         <Actions
            onChosen={(chosen) => {
               if (chosen === "Focus") {
                  hook ? Text.focus() : refText.current.focus();
               } else if (chosen === "Select") {
                  hook ? Text.select() : refText.current.select();
               } else if (hook && chosen === "OnlyNumber") {
                  Text.onChange = onOnlyNumber;
               }
            }}
         />
      </Mui.Box>
   );
};

export default TestText;
