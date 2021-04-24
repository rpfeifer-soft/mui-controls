/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { InputDate, useInputDate, useRefDate } from "../package";
import { useActions, useChoice, useMessage, useSwitch } from "../hooks";
import { OptionGroup } from "../components";
import moment from "moment";

export interface TestDateProps extends Mui.BoxProps {
   hook?: boolean;
}

const TestDate = (props: TestDateProps) => {
   // The state
   const refDate = useRefDate();
   const [label, Label] = useChoice("Label", ["", "Label"] as const, "Label");
   const [value, setValue] = React.useState<Date | null>(null);

   const Date = useInputDate(null, "Label");

   const [showMessage, Message] = useMessage();
   const [disabled, Disabled] = useSwitch("Disabled");
   const [readOnly, ReadOnly] = useSwitch("ReadOnly");
   const [required, Required] = useSwitch("Required");
   const [mobile, Mobile] = useSwitch("Mobile");
   const [variant, Variant] = useChoice("Variant", ["standard", "outlined", "filled"] as const);
   const [timeSteps, TimeSteps] = useChoice("TimeSteps", ["0", "5", "15", "30"] as const);
   const Actions = useActions("Actions", ["", "Today", "Tomorrow", "Focus", "Select"] as const);

   // The props
   const { hook = false, ...boxProps } = props;

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
         {hook ? (
            <Date.Box
               autoFocus
               variant={variant}
               disabled={disabled}
               readOnly={readOnly}
               required={required}
               mobile={mobile}
               timeSteps={Number(timeSteps)}
            />
         ) : (
            <InputDate
               autoFocus
               value={value}
               label={label}
               variant={variant}
               disabled={disabled}
               readOnly={readOnly}
               required={required}
               mobile={mobile}
               timeSteps={Number(timeSteps)}
               refCtrl={refDate}
               onChange={(date) => {
                  setValue(date);
                  showMessage(JSON.stringify(date));
               }}
            />
         )}
         <hr />
         <Mui.Paper
            sx={{
               padding: 1,
            }}
            variant="outlined"
         >
            value: '{JSON.stringify(hook ? Date.value : value)}'
         </Mui.Paper>
         {!hook && <Label />}
         <Variant />
         <OptionGroup title="Options">
            <Disabled />
            <ReadOnly />
            <Required
               maySwitch={(on) => {
                  if (on && !value) {
                     (hook ? Date.setValue : setValue)(new global.Date());
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
                        (hook ? Date.setValue : setValue)(null);
                     }
                     break;
                  case "Today":
                     (hook ? Date.setValue : setValue)(new global.Date());
                     break;
                  case "Tomorrow":
                     (hook ? Date.setValue : setValue)(moment().add(1, "day").toDate());
                     break;
                  case "Focus":
                     (hook ? Date : refDate.current).focus();
                     break;
                  case "Select":
                     (hook ? Date : refDate.current).select();
                     break;
               }
            }}
         />
         <Message />
      </Mui.Box>
   );
};

export default TestDate;
