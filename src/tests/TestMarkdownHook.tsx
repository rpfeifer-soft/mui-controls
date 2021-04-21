/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { useInputMarkdown } from "../package";
import { useActions, useChoice, useSwitch } from "../hooks";
import { OptionGroup } from "../components";

export interface TestMarkdownHookProps extends Mui.BoxProps {}

const TestMarkdownHook = (props: TestMarkdownHookProps) => {
   // The state
   const Markdown = useInputMarkdown(null, "Label");
   const [disabled, Disabled] = useSwitch("Disabled");
   const [readOnly, ReadOnly] = useSwitch("ReadOnly");
   const [required, Required] = useSwitch("Required");
   const [variant, Variant] = useChoice("Variant", ["standard", "outlined", "filled", "square"] as const);
   const [rows, Rows] = useChoice("Rows", ["", "3", "5", "10"] as const);
   const [maxRows, MaxRows] = useChoice("MaxRows", ["", "3", "5", "10"] as const);
   const Values = useActions("Init", ["", "Lorem ipsum"] as const);
   const Actions = useActions("Actions", ["Focus", "Select", "OnlyDigits"] as const);

   // The props
   const { ...boxProps } = props;

   // Do not allow to empty Text
   const onDigit = React.useCallback((value: string | null) => (value ? value.replaceAll(/ /g, "") : value), []);

   // The markup
   return (
      <Mui.Box {...boxProps}>
         <Markdown.Box
            autoFocus
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            variant={variant}
            rows={rows ? +rows : undefined}
            maxRows={maxRows ? +maxRows : undefined}
         />
         <hr />
         <Mui.Paper
            sx={{
               padding: 1,
            }}
            variant="outlined"
         >
            value: '{JSON.stringify(Markdown.value)}'
         </Mui.Paper>
         <Variant />
         <Rows />
         <MaxRows />
         <OptionGroup title="Options">
            <Disabled />
            <ReadOnly />
            <Required />
         </OptionGroup>
         <Values
            onChosen={(text) => {
               if (text) {
                  Markdown.setValue(text);
               } else {
                  Markdown.setValue(null);
               }
               return true;
            }}
         />
         <Actions
            onChosen={(chosen) => {
               if (chosen === "Focus") {
                  Markdown.focus();
               } else if (chosen === "Select") {
                  Markdown.select();
               } else if (chosen === "OnlyDigits") {
                  Markdown.onChange = onDigit;
               }
            }}
         />
      </Mui.Box>
   );
};

export default TestMarkdownHook;
