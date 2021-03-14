/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import InputRef from "../InputRef";

function noChange<T>(value: T | null) {}
function noOpen() {}
function noGroup<T>(value: T) {
   return "";
}

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
   options: T[];

   label?: string;
   value?: T | null;
   variant?: Mui.TextFieldProps["variant"];
   disabled?: boolean;
   loading?: boolean;
   autoFocus?: boolean;
   selectRef?: React.MutableRefObject<SelectRef>;

   onChange?: (value: T | null) => void;
   onOpen?: () => void;
   groupBy?: (value: T) => string;
}

function Select<T>(props: SelectProps<T>) {
   // The props
   const {
      label,
      value = null,
      variant,
      options,
      disabled = false,
      loading = false,
      autoFocus = false,
      selectRef: propsSelectRef,
      onChange = noChange,
      onOpen = noOpen,
      groupBy = noGroup,
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
               return (
                  <Mui.TextField
                     inputRef={handleSelectRef}
                     {...params}
                     autoFocus={autoFocus}
                     label={label}
                     variant={variant}
                  />
               );
            }}
            fullWidth
            value={value}
            options={options}
            groupBy={groupBy}
            loading={loading}
            disabled={disabled}
            onChange={(event, value) => onChange(value)}
            onOpen={() => onOpen()}
         />
      </Mui.Box>
   );
}

export default Select;
