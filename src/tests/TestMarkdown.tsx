/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { InputMarkdown, useInputMarkdown, useRefMarkdown } from "../package";
import { useActions, useChoice, useSwitch } from "../hooks";
import { OptionGroup } from "../components";
import marked from "marked";

export interface TestMarkdownProps extends Mui.BoxProps {
   hook?: boolean;
}

const TestMarkdown = (props: TestMarkdownProps) => {
   // The state
   const refMarkdown = useRefMarkdown();
   const [value, setValue] = React.useState<string | null>(null);
   const [label, Label] = useChoice("Label", ["", "Text"] as const);

   const Markdown = useInputMarkdown(null, "Label");

   const [disabled, Disabled] = useSwitch("Disabled");
   const [readOnly, ReadOnly] = useSwitch("ReadOnly");
   const [required, Required] = useSwitch("Required");
   const [variant, Variant] = useChoice("Variant", ["standard", "outlined", "filled", "square"] as const);
   const [rows, Rows] = useChoice("Rows", ["", "3", "5", "10"] as const);
   const [maxRows, MaxRows] = useChoice("MaxRows", ["", "3", "5", "10"] as const);
   const Values = useActions("Init", ["", "Lorem ipsum"] as const);
   const Actions = useActions("Actions", ["Focus", "Select"] as const);

   // The props
   const { hook = false, ...boxProps } = props;

   // The functions
   const onChange = (value: string | null) => {
      setValue(value);
   };

   // Do not allow to empty Text
   const onDigit = React.useCallback((value: string | null) => (value ? value.replaceAll(/ /g, "") : value), []);

   // The markup
   return (
      <Mui.Box {...boxProps}>
         {hook ? (
            <Markdown.Box
               autoFocus
               disabled={disabled}
               readOnly={readOnly}
               required={required}
               variant={variant}
               rows={rows ? +rows : undefined}
               maxRows={maxRows ? +maxRows : undefined}
            />
         ) : (
            <InputMarkdown
               autoFocus
               label={label}
               value={value}
               disabled={disabled}
               readOnly={readOnly}
               required={required}
               variant={variant}
               rows={rows ? +rows : undefined}
               maxRows={maxRows ? +maxRows : undefined}
               onChange={onChange}
               refCtrl={refMarkdown}
            />
         )}
         <hr />
         <Mui.Paper
            sx={{
               padding: 1,
            }}
            variant="outlined"
         >
            value: '{JSON.stringify(hook ? Markdown.value : value)}'
         </Mui.Paper>
         {!hook && <Label />}
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
                  (hook ? Markdown.setValue : setValue)(text);
               } else {
                  (hook ? Markdown.setValue : setValue)(null);
               }
               return true;
            }}
         />
         <Actions
            onChosen={(chosen) => {
               if (chosen === "Focus") {
                  (hook ? Markdown : refMarkdown.current).focus();
               } else if (chosen === "Select") {
                  (hook ? Markdown : refMarkdown.current).select();
               } else if (hook && chosen === "OnlyDigits") {
                  Markdown.onChange = onDigit;
               }
            }}
         />
         <hr />
         <div dangerouslySetInnerHTML={{ __html: marked((hook ? Markdown.value : value) || "") }} />
      </Mui.Box>
   );
};

export default TestMarkdown;
