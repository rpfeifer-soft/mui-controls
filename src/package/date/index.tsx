/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import * as MuiLab from "@material-ui/lab";
import { default as MomentUtils } from "@date-io/moment";
import moment from "moment";
import "moment/locale/de";
import InputRef from "../InputRef";
import { css } from "@emotion/css";
import { ICtrl, noChange } from "../types";

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

export interface DateProps extends ICtrl<Date> {
   variant?: Mui.TextFieldProps["variant"];

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
      // ICtrl
      label,
      value: initValue,
      onChange = noChange,
      disabled,
      readOnly,
      required,
      autoFocus,
      // Date
      variant,
      mobile = false,
      timeSteps = 0,
      dateRef: propsDateRef,
      // Box
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
               autoFocus={autoFocus}
               inputRef={handleDateRef}
               InputProps={{
                  ...params.InputProps,
                  endAdornment: !readOnly && params.InputProps ? params.InputProps.endAdornment : undefined,
                  onKeyDown: (event) => {
                     if (!readOnly) {
                        onKeyDown(event);
                        if (params.InputProps?.onKeyDown && !event.isDefaultPrevented()) {
                           params.InputProps?.onKeyDown(event);
                        }
                     }
                  },
                  onBlur: (event) => {
                     if (params.InputProps?.onBlur) {
                        params.InputProps?.onBlur(event);
                     }
                     if (!readOnly) {
                        const change = onEndInput(true);
                        if (change) {
                           change();
                        }
                     }
                  },
                  readOnly: mobile || params.InputProps?.readOnly,
               }}
               inputProps={{
                  ...params.inputProps,
                  placeholder: !disabled && !readOnly && params.inputProps ? params.inputProps.placeholder : undefined,
                  value: mobile && !value ? "-" : params.inputProps?.value,
               }}
               disabled={disabled}
               label={params.label}
               helperText=""
               variant={variant}
               fullWidth
            />
         );
      };
   }, [variant, onKeyDown, onEndInput, dateRef, mobile, value, autoFocus, disabled, readOnly, handleDateRef]);

   // The functions
   const fixes = {
      className: css({
         "& .MuiPickersToolbar-root": {
            display: "none",
         },
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
   };

   const commonProps = {
      label,
      value,
      disabled,
      readOnly,
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
   };

   // The markup
   return (
      <Mui.Box {...boxProps}>
         {mobile && Boolean(timeSteps) && (
            <MuiLab.MobileDateTimePicker
               {...commonProps}
               DialogProps={fixes}
               showToolbar={true}
               showTodayButton
               minutesStep={timeSteps}
               clearable={!required}
               okText={dateUtils?.okText}
            />
         )}
         {mobile && !timeSteps && (
            <MuiLab.MobileDatePicker
               {...commonProps}
               DialogProps={fixes}
               showToolbar={false}
               showTodayButton
               clearable={!required}
               okText={dateUtils?.okText}
            />
         )}
         {!mobile && Boolean(timeSteps) && (
            <MuiLab.DesktopDateTimePicker
               {...commonProps}
               PopperProps={{
                  ...fixes,
                  className: css({
                     zIndex: 1350,
                  }),
               }}
               minutesStep={timeSteps}
            />
         )}
         {!mobile && !timeSteps && (
            <MuiLab.DesktopDatePicker
               {...commonProps}
               PopperProps={{
                  ...fixes,
                  className: css({
                     zIndex: 1350,
                  }),
               }}
            />
         )}
      </Mui.Box>
   );
};

export default Date;
