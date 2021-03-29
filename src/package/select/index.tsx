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

export interface Option {
   label: string;
}

export const useSelectRef = () => React.useRef(new SelectRef());

export interface SelectProps<T extends Option> extends Omit<Mui.BoxProps, "onChange"> {
   options: T[];

   label?: string;
   value?: T | null;
   variant?: Mui.TextFieldProps["variant"];
   onInputChange?: Mui.TextFieldProps["onChange"];
   disabled?: boolean;
   readOnly?: boolean;
   required?: boolean;
   loading?: boolean;
   autoFocus?: boolean;
   noFilter?: boolean;
   selectRef?: React.MutableRefObject<SelectRef>;

   onChange?: (value: T | null) => void;
   onOpen?: () => void;
   groupBy?: (value: T) => string;
}

function Select<T extends Option>(props: SelectProps<T>) {
   // The props
   const {
      label,
      value = null,
      variant,
      onInputChange,
      options,
      disabled = false,
      readOnly = false,
      required = false,
      loading = false,
      autoFocus = false,
      noFilter = false,
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

   const renderInput = React.useMemo(() => {
      return (params: Mui.TextFieldProps) => {
         return (
            <Mui.TextField
               inputRef={handleSelectRef}
               {...params}
               InputProps={{
                  ...params.InputProps,
                  endAdornment: !readOnly && params.InputProps ? params.InputProps.endAdornment : undefined,
                  readOnly,
               }}
               onChange={onInputChange}
               autoFocus={autoFocus}
               label={label}
               variant={variant}
            />
         );
      };
   }, [autoFocus, handleSelectRef, label, readOnly, variant, onInputChange]);

   // The markup
   return (
      <Mui.Box {...boxProps}>
         <Mui.Autocomplete
            renderInput={renderInput}
            fullWidth
            value={value}
            options={options}
            filterOptions={noFilter ? (option) => options : undefined}
            getOptionLabel={(option) => option.label}
            getOptionSelected={(option, value) => option.label === value.label}
            groupBy={groupBy}
            loading={loading}
            disabled={disabled}
            disableClearable={readOnly || required}
            openOnFocus={false}
            onChange={(event, value) => onChange(value)}
            onOpen={() => onOpen()}
            sx={{
               pointerEvents: readOnly ? "none" : undefined,
            }}
         />
      </Mui.Box>
   );
}

export default Select;
