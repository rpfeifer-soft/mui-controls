/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { InputMarkdown, useRefMarkdown } from "../package";
import { useActions, useChoice, useSwitch } from "../hooks";
import { OptionGroup } from "../components";
import marked from "marked";

export interface TestMarkdownProps extends Mui.BoxProps {}

const TestMarkdown = (props: TestMarkdownProps) => {
   // The state
   const refMarkdown = useRefMarkdown();
   const [value, setValue] = React.useState<string | null>(null);
   const [label, Label] = useChoice("Label", ["", "Text"] as const);
   const [disabled, Disabled] = useSwitch("Disabled");
   const [readOnly, ReadOnly] = useSwitch("ReadOnly");
   const [required, Required] = useSwitch("Required");
   const [variant, Variant] = useChoice("Variant", ["standard", "outlined", "filled", "square"] as const);
   const [rows, Rows] = useChoice("Rows", ["", "3", "5", "10"] as const);
   const [maxRows, MaxRows] = useChoice("MaxRows", ["", "3", "5", "10"] as const);
   const Values = useActions("Init", ["", "Lorem ipsum"] as const);
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
                  refMarkdown.current.focus();
               } else if (chosen === "Select") {
                  refMarkdown.current.select();
               }
            }}
         />
         <hr />
         <div dangerouslySetInnerHTML={{ __html: marked(value || "") }} />
      </Mui.Box>
   );
};

export default TestMarkdown;
