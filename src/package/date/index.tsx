/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import * as MuiLab from "@material-ui/lab";
import { default as MomentUtils } from "@date-io/moment";
import moment from "moment";
import "moment/locale/de";
import InputRef from "../InputRef";
import { css } from "@emotion/css";

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
   private otherRef?: React.Ref<any>;

   blur() {
      this.inputRef.blur();
   }

   focus() {
      this.inputRef.focusEnd();
   }

   select() {
      this.inputRef.focusAll();
   }

   set forkedRef(otherRef: React.Ref<any> | undefined) {
      this.otherRef = otherRef;
   }

   useHandler = () => {
      return memoize(() => {
         // Register the input element
         return (input: HTMLInputElement) => {
            this.inputRef.set(input);
            if (typeof this.otherRef === "function") {
               this.otherRef(input);
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

export interface DateProps {
   required?: boolean;
   value: Date | null;
   onChange?: (value: Date | null) => void;

   label?: string;
   variant?: "outlined" | "filled" | "standard";
   disabled?: boolean;
   mobile?: boolean;
   timeSteps?: number;
   dateRef?: React.MutableRefObject<DateRef>;
   boxProps?: Mui.BoxProps;
}

function momentInTime(date: moment.Moment | null) {
   return date ? date.toDate().getTime() : 0;
}
function dateInTime(date: Date | null) {
   return date ? date.getTime() : 0;
}

const Date = (props: DateProps) => {
   // The props
   const {
      required,
      value: initValue,
      onChange = noChange,
      label,
      variant,
      disabled = false,
      mobile = false,
      timeSteps = 0,
      dateRef: propsDateRef,
      boxProps,
   } = props;

   // Validation
   if (required && !initValue) {
      throw new TypeError("Value not specified");
   }

   // The state
   const context = React.useContext(MuiLab.MuiPickersAdapterContext);
   const dateUtils = context instanceof DateUtils ? context : undefined;
   const [value, setValue] = React.useState<moment.Moment | null>(initValue ? moment(initValue) : null);
   const [inputText, setInputText] = React.useState<string | null | undefined>();

   const dateRef = useDateRef();
   const handleDateRef = dateRef.current.useHandler();

   // Common props
   let format = "";
   let weekDays = context?.getWeekdays() || [];
   if (context && context.moment) {
      format = timeSteps
         ? context.moment.localeData().longDateFormat("L") + " " + context.moment.localeData().longDateFormat("LT")
         : context.moment.localeData().longDateFormat("L");
   }

   React.useEffect(() => {
      setValue(initValue ? moment(initValue) : null);
   }, [initValue]);

   // Allow the caller to use the date functions
   if (propsDateRef) {
      propsDateRef.current = dateRef.current;
   }

   const onEndInput = React.useMemo(
      () => (makeValid: boolean) => {
         const changeValue = (date: Date | null) => {
            if (dateInTime(date) !== dateInTime(initValue)) {
               return () => onChange(date);
            } else if (momentInTime(value) !== dateInTime(initValue)) {
               return () => setValue(initValue ? moment(initValue) : null);
            }
            return false;
         };
         if (value && value.isValid()) {
            return changeValue(value.toDate());
         } else if (!required && !inputText) {
            return changeValue(null);
         }
         if (makeValid) {
            return changeValue(initValue);
         }
         return false;
      },
      [value, onChange, required, inputText, initValue]
   );

   const onKeyDown = React.useMemo(
      () => (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
         switch (event.key) {
            case "Enter":
            case "Escape":
               const change = onEndInput(event.key === "Escape");
               if (change) {
                  dateRef.current.blur();
                  change();
                  setTimeout(() => dateRef.current.focus(), 0);
               }
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
               if (value && value.isValid()) {
                  // Add or subtract
                  dateRef.current.blur();
                  onChange(value.add(step, "day").toDate());
                  setTimeout(() => dateRef.current.focus(), 0);
               } else {
                  dateRef.current.blur();
                  onChange(moment().add(step, "day").toDate());
                  setTimeout(() => dateRef.current.focus(), 0);
               }
               break;
         }
      },
      [onChange, onEndInput, value, dateRef]
   );

   const renderInput = React.useMemo(() => {
      return (params: Mui.TextFieldProps) => {
         // We have to allow the control to reregister
         dateRef.current.forkedRef = params.inputRef;
         return (
            <Mui.TextField
               inputRef={handleDateRef}
               InputProps={{
                  ...params.InputProps,
                  onKeyDown: (event) => {
                     onKeyDown(event);
                     if (params.InputProps?.onKeyDown && !event.isDefaultPrevented()) {
                        params.InputProps?.onKeyDown(event);
                     }
                  },
                  onBlur: (event) => {
                     if (params.InputProps?.onBlur) {
                        params.InputProps?.onBlur(event);
                     }
                     const change = onEndInput(true);
                     if (change) {
                        change();
                     }
                  },
               }}
               inputProps={{ ...params.inputProps }}
               placeholder={params.placeholder}
               label={params.label}
               helperText=""
               variant={variant}
               fullWidth
            />
         );
      };
   }, [variant, onKeyDown, onEndInput, dateRef, handleDateRef]);

   // The functions
   const commonProps = {
      label,
      value,
      disabled,
      format,
      mask: format.replace(/[DMYHm]/g, "_"),
      renderInput,
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
      PopperProps: {
         className: css({
            "& .MuiPickersCalendar-root": {
               minHeight: 240,
            },
            "& .MuiTabs-indicator": {
               width: "50% !important",
            },
            "& .MuiPickersDay-dayOutsideMonth": {
               color: Mui.alpha("#FFF", 0.2),
            },
            "& .MuiPickersCalendar-weekDayLabel::after": {
               display: "inline-block",
            },
            "& .MuiPickersCalendar-weekDayLabel:nth-child(1)::after": {
               content: `"${weekDays[0][1]}"`,
            },
            "& .MuiPickersCalendar-weekDayLabel:nth-child(2)::after": {
               content: `"${weekDays[1][1]}"`,
            },
            "& .MuiPickersCalendar-weekDayLabel:nth-child(3)::after": {
               content: `"${weekDays[2][1]}"`,
            },
            "& .MuiPickersCalendar-weekDayLabel:nth-child(4)::after": {
               content: `"${weekDays[3][1]}"`,
            },
            "& .MuiPickersCalendar-weekDayLabel:nth-child(5)::after": {
               content: `"${weekDays[4][1]}"`,
            },
            "& .MuiPickersCalendar-weekDayLabel:nth-child(6)::after": {
               content: `"${weekDays[5][1]}"`,
            },
            "& .MuiPickersCalendar-weekDayLabel:nth-child(7)::after": {
               content: `"${weekDays[6][1]}"`,
            },
         }),
      },
   };

   // The markup
   return (
      <Mui.Box {...boxProps}>
         {mobile && Boolean(timeSteps) && (
            <MuiLab.MobileDateTimePicker
               {...commonProps}
               showTodayButton
               minutesStep={timeSteps}
               clearable={!required}
               okText={dateUtils?.okText}
            />
         )}
         {mobile && !timeSteps && (
            <MuiLab.MobileDatePicker
               {...commonProps}
               showTodayButton
               clearable={!required}
               okText={dateUtils?.okText}
            />
         )}
         {!mobile && Boolean(timeSteps) && <MuiLab.DesktopDateTimePicker {...commonProps} minutesStep={timeSteps} />}
         {!mobile && !timeSteps && <MuiLab.DesktopDatePicker {...commonProps} />}
      </Mui.Box>
   );
};

export default Date;
