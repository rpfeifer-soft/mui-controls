/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import InputRef from "../InputRef";

function noChange<T>(value: T | null) {}

// Trick the linter
const memoize = React.useMemo;

class SelectRef {
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

export const useSelectRef = () => React.useRef(new SelectRef());

export interface SelectProps<T> extends Omit<Mui.BoxProps, "onChange"> {
   label?: string;
   value?: T;
   variant?: Mui.TextFieldProps["variant"];
   options: T[];
   onChange: (value: T | null) => void;
   disabled?: boolean;
   selectRef?: React.MutableRefObject<SelectRef>;
}

function Select<T>(props: SelectProps<T>) {
   // The props
   const {
      label,
      value,
      variant,
      options,
      onChange = noChange,
      disabled = false,
      selectRef: propsSelectRef,
      ...boxProps
   } = props;

   // The state
   const selectRef = useSelectRef();
   const handleSelectRef = selectRef.current.useHandler();

   // Allow the caller to use the select functions
   if (propsSelectRef) {
      propsSelectRef.current = selectRef.current;
   }

   // The markup
   return (
      <Mui.Box {...boxProps}>
         <Mui.Autocomplete
            renderInput={(params) => {
               return <Mui.TextField inputRef={handleSelectRef} {...params} label={label} variant={variant} />;
            }}
            fullWidth
            value={value}
            options={options}
            disabled={disabled}
            onChange={(event, value) => onChange(value)}
         />
      </Mui.Box>
   );
}

export default Select;
