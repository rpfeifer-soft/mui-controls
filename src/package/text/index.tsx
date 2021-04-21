/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import InputRef, { DSetRangeUpdate } from "../InputRef";
import { ICtrl, IRefCtrl, noChange } from "../types";
import { genericHook } from "../genericHook";

// Trick the linter
const memoize = React.useMemo;

export class RefText implements IRefCtrl {
   // The input control class
   private inputRef: InputRef = new InputRef();

   focus() {
      this.inputRef.focus();
   }

   select() {
      this.inputRef.focusAll();
   }

   setRange(replace: DSetRangeUpdate) {
      this.inputRef.setRange(replace);
   }

   useHandler = () => {
      return memoize(() => {
         // Register the input element
         return (input: HTMLInputElement) => {
            this.inputRef.set(input);
         };
      }, []);
   };
}

export const useRefText = () => React.useRef(new RefText());

export interface InputTextProps extends ICtrl<string> {
   refCtrl?: React.MutableRefObject<RefText>;

   // Allow to overload text field props
   variant?: Mui.TextFieldProps["variant"] | "square";
   className?: Mui.TextFieldProps["className"];
   sx?: Mui.TextFieldProps["sx"];
   multiline?: boolean;
   rows?: number;
   maxRows?: number;
   onBlur?: () => void;

   // Allow to overload box props
   boxProps?: Mui.BoxProps;
   boxContent?: React.ReactNode;
}

function InputText(props: InputTextProps) {
   // The props
   const {
      // ICtrl
      label,
      value,
      disabled = false,
      readOnly = false,
      required = false,
      autoFocus = false,
      onChange = noChange,
      // Text
      variant,
      className,
      sx,
      multiline = false,
      rows,
      maxRows,
      onBlur: propsOnBlur,
      refCtrl: propsRefText,
      // Box
      boxProps,
      boxContent,
   } = props;

   // The state
   const textRef = useRefText();
   const handleRefText = textRef.current.useHandler();

   // Allow the caller to use the select functions
   if (propsRefText) {
      propsRefText.current = textRef.current;
   }

   const changeValue = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(
      (event) => {
         onChange(event.target.value ? event.target.value : required ? null : "");
      },
      [onChange, required]
   );

   const onBlur = React.useCallback<React.FocusEventHandler<HTMLInputElement>>(
      (event) => {
         if (propsOnBlur) {
            propsOnBlur();
         }
      },
      [propsOnBlur]
   );

   // The markup
   return (
      <Mui.Box {...boxProps}>
         <Mui.TextField
            fullWidth
            className={className}
            sx={sx}
            value={value || ""}
            disabled={disabled}
            required={required}
            multiline={multiline}
            rows={rows}
            maxRows={maxRows}
            onChange={changeValue}
            inputRef={handleRefText}
            InputProps={{
               readOnly,
               onBlur,
               sx:
                  variant === "square"
                     ? {
                          borderTopLeftRadius: 0,
                          borderTopRightRadius: 0,
                       }
                     : undefined,
            }}
            autoFocus={autoFocus}
            label={label}
            variant={variant === "square" ? "filled" : variant}
         />
         {boxContent}
      </Mui.Box>
   );
}

export default InputText;

// Allow to use hooks
export const useInputText = genericHook(InputText, useRefText);
