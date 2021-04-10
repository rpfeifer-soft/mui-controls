/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { css } from "@emotion/css";
import InputRef from "../InputRef";
import clsx from "clsx";
import { ICtrl, noChange } from "../types";

type DSetSelected = (selected: boolean) => void;

// Trick the linter
const memoize = React.useMemo;
const noOp = (value: string) => {};

class RefAuthCode {
   // The input control class
   private inputRef: InputRef = new InputRef();

   // Allow to set the selected state
   private setSelected: DSetSelected = (selected: boolean) => {};

   focus() {
      this.inputRef.focusEnd();
      this.setSelected(false);
   }

   select() {
      this.inputRef.focusAll();
      this.setSelected(true);
   }

   useHandler = (setSelected: DSetSelected) => {
      return memoize(() => {
         // Support selection
         this.setSelected = setSelected;
         // Register the input element
         return (input: HTMLInputElement) => {
            this.inputRef.set(input);
         };
      }, [setSelected]);
   };
}

export const useRefAuthCode = () => React.useRef(new RefAuthCode());

export interface InputAuthCodeProps extends Omit<ICtrl<string>, "label" | "readOnly" | "required"> {
   refAuthCode?: React.MutableRefObject<RefAuthCode>;

   onSubmit?: (value: string) => void;

   boxProps?: Mui.BoxProps;
}

const InputAuthCode = (props: InputAuthCodeProps) => {
   // The props
   const {
      // ICtrl
      value: propsValue,
      disabled = false,
      autoFocus = false,
      onChange = noChange,
      // AuthCode
      refAuthCode: propsRefAuthCode,
      onSubmit = noOp,
      // Box
      boxProps,
   } = props;

   // Work with real values
   const toValue = (text: string | null) => (text ? text.replace(/\D/g, "").slice(0, 6) : "");

   // The state
   const theme = Mui.useTheme();
   const [value, setValue] = React.useState(toValue(propsValue));
   const [selected, setSelected] = React.useState(false);
   const refAuthCode = useRefAuthCode();
   const handleRefAuthCode = refAuthCode.current.useHandler(setSelected);

   // Allow the caller to use the authcode functions
   if (propsRefAuthCode) {
      propsRefAuthCode.current = refAuthCode.current;
   }

   // The hooks
   React.useEffect(() => {
      const newValue = toValue(propsValue);
      // Update the state
      setValue(newValue);
      // Notify the parent (on wrong format)
      if (propsValue !== newValue) {
         onChange(newValue);
      }
   }, [propsValue, onChange]);

   // The functions
   const changeValue = (value: string) => {
      const newValue = toValue(value);
      setValue(newValue);
      onChange(newValue);
   };
   const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (disabled) {
         event.preventDefault();
         return;
      }
      switch (event.key) {
         case "0":
         case "1":
         case "2":
         case "3":
         case "4":
         case "5":
         case "6":
         case "7":
         case "8":
         case "9":
            changeValue((selected ? "" : value) + event.key);
            setSelected(false);
            break;

         case "Backspace":
            changeValue(selected ? "" : value.substring(0, value.length - 1));
            setSelected(false);
            break;

         case "Enter":
            if (value.length === 6) {
               onSubmit(value);
            }
            break;
      }
      if (event.key !== "Tab") {
         event.preventDefault();
      }
   };

   // Styles
   const focusCss = !disabled
      ? css({
           "&:focus-within .digit": {
              color: theme.palette.primary.main,
           },
           "&:focus-within .selected.digit": {
              borderColor: theme.palette.primary.main,
              backgroundColor: Mui.alpha(theme.palette.primary.light, 0.1),
           },
           "&:focus-within .last.digit::after": {
              content: '"_"',
              display: "inline-block",
              color: theme.palette.primary.main,
           },
        })
      : css({
           "& .digit": {
              color: theme.palette.grey["500"],
           },
        });

   // The markup
   return (
      <Mui.Box {...boxProps} className={focusCss}>
         <Mui.Input
            inputRef={handleRefAuthCode}
            type="tel"
            autoFocus={autoFocus}
            value={value}
            onChange={(event) => changeValue(event.target.value)}
            onKeyDown={(event) => handleKeyDown(event)}
            className={css({
               position: "absolute",
               opacity: 0,
               left: -1000,
            })}
         />
         <Mui.Box
            onClick={() => refAuthCode.current.focus()}
            className="box"
            sx={{
               display: "grid",
               gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
               gap: "8px",
               gridGap: "8px",
               fontSize: "1.4rem",
            }}
         >
            {[0, 1, 2, 3, 4, 5].map((index) => (
               <Mui.Box key={index}>
                  <Mui.Paper
                     variant="outlined"
                     className={clsx("digit", {
                        last: value.length === index,
                        selected: value.length === index || (selected && index < value.length),
                     })}
                     sx={{ textAlign: "center", boxShadow: "0 0 1px #888 inset" }}
                  >
                     {value.charAt(index) ||
                        (value.length === index ? <span className={`cursor`}>&#8203;</span> : <span>&nbsp;</span>)}
                  </Mui.Paper>
               </Mui.Box>
            ))}
         </Mui.Box>
      </Mui.Box>
   );
};

export default InputAuthCode;

// Allow to use hooks
interface InputAuthCodeHookProps extends Omit<InputAuthCodeProps, "value" | "label" | "onChange" | "refAuthCode"> {}

export function useInputAuthCode(initValue: string | null, initLabel?: string) {
   const [value, setValue] = React.useState(initValue);
   const [label, setLabel] = React.useState(initLabel);
   const refAuthCode = useRefAuthCode();

   const [state] = React.useState({
      // Internal members
      refAuthCode,
      // Access values
      value,
      label,
      // Access functions
      setValue,
      setLabel,
      onChange: (value: string | null) => value,
      focus: () => refAuthCode.current.focus(),
      select: () => refAuthCode.current.select(),
      // The control
      Box: (undefined as unknown) as (props: InputAuthCodeHookProps) => JSX.Element,
   });

   // Update the volatile values
   state.value = value;
   state.label = label;

   // We have to create the handlers here
   const onChange = React.useCallback(
      (value) => {
         state.setValue(state.onChange(value));
      },
      [state]
   );

   // Allow to create the element
   state.Box = React.useCallback(
      (props: InputAuthCodeHookProps) => {
         const inputTextProps = {
            ...props,
            // Our props are priorized
            value: state.value,
            label: state.label,
            refAuthCode: state.refAuthCode,
            onChange: onChange,
         };
         return <InputAuthCode {...inputTextProps} />;
      },
      [onChange, state]
   );
   return state as Omit<typeof state, "refAuthCode">;
}
