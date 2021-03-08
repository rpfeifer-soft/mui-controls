/** @format */

import * as React from "react";
import { observer } from "mobx-react";
import { makeStyles, TextField, TextFieldProps } from "@material-ui/core";
import clsx from "clsx";
import {
   DatePicker,
   DateTimePicker,
   DesktopDatePicker,
   DesktopDateTimePicker,
   MuiPickersAdapterContext,
} from "@material-ui/lab";
import InputRef from "../InputRef";
import { DateUtils } from "./init";
import moment from "moment";
export { default as DateTimeInit } from "./init";

const useStyles = makeStyles(() => ({
   container: {},
   control: {},
}));

export interface DateTimeFieldProps
   extends Omit<React.DetailedHTMLProps<React.HtmlHTMLAttributes<HTMLDivElement>, HTMLDivElement>, "onChange"> {
   label?: string;
   value?: Date;
   onChange: (newValue?: Date) => void;

   variant?: "outlined" | "filled" | "standard";
   disabled?: boolean;
   fullWidth?: boolean;
   clearable?: boolean;
   desktop?: boolean;
   mobile?: boolean;
   timeSteps?: number;
   inputRef?: InputRef;
}

const DateTimeField = observer((props: DateTimeFieldProps) => {
   // The styles
   const styles = useStyles();
   const context = React.useContext(MuiPickersAdapterContext);

   // The props
   const {
      label,
      value,
      onChange,
      className,
      variant = "standard",
      disabled = false,
      fullWidth = false,
      clearable = false,
      desktop = false,
      mobile = false,
      timeSteps = 0,
      inputRef,
      ...divProps
   } = props;

   // The state
   const [current, setCurrent] = React.useState(value || null);
   const [inputText, setInputText] = React.useState<string | null | undefined>();
   const dateUtils = context instanceof DateUtils ? context : undefined;

   React.useEffect(() => {
      setCurrent(value || null);
   }, [value]);

   let format = "";
   if (context && context.moment) {
      format = timeSteps
         ? context.moment.localeData().longDateFormat("L") + " " + context.moment.localeData().longDateFormat("LT")
         : context.moment.localeData().longDateFormat("L");
   }

   // The functions
   const mountInput = (input: HTMLInputElement) => {
      if (inputRef) {
         inputRef.set(input);
      }
   };
   const onEndInput = (makeValid: boolean) => {
      if (current && !isNaN(current.getTime())) {
         return onChange(current);
      } else if (clearable && !inputText) {
         return onChange();
      }
      if (makeValid) {
         setCurrent(value || null);
      }
   };
   const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      switch (event.key) {
         case "Enter":
            onEndInput(false);
            break;
         case "Escape":
            setCurrent(value || null);
            break;
         case "ArrowUp":
         case "ArrowDown":
         case "PageUp":
         case "PageDown":
            const step =
               event.key === "ArrowUp"
                  ? +1
                  : event.key === "ArrowDown"
                  ? -1
                  : event.key === "PageUp"
                  ? +7
                  : event.key === "PageDown"
                  ? -7
                  : 0;
            if (current && !isNaN(current.getTime())) {
               // Add or subtract
               setCurrent(moment(current).add(step, "day").toDate());
            } else {
               setCurrent(moment().add(step, "day").toDate());
            }
            break;
      }
   };

   const commonProps = {
      value: current,
      renderInput: (params: TextFieldProps) => <TextField {...params} />,
      format,
      onAccept: (date?: any) => {
         onChange(date?.toDate());
      },
      clearable,
      disabled,
      label,
      inputVariant: variant,
      fullWidth,
      okLabel: dateUtils?.okLabel,
      cancelLabel: dateUtils?.cancelLabel,
      clearLabel: dateUtils?.clearLabel,
      todayLabel: dateUtils?.todayLabel,
      invalidDateMessage: "",
      showTodayButton: true,
   };

   // The markup
   let control: React.ReactNode;
   if (timeSteps) {
      if (mobile) {
         control = (
            <DateTimePicker
               ampm={false}
               minutesStep={timeSteps}
               onChange={(date) => setCurrent(date?.toDate() || null)}
               {...commonProps}
            />
         );
      } else {
         control = (
            <DesktopDateTimePicker
               ampm={false}
               minutesStep={timeSteps}
               InputProps={{
                  ref: mountInput,
                  onKeyDown: (event) => handleKeyDown(event),
                  onBlur: () => {
                     onEndInput(true);
                  },
               }}
               onChange={(date, text) => {
                  setCurrent(date?.toDate() || null);
                  setInputText(text);
               }}
               {...commonProps}
            />
         );
      }
   } else {
      if (mobile) {
         control = <DatePicker onChange={(date) => setCurrent(date?.toDate() || null)} {...commonProps} />;
      } else {
         control = (
            <DesktopDatePicker
               InputProps={{
                  ref: mountInput,
                  onKeyDown: (event) => handleKeyDown(event),
                  onBlur: () => {
                     onEndInput(true);
                  },
               }}
               orientation={desktop ? "landscape" : "portrait"}
               onChange={(date, text) => {
                  setCurrent(date?.toDate() || null);
                  setInputText(text);
               }}
               {...commonProps}
            />
         );
      }
   }

   return (
      <div className={clsx(className, styles.container)} {...divProps}>
         {control}
      </div>
   );
});

export default DateTimeField;
