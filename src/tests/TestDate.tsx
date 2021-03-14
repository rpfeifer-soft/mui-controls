/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { Date, DateInit, useDateRef } from "../package";
import { useActions, useChoice, useMessage, useSwitch } from "../hooks";
import { OptionGroup } from "../components";
import moment from "moment";

export interface TestDateProps extends Mui.BoxProps {}

const TestDate = (props: TestDateProps) => {
   // The state
   const dateRef = useDateRef();
   const [showMessage, Message] = useMessage();
   const [label, Label] = useChoice("Label", ["", "Date"] as const);
   const [disabled, Disabled] = useSwitch("Disabled");
   const [required, Required] = useSwitch("Required");
   const [mobile, Mobile] = useSwitch("Mobile");
   const [value, setValue] = React.useState<Date | null>(null);
   const [variant, Variant] = useChoice("Variant", ["standard", "outlined", "filled"] as const);
   const [timeSteps, TimeSteps] = useChoice("TimeSteps", ["0", "5", "15", "30"] as const);
   const Actions = useActions("Actions", ["", "Today", "Tomorrow", "Focus", "Select"] as const);

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
               required={required}
               mobile={mobile}
               timeSteps={Number(timeSteps)}
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
            <Required
               maySwitch={(on) => {
                  if (on && !value) {
                     setValue(new global.Date());
                  }
                  return true;
               }}
            />
            <Mobile />
         </OptionGroup>
         <TimeSteps />
         <Actions
            onChosen={(chosen) => {
               switch (chosen) {
                  case "":
                     if (!required) {
                        setValue(null);
                     }
                     break;
                  case "Today":
                     setValue(new global.Date());
                     break;
                  case "Tomorrow":
                     setValue(moment().add(1, "day").toDate());
                     break;
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
