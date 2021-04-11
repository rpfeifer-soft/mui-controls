/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import InputRef from "../InputRef";
import { ICtrl, IRefCtrl, noChange } from "../types";
import { genericHook } from "../genericHook";

// Trick the linter
const memoize = React.useMemo;

class RefText implements IRefCtrl {
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

   // Allow to overload box props
   boxProps?: Mui.BoxProps;
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
      refCtrl: propsRefText,
      // Box
      boxProps,
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
            onChange={changeValue}
            inputRef={handleRefText}
            InputProps={{
               readOnly,
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
      </Mui.Box>
   );
}

export default InputText;

// Allow to use hooks
export const useInputText = genericHook(InputText, useRefText);
