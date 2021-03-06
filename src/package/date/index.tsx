/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import moment from "moment";
import "moment/locale/de";
import InputRef from "../InputRef";
import { css } from "@emotion/css";
import { ICtrl, IRefCtrl, noChange } from "../types";
import { useUIContext } from "../UIContext";
import { genericHook } from "../genericHook";
import MobileDateTimePicker from "@material-ui/lab/MobileDateTimePicker";
import DesktopDateTimePicker from "@material-ui/lab/DesktopDateTimePicker";
import MobileDatePicker from "@material-ui/lab/MobileDatePicker";
import DesktopDatePicker from "@material-ui/lab/DesktopDatePicker";

// Trick the linter
const memoize = React.useMemo;

class RefDate implements IRefCtrl {
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

export const useRefDate = () => React.useRef(new RefDate());

export interface InputDateProps extends ICtrl<Date> {
   mobile?: boolean;
   timeSteps?: number;
   refCtrl?: React.MutableRefObject<RefDate>;

   // Allow to overload text field props
   variant?: Mui.TextFieldProps["variant"] | "square";
   className?: Mui.TextFieldProps["className"];
   sx?: Mui.TextFieldProps["sx"];

   // Allow to overload box props
   boxProps?: Mui.BoxProps;
}

function momentInTime(date: moment.Moment | null) {
   return date ? date.toDate().getTime() : 0;
}
function dateInTime(date: Date | null) {
   return date ? date.getTime() : 0;
}

const InputDate = (props: InputDateProps) => {
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
      mobile = false,
      timeSteps = 0,
      refCtrl: propsRefDate,
      // Test
      variant,
      className,
      sx,
      // Box
      boxProps,
   } = props;

   // Validation
   if (required && !initValue) {
      throw new TypeError("Value not specified");
   }

   // The state
   const context = useUIContext();
   const [value, setValue] = React.useState<moment.Moment | null>(initValue ? moment(initValue) : null);
   const [inputText, setInputDate] = React.useState<string | null | undefined>();

   const dateRef = useRefDate();
   const handleRefDate = dateRef.current.useHandler();

   // Common props
   let format = timeSteps
      ? moment.localeData().longDateFormat("L") + " " + moment.localeData().longDateFormat("LT")
      : moment.localeData().longDateFormat("L");
   let weekDays = moment.weekdaysMin();

   React.useEffect(() => {
      setValue(initValue ? moment(initValue) : null);
   }, [initValue]);

   // Allow the caller to use the date functions
   if (propsRefDate) {
      propsRefDate.current = dateRef.current;
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
               className={className}
               sx={sx}
               inputRef={handleRefDate}
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
                  sx:
                     variant === "square"
                        ? {
                             ...params.InputProps?.sx,
                             borderTopLeftRadius: 0,
                             borderTopRightRadius: 0,
                          }
                        : params.InputProps?.sx,
               }}
               inputProps={{
                  ...params.inputProps,
                  placeholder: !disabled && !readOnly && params.inputProps ? params.inputProps.placeholder : undefined,
                  value: mobile && !value ? "-" : params.inputProps?.value,
               }}
               disabled={disabled}
               label={params.label}
               helperText=""
               variant={variant === "square" ? "filled" : variant}
               fullWidth
            />
         );
      };
   }, [
      variant,
      onKeyDown,
      onEndInput,
      className,
      sx,
      dateRef,
      mobile,
      value,
      autoFocus,
      disabled,
      readOnly,
      handleRefDate,
   ]);

   // The functions
   const fixes = {
      className: css({
         zIndex: 1350,
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
         setInputDate(text);
      },
      onAccept: (date: moment.Moment | null) => {
         onChange(date ? date.toDate() : null);
      },
      cancelText: context.cancelText,
      clearText: context.clearText,
      todayText: context.todayText,
      showDaysOutsideCurrentMonth: true,
   };

   // The markup
   return (
      <Mui.Box {...boxProps}>
         {mobile && Boolean(timeSteps) && (
            <MobileDateTimePicker
               {...commonProps}
               DialogProps={fixes}
               showToolbar={true}
               showTodayButton
               minutesStep={timeSteps}
               clearable={!required}
               okText={context.okText}
            />
         )}
         {mobile && !timeSteps && (
            <MobileDatePicker
               {...commonProps}
               DialogProps={fixes}
               showToolbar={false}
               showTodayButton
               clearable={!required}
               okText={context.okText}
            />
         )}
         {!mobile && Boolean(timeSteps) && (
            <DesktopDateTimePicker {...commonProps} PopperProps={fixes} minutesStep={timeSteps} />
         )}
         {!mobile && !timeSteps && <DesktopDatePicker {...commonProps} PopperProps={fixes} />}
      </Mui.Box>
   );
};

export default InputDate;

// Allow to use hooks
export const useInputDate = genericHook(InputDate, useRefDate);
