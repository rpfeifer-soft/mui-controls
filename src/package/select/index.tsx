/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import InputRef from "../InputRef";
import { ICtrl, IRefCtrl, noChange } from "../types";
import { genericHook } from "../genericHook";

function noOpen() {}
function noGroup<T>(value: T) {
   return "";
}

// Trick the linter
const memoize = React.useMemo;

class RefSelect implements IRefCtrl {
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
   loading?: boolean;
   refCtrl?: React.MutableRefObject<RefSelect>;

   onOpen?: () => void;
   filterOptions?: (options: T[], inputValue: string) => T[];
   groupBy?: (value: T) => string;
   getLabel?: (value: T) => string;
   getSelected?: (option: T, value: T) => boolean;

   // Allow to overload text field props
   variant?: Mui.TextFieldProps["variant"] | "square";
   className?: Mui.TextFieldProps["className"];
   sx?: Mui.TextFieldProps["sx"];
   onInputChange?: Mui.TextFieldProps["onChange"];

   // Allow to overload box props
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
      loading = false,
      refCtrl: propsRefSelect,
      onOpen = noOpen,
      filterOptions,
      groupBy = noGroup,
      getLabel = getOptionLabel,
      getSelected,
      // Text
      variant,
      className,
      sx,
      onInputChange,
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
               className={className}
               sx={sx}
               inputRef={handleRefSelect}
               {...params}
               InputProps={{
                  ...params.InputProps,
                  endAdornment: !readOnly && params.InputProps ? params.InputProps.endAdornment : undefined,
                  readOnly,
                  sx:
                     variant === "square"
                        ? {
                             borderTopLeftRadius: 0,
                             borderTopRightRadius: 0,
                          }
                        : undefined,
               }}
               onChange={onInputChange}
               autoFocus={autoFocus}
               label={label}
               variant={variant === "square" ? "filled" : variant}
            />
         );
      };
   }, [autoFocus, handleRefSelect, className, sx, label, readOnly, variant, onInputChange]);

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

// Allow to use hooks (typescript does not support partial inference - so use function chaining)
export const useInputSelect = <T extends IOption>() =>
   genericHook<InputSelectProps<T>, RefSelect, T>(InputSelect, useRefSelect);
