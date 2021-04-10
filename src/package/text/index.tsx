/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import InputRef from "../InputRef";
import { HookOptions, ICtrl, noChange } from "../types";

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
   refText?: React.MutableRefObject<RefText>;

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
interface InputTextHookProps extends Omit<InputTextProps, "value" | "label" | "onChange" | "refText"> {}

export function useInputText(initValue: string | null, initLabel?: string, options?: HookOptions) {
   const [value, setValue] = React.useState(initValue);
   const [label, setLabel] = React.useState(initLabel);
   const refText = useRefText();

   const [state] = React.useState({
      // Internal members
      refText,
      // Access values
      value,
      label,
      // Access functions
      setValue,
      setLabel,
      onChange: (value: string | null) => value,
      focus: () => refText.current.focus(),
      select: () => refText.current.select(),
      // The control
      Box: (undefined as unknown) as (props: InputTextHookProps) => JSX.Element,
   });

   // Update the volatile values
   state.value = options && options.fixValue ? initValue : value;
   state.label = options && options.fixLabel ? initLabel : label;

   // We have to create the handlers here
   const onChange = React.useCallback(
      (value) => {
         state.setValue(state.onChange(value));
      },
      [state]
   );

   // Allow to create the element
   state.Box = React.useCallback(
      (props: InputTextHookProps) => {
         const inputTextProps = {
            ...props,
            // Our props are priorized
            value: state.value,
            label: state.label,
            refText: state.refText,
            onChange: onChange,
         };
         return <InputText {...inputTextProps} />;
      },
      [onChange, state]
   );
   return state as Omit<typeof state, "refText">;
}
