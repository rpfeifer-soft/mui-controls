/** @format */

import * as React from "react";
import { noChange } from "../types";
import { genericHook } from "../genericHook";
import InputText, { InputTextProps, useRefText } from "../text";
import { formatPhoneNumberDE } from "./PhoneTool";

const formatPhoneNumber = (text: string) => {
   const formatted = formatPhoneNumberDE(text);
   return formatted ? formatted : text;
};

export const useRefPhone = useRefText;

export interface InputPhoneProps extends InputTextProps {}

function InputPhone(props: InputPhoneProps) {
   // The props
   const {
      // ICtrl
      value: propsValue,
      onChange = noChange,
      // InputText
      required,
      ...inputProps
   } = props;

   const [value, setValue] = React.useState(propsValue);
   const [auto, setAuto] = React.useState<string | null>(null);

   const changeValue = React.useCallback(
      (text: string | null) => {
         if (!text || !text.match(/[^+\-0123456789() ]/g)) {
            const newValue = text ? formatPhoneNumber(text) : null;
            setValue(text);
            setAuto(newValue);
            onChange(newValue);
         }
      },
      [onChange]
   );

   React.useEffect(() => {
      if (!propsValue || auto !== propsValue) {
         const newValue = propsValue ? formatPhoneNumber(propsValue) : null;
         setValue(newValue);
         setAuto(newValue);
         onChange(newValue);
      }
   }, [propsValue, auto, onChange]);

   const onBlur = React.useCallback(() => {
      setValue(propsValue ? formatPhoneNumber(propsValue) : null);
   }, [propsValue]);

   // The markup
   return <InputText {...inputProps} required={required} value={value} onChange={changeValue} onBlur={onBlur} />;
}

export default InputPhone;

// Allow to use hooks
export const useInputPhone = genericHook(InputPhone, useRefText);
