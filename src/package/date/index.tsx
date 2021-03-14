/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import * as MuiLab from "@material-ui/lab";
import { default as MomentUtils } from "@date-io/moment";
import moment from "moment";
import "moment/locale/de";
import InputRef from "../InputRef";

export class DateUtils extends MomentUtils {
   constructor(
      params: any,
      public okText?: string,
      public cancelText?: string,
      public clearText?: string,
      public todayText?: string
   ) {
      super(params);
   }
}

export interface DateInitProps {
   children: React.ReactNode;
   locale?: string;
   okText?: string;
   cancelText?: string;
   clearText?: string;
   todayText?: string;
}

export const DateInit = (props: DateInitProps) => {
   // The props
   const { children, locale = "de", okText, cancelText, clearText, todayText } = props;

   // The state
   const dateUtils = React.useMemo(() => {
      moment.locale(locale);
      return new DateUtils(
         {
            locale,
            instance: moment,
         },
         okText,
         cancelText,
         clearText,
         todayText
      );
   }, [locale, okText, cancelText, clearText, todayText]);

   // The markup
   return (
      <MuiLab.MuiPickersAdapterContext.Provider value={dateUtils}>{children}</MuiLab.MuiPickersAdapterContext.Provider>
   );
};

// Trick the linter
const memoize = React.useMemo;

class DateRef {
   // The input control class
   private inputRef: InputRef = new InputRef();

   focus() {
      this.inputRef.focusEnd();
   }

   select() {
      this.inputRef.focusAll();
   }

   useHandler = () => {
      return memoize(() => {
         // Register the input element
         return (inputRef?: React.Ref<any>) => (input: HTMLInputElement) => {
            this.inputRef.set(input);
            if (typeof inputRef === "function") {
               inputRef(input);
            }
         };
      }, []);
   };
}

export const useDateRef = () => React.useRef(new DateRef());

/*
import { observer } from "mobx-react";
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

const useStyles = Mui.makeStyles(() => ({
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
      renderInput: (params: Mui.TextFieldProps) => <Mui.TextField {...params} />,
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
*/

const noChange = (value: Date | null) => {};

export interface DateProps extends Omit<Mui.BoxProps, "onChange"> {
   label?: string;
   value: Date | null;
   onChange?: (value: Date | null) => void;

   variant?: "outlined" | "filled" | "standard";
   disabled?: boolean;
   clearable?: boolean;
   desktop?: boolean;
   mobile?: boolean;
   timeSteps?: number;
   dateRef?: React.MutableRefObject<DateRef>;
}

const Date = (props: DateProps) => {
   // The props
   const {
      label,
      value: initValue = null,
      onChange = noChange,
      variant,
      disabled = false,
      clearable = false,
      desktop = false,
      mobile = false,
      timeSteps = 0,
      dateRef: propsDateRef,
      ...boxProps
   } = props;

   // The state
   const context = React.useContext(MuiLab.MuiPickersAdapterContext);
   const dateUtils = context instanceof DateUtils ? context : undefined;
   const [value, setValue] = React.useState<moment.Moment | null>(moment(initValue));
   const [inputText, setInputText] = React.useState<string | null | undefined>();

   const dateRef = useDateRef();
   const handleDateRef = dateRef.current.useHandler();

   React.useEffect(() => {
      setValue(initValue ? moment(initValue) : null);
   }, [initValue]);

   // Allow the caller to use the date functions
   if (propsDateRef) {
      propsDateRef.current = dateRef.current;
   }

   // The functions
   const onEndInput = (makeValid: boolean) => {
      if (value && value.isValid()) {
         return onChange(value.toDate());
      } else if (clearable && !inputText) {
         return onChange(null);
      }
      if (makeValid) {
         setValue(initValue ? moment(initValue) : null);
      }
   };

   // Common props
   let format = "";
   if (context && context.moment) {
      format = timeSteps
         ? context.moment.localeData().longDateFormat("L") + " " + context.moment.localeData().longDateFormat("LT")
         : context.moment.localeData().longDateFormat("L");
   }
   const commonProps = {
      value,
      label,
      disabled,
      format,
      mask: format.replace(/[DMY]/g, "_"),
      renderInput: (params: Mui.TextFieldProps) => {
         return (
            <Mui.TextField
               {...params}
               InputProps={{
                  ...params.InputProps,
                  onBlur: (event) => {
                     if (params.onBlur) {
                        params.onBlur(event);
                     }
                     onEndInput(true);
                  },
               }}
               inputRef={handleDateRef(params.inputRef)}
               helperText=""
               variant={variant}
               fullWidth
            />
         );
      },
      onChange: (date: moment.Moment | null, text: string | undefined) => {
         setValue(date);
         setInputText(text);
      },
      onAccept: (date: moment.Moment | null) => {
         onChange(date ? date.toDate() : null);
      },
      cancelText: dateUtils?.cancelText,
      clearText: dateUtils?.clearText,
      todayText: dateUtils?.todayText,
      showDaysOutsideCurrentMonth: true,
   };

   // The markup
   return (
      <Mui.Box {...boxProps}>
         {mobile && Boolean(timeSteps) && (
            <MuiLab.MobileDateTimePicker
               {...commonProps}
               showTodayButton
               clearable={clearable}
               okText={dateUtils?.okText}
            />
         )}
         {mobile && !timeSteps && (
            <MuiLab.MobileDatePicker
               {...commonProps}
               showTodayButton
               clearable={clearable}
               okText={dateUtils?.okText}
            />
         )}
         {!mobile && Boolean(timeSteps) && (
            <MuiLab.DesktopDateTimePicker {...commonProps} orientation={desktop ? "landscape" : "portrait"} />
         )}
         {!mobile && !timeSteps && (
            <MuiLab.DesktopDatePicker {...commonProps} orientation={desktop ? "landscape" : "portrait"} />
         )}
      </Mui.Box>
   );
};

export default Date;
