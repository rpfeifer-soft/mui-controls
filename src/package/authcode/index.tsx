/** @format */

import * as React from "react";
import { Box, BoxProps, Input, Paper, useTheme } from "@material-ui/core";
import InputRef from "../InputRef";
import { css } from "@emotion/css";
import clsx from "clsx";

export class AuthCodeRef {
   private inputRef: InputRef;

   onSelect?: (selected: boolean) => void;

   constructor() {
      this.inputRef = new InputRef();
   }

   set(input: HTMLInputElement) {
      this.inputRef.set(input);
   }

   focus() {
      this.inputRef.focusEnd();

      if (this.onSelect) {
         this.onSelect(false);
      }
   }

   select() {
      this.inputRef.focusAll();

      if (this.onSelect) {
         this.onSelect(true);
      }
   }
}

export interface AuthCodeProps extends Omit<BoxProps, "onChange" | "onSubmit"> {
   autoFocus?: boolean;
   value: string;
   authCodeRef?: AuthCodeRef;
   onChange?: (value: string) => void;
   onSubmit?: (value: string) => void;
}

const AuthCode = (props: AuthCodeProps) => {
   // The props
   const { autoFocus, value: initValue, authCodeRef: initAuthCodeRef, onChange, onSubmit, ...boxProps } = props;

   // Work with real values
   const toValue = (text: string) => text.replace(/\D/g, "").slice(0, 6);

   // The state
   const [authCodeRef, setAuthCodeRef] = React.useState(initAuthCodeRef || new AuthCodeRef());
   const [value, setValue] = React.useState(toValue(initValue));
   const [selected, setSelected] = React.useState(false);
   const theme = useTheme();

   // The hooks
   React.useEffect(() => {
      const newValue = toValue(initValue);
      // Update the state
      setValue(newValue);
      // Notify the parent (on wrong format)
      if (initValue !== newValue && onChange) {
         onChange(newValue);
      }
   }, [initValue, onChange]);

   React.useEffect(() => {
      if (initAuthCodeRef) {
         setAuthCodeRef(initAuthCodeRef);
         // We have to be notified, if the selection changes from outside
         initAuthCodeRef.onSelect = (selected) => setSelected(selected);
      }
   }, [initAuthCodeRef]);

   // The functions
   const changeValue = (value: string) => {
      const newValue = toValue(value);
      setValue(newValue);

      if (onChange) {
         onChange(newValue);
      }
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
            if (value.length === 6 && onSubmit) {
               onSubmit(value);
            }
            break;
      }
      if (event.key !== "Tab") {
         event.preventDefault();
      }
   };
   const mountInput = (input: HTMLInputElement) => {
      if (authCodeRef) {
         authCodeRef.set(input);
      }
   };

   // The markup
   return (
      <Box {...boxProps}>
         <Input
            inputRef={mountInput}
            type="tel"
            autoFocus={autoFocus}
            value={value}
            onChange={(event) => changeValue(event.target.value)}
            onKeyDown={(event) => handleKeyDown(event)}
            className={css({
               position: "absolute",
               opacity: 0,
               left: -1000,
               "&.Mui-focused + .box .digit": {
                  color: theme.palette.primary.main,
               },
               "&.Mui-focused + .box .selected.digit": {
                  borderColor: theme.palette.primary.main,
               },
               "&.Mui-focused + .box .last.digit::after": {
                  content: '"_"',
                  display: "inline-block",
                  color: theme.palette.primary.main,
               },
            })}
         />
         <Box
            onClick={() => authCodeRef.focus()}
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
               <Box key={index}>
                  <Paper
                     variant="outlined"
                     className={clsx("digit", {
                        last: value.length === index,
                        selected: value.length === index || (selected && index < value.length),
                     })}
                     sx={{ textAlign: "center", boxShadow: "0 0 1px #888 inset" }}
                  >
                     {value.charAt(index) ||
                        (value.length === index ? <span className={`cursor`}>&#8203;</span> : <span>&nbsp;</span>)}
                  </Paper>
               </Box>
            ))}
         </Box>
      </Box>
   );
};

export default AuthCode;
