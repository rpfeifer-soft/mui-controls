/** @format */

import * as React from "react";
import { ICtrl, noChange } from "../types";
import { genericHook } from "../genericHook";
import InputText, { InputTextProps, useRefText } from "../text";
import { useUIContext } from "../UIContext";

export const useRefNumber = useRefText;

export interface InputNumberProps extends Omit<InputTextProps, "value" | "onChange">, ICtrl<number> {}

function InputNumber(props: InputNumberProps) {
   const context = useUIContext();
   // The props
   const {
      // ICtrl
      value: propsValue,
      onChange = noChange,
      // InputText
      required,
      ...inputProps
   } = props;

   const [value, setValue] = React.useState(propsValue ? context.formatNumber(propsValue) : null);
   const [auto, setAuto] = React.useState<number | null>(null);

   const changeValue = React.useCallback(
      (text: string | null) => {
         if (text && text.match(/[.,][.,]/g)) {
            return;
         }
         if (text === "-") {
            setValue(text);
            return;
         }
         if (!text || !isNaN(context.parseNumber(text))) {
            if (text && context.parseNumber(text) === 0 && text.match(/^[-0]/)) {
               // Do not convert, or we lose the -
               setValue(text);
               return;
            }
            const newValue = text ? context.parseNumber(text) : null;
            setValue(text);
            setAuto(newValue);
            onChange(newValue);
         }
      },
      [onChange, context]
   );

   React.useEffect(() => {
      if (!propsValue || auto !== propsValue) {
         setValue(propsValue ? context.formatNumber(propsValue) : null);
         setAuto(propsValue);
         onChange(propsValue);
      }
   }, [propsValue, auto, onChange, context]);

   const onBlur = React.useCallback(() => {
      setValue(propsValue ? context.formatNumber(propsValue) : null);
   }, [propsValue, context]);

   // The markup
   return <InputText {...inputProps} required={required} value={value} onChange={changeValue} onBlur={onBlur} />;
}

export default InputNumber;

// Allow to use hooks
export const useInputNumber = genericHook(InputNumber, useRefText);
