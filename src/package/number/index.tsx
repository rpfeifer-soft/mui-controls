/** @format */

import * as React from "react";
import { ICtrl, noChange } from "../types";
import { genericHook } from "../genericHook";
import InputText, { InputTextProps, useRefText } from "../text";

export const useRefNumber = useRefText;

export interface InputNumberProps extends Omit<InputTextProps, "value" | "onChange">, ICtrl<number> {}

function InputNumber(props: InputNumberProps) {
   // The props
   const {
      // ICtrl
      value: propsValue,
      onChange = noChange,
      // InputText
      required,
      ...inputProps
   } = props;

   const [value, setValue] = React.useState(propsValue ? String(propsValue) : null);
   const [auto, setAuto] = React.useState<number | null>(null);

   const changeValue = React.useCallback(
      (text: string | null) => {
         if (text === "-") {
            setValue(text);
            return;
         }
         if (!isNaN(Number(text))) {
            if (text && Number(text) === 0 && text.match(/^[-0]/)) {
               // Do not convert, or we lose the -
               setValue(text);
               return;
            }
            const newValue = text ? Number(text) : null;
            setValue(text);
            setAuto(newValue);
            onChange(newValue);
         }
      },
      [onChange]
   );

   React.useEffect(() => {
      if (!propsValue || auto !== propsValue) {
         const newValue = propsValue ? Number(propsValue) : null;
         setValue(newValue ? String(newValue) : null);
         setAuto(newValue);
         onChange(newValue);
      }
   }, [propsValue, auto, onChange]);

   const onBlur = React.useCallback(() => {
      setValue(propsValue ? String(propsValue) : null);
   }, [propsValue]);

   // The markup
   return <InputText {...inputProps} required={required} value={value} onChange={changeValue} onBlur={onBlur} />;
}

export default InputNumber;

// Allow to use hooks
export const useInputNumber = genericHook(InputNumber, useRefText);
