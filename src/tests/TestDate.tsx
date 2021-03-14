/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { Date, DateInit, useDateRef } from "../package";
import { useActions, useChoice, useMessage, useSwitch } from "../hooks";
import { OptionGroup } from "../components";

export interface TestDateProps extends Mui.BoxProps {}

const TestDate = (props: TestDateProps) => {
   // The state
   const dateRef = useDateRef();
   const [showMessage, Message] = useMessage();
   const [label, Label] = useChoice("Label", ["", "Date"] as const);
   const [disabled, Disabled] = useSwitch("Disabled");
   const [clearable, Clearable] = useSwitch("Clearable");
   const [value, setValue] = React.useState<Date | null>(null);
   const [variant, Variant] = useChoice("Variant", ["standard", "outlined", "filled"] as const);
   const Actions = useActions("Actions", ["Focus", "Select"] as const);

   // The props
   const { ...boxProps } = props;

   // The functions

   // The markup
   return (
      <Mui.Box {...boxProps}>
         <DateInit locale="de">
            <Date
               value={value}
               label={label}
               variant={variant}
               disabled={disabled}
               clearable={clearable}
               dateRef={dateRef}
               onChange={(date) => {
                  setValue(date);
                  showMessage(JSON.stringify(date));
               }}
            />
         </DateInit>
         <hr />
         <Mui.Paper
            sx={{
               padding: 1,
            }}
            variant="outlined"
         >
            value: '{JSON.stringify(value)}'
         </Mui.Paper>
         <Variant />
         <Label />
         <OptionGroup title="Options">
            <Disabled />
            <Clearable />
         </OptionGroup>
         <Actions
            onChosen={(chosen) => {
               switch (chosen) {
                  case "Focus":
                     dateRef.current.focus();
                     break;
                  case "Select":
                     dateRef.current.select();
                     break;
               }
            }}
         />
         <Message />
      </Mui.Box>
   );
};

export default TestDate;
