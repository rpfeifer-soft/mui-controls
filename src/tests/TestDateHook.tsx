/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { useInputDate } from "../package";
import { useActions, useChoice, useMessage, useSwitch } from "../hooks";
import { OptionGroup } from "../components";
import moment from "moment";

export interface TestDateHookProps extends Mui.BoxProps {}

const TestDateHook = (props: TestDateHookProps) => {
   // The state
   const Date = useInputDate(null, "Label");
   const [showMessage, Message] = useMessage();
   const [disabled, Disabled] = useSwitch("Disabled");
   const [readOnly, ReadOnly] = useSwitch("ReadOnly");
   const [required, Required] = useSwitch("Required");
   const [mobile, Mobile] = useSwitch("Mobile");
   const [variant, Variant] = useChoice("Variant", ["standard", "outlined", "filled", "square"] as const);
   const [timeSteps, TimeSteps] = useChoice("TimeSteps", ["0", "5", "15", "30"] as const);
   const Actions = useActions("Actions", ["", "Today", "Tomorrow", "Focus", "Select"] as const);

   // The props
   const { ...boxProps } = props;

   // The functions
   Date.onChange = React.useCallback(
      (value) => {
         showMessage(JSON.stringify(value));
         return value;
      },
      [showMessage]
   );

   // The markup
   return (
      <Mui.Box {...boxProps}>
         <Date.Box
            autoFocus
            variant={variant}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            mobile={mobile}
            timeSteps={Number(timeSteps)}
         />
         <hr />
         <Mui.Paper
            sx={{
               padding: 1,
            }}
            variant="outlined"
         >
            value: '{JSON.stringify(Date.value)}'
         </Mui.Paper>
         <Variant />
         <OptionGroup title="Options">
            <Disabled />
            <ReadOnly />
            <Required
               maySwitch={(on) => {
                  if (on && !Date.value) {
                     Date.setValue(new global.Date());
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
                        Date.setValue(null);
                     }
                     break;
                  case "Today":
                     Date.setValue(new global.Date());
                     break;
                  case "Tomorrow":
                     Date.setValue(moment().add(1, "day").toDate());
                     break;
                  case "Focus":
                     Date.focus();
                     break;
                  case "Select":
                     Date.select();
                     break;
               }
            }}
         />
         <Message />
      </Mui.Box>
   );
};

export default TestDateHook;
