/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { css } from "@emotion/css";
import InputRef from "../InputRef";
import clsx from "clsx";

type DSetSelected = (selected: boolean) => void;

// Trick the linter
const memoize = React.useMemo;
const noOp = (value: string) => {};

class AuthCodeRef {
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

export const useAuthCodeRef = () => React.useRef(new AuthCodeRef());

export interface AuthCodeProps extends Omit<Mui.BoxProps, "onChange" | "onSubmit"> {
   value: string;

   autoFocus?: boolean;
   authCodeRef?: React.MutableRefObject<AuthCodeRef>;

   onChange?: (value: string) => void;
   onSubmit?: (value: string) => void;
}

const AuthCode = (props: AuthCodeProps) => {
   // The props
   const {
      autoFocus = false,
      value: propsValue,
      authCodeRef: propsAuthCodeRef,
      onChange = noOp,
      onSubmit = noOp,
      ...boxProps
   } = props;

   // Work with real values
   const toValue = (text: string) => text.replace(/\D/g, "").slice(0, 6);

   // The state
   const theme = Mui.useTheme();
   const [value, setValue] = React.useState(toValue(propsValue));
   const [selected, setSelected] = React.useState(false);
   const authCodeRef = useAuthCodeRef();
   const handleAuthCodeRef = authCodeRef.current.useHandler(setSelected);

   // Allow the caller to use the authcode functions
   if (propsAuthCodeRef) {
      propsAuthCodeRef.current = authCodeRef.current;
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

   // The markup
   return (
      <Mui.Box
         {...boxProps}
         className={css({
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
         })}
      >
         <Mui.Input
            inputRef={handleAuthCodeRef}
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
            onClick={() => authCodeRef.current.focus()}
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

export default AuthCode;
