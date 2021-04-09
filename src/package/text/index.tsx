/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import InputRef from "../InputRef";
import { ICtrl, noChange } from "../types";

// Trick the linter
const memoize = React.useMemo;

class RefText {
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
   variant?: Mui.TextFieldProps["variant"];
   refText?: React.MutableRefObject<RefText>;

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
      refText: propsRefText,
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
            value={value || ""}
            disabled={disabled}
            required={required}
            onChange={changeValue}
            inputRef={handleRefText}
            InputProps={{
               readOnly,
            }}
            autoFocus={autoFocus}
            label={label}
            variant={variant}
         />
      </Mui.Box>
   );
}

export default InputText;
