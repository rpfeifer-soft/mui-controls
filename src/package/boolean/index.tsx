/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import InputRef from "../InputRef";
import { ICtrl, IRefCtrl, noChange } from "../types";
import { genericHook } from "../genericHook";

// Trick the linter
const memoize = React.useMemo;

export class RefBoolean implements IRefCtrl {
   // The input control class
   private inputRef: InputRef = new InputRef();

   focus() {
      this.inputRef.focus();
   }

   select() {
      this.inputRef.focus();
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

export const useRefBoolean = () => React.useRef(new RefBoolean());

export interface InputBooleanProps extends ICtrl<boolean> {
   refCtrl?: React.MutableRefObject<RefBoolean>;
   type?: "checkbox" | "switch" | "radio";

   // Allow to overload boolean field props
   labelPlacement?: Mui.FormControlLabelProps["labelPlacement"] | "front";

   className?: Mui.CheckboxProps["className"];
   color?: Mui.CheckboxProps["color"];
   sx?: Mui.CheckboxProps["sx"];

   // Allow to overload box props
   boxProps?: Mui.BoxProps;
}

function InputBoolean(props: InputBooleanProps) {
   // The props
   const {
      // ICtrl
      label,
      value,
      readOnly = false,
      disabled = false,
      required = true,
      autoFocus = false,
      onChange = noChange,
      // Boolean
      type = "checkbox",
      className,
      labelPlacement,
      color,
      sx,
      refCtrl: propsRefBoolean,
      // Box
      boxProps,
   } = props;

   // The state
   const textRef = useRefBoolean();
   const handleRefBoolean = textRef.current.useHandler();

   // Allow the caller to use the select functions
   if (propsRefBoolean) {
      propsRefBoolean.current = textRef.current;
   }

   const changeValue = React.useCallback<Required<Mui.FormControlLabelProps>["onChange"]>(
      (event, checked) => {
         if (!readOnly) {
            if (type === "radio") {
               onChange(true);
            } else if (required || type === "checkbox") {
               onChange(checked);
            } else {
               onChange(value === true ? null : value === false ? true : false);
            }
         }
      },
      [onChange, readOnly, required, value, type]
   );

   const control = React.useMemo(
      () =>
         type === "switch" ? (
            <Mui.Switch
               checked={value !== null ? value : false}
               color={color}
               readOnly={readOnly}
               required={required}
               autoFocus={autoFocus}
               onChange={changeValue}
               inputRef={handleRefBoolean}
               disabled={disabled}
               sx={sx}
            />
         ) : type === "radio" ? (
            <Mui.Radio
               checked={value !== null ? value : false}
               color={color}
               readOnly={readOnly}
               required={required}
               autoFocus={autoFocus}
               onChange={changeValue}
               inputRef={handleRefBoolean}
               disabled={disabled}
               sx={sx}
            />
         ) : (
            <Mui.Checkbox
               checked={value !== null ? value : false}
               color={color}
               indeterminate={value === null}
               readOnly={readOnly}
               required={required}
               autoFocus={autoFocus}
               onChange={changeValue}
               inputRef={handleRefBoolean}
               disabled={disabled}
               sx={sx}
            />
         ),
      [type, autoFocus, changeValue, color, disabled, handleRefBoolean, readOnly, required, sx, value]
   );

   // The markup
   return (
      <Mui.Box {...boxProps}>
         <Mui.FormControlLabel
            className={className}
            control={control}
            sx={{
               width: labelPlacement === "start" || labelPlacement === "front" ? "calc(100% + 11px)" : "100%",
               marginLeft: labelPlacement !== "end" ? 0 : undefined,
               justifyContent: labelPlacement === "start" ? "space-between" : undefined,
            }}
            label={label}
            labelPlacement={labelPlacement === "front" ? "start" : labelPlacement}
         />
      </Mui.Box>
   );
}

export default InputBoolean;

// Allow to use hooks
export const useInputBoolean = genericHook(InputBoolean, useRefBoolean);
