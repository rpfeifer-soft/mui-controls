/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import InputRef from "../InputRef";
import { ICtrl, noChange } from "../types";

function noOpen() {}
function noGroup<T>(value: T) {
   return "";
}

// Trick the linter
const memoize = React.useMemo;

class RefSelect {
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

export interface IOption {
   label: string;
}

function getOptionLabel(option: IOption) {
   return option.label;
}

export const useRefSelect = () => React.useRef(new RefSelect());

export interface InputSelectProps<T extends IOption> extends ICtrl<T> {
   options: T[];

   variant?: Mui.TextFieldProps["variant"];
   onInputChange?: Mui.TextFieldProps["onChange"];
   loading?: boolean;
   refSelect?: React.MutableRefObject<RefSelect>;

   onOpen?: () => void;
   filterOptions?: (options: T[], inputValue: string) => T[];
   groupBy?: (value: T) => string;
   getLabel?: (value: T) => string;
   getSelected?: (option: T, value: T) => boolean;

   boxProps?: Mui.BoxProps;
}

function InputSelect<T extends IOption>(props: InputSelectProps<T>) {
   // The props
   const {
      // ICtrl
      label,
      value = null,
      disabled = false,
      readOnly = false,
      required = false,
      autoFocus = false,
      onChange = noChange,
      // Select
      options,
      variant,
      onInputChange,
      loading = false,
      refSelect: propsRefSelect,
      onOpen = noOpen,
      filterOptions,
      groupBy = noGroup,
      getLabel = getOptionLabel,
      getSelected,
      // Box
      boxProps,
   } = props;

   // The state
   const selectRef = useRefSelect();
   const handleRefSelect = selectRef.current.useHandler();

   // Allow the caller to use the select functions
   if (propsRefSelect) {
      propsRefSelect.current = selectRef.current;
   }

   const renderInput = React.useMemo(() => {
      return (params: Mui.TextFieldProps) => {
         return (
            <Mui.TextField
               inputRef={handleRefSelect}
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
   }, [autoFocus, handleRefSelect, label, readOnly, variant, onInputChange]);

   const getOptionSelected = React.useMemo(
      () => (getSelected ? getSelected : (option: T, value: T) => getLabel(option) === getLabel(value)),
      [getLabel, getSelected]
   );

   // The markup
   return (
      <Mui.Box {...boxProps}>
         <Mui.Autocomplete
            renderInput={renderInput}
            fullWidth
            value={value}
            options={options}
            filterOptions={filterOptions ? (options, state) => filterOptions(options, state.inputValue) : undefined}
            getOptionLabel={getLabel}
            getOptionSelected={getOptionSelected}
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

export default InputSelect;
