/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";

import { ICtrl, IRefCtrl } from "../types";
import InputRef from "../InputRef";
import { genericHook } from "../genericHook";
import { css } from "@emotion/css";

// Trick the linter
const memoize = React.useMemo;

export class RefSlider implements IRefCtrl {
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

export const useRefSlider = () => React.useRef(new RefSlider());

export interface InputSliderProps extends Omit<ICtrl<number>, "readOnly" | "required"> {
   type?: "Slider";
   refCtrl?: React.MutableRefObject<RefSlider>;

   // Allow to overload slider props
   marks?: Mui.SliderProps["marks"];
   min?: Mui.SliderProps["min"];
   max?: Mui.SliderProps["max"];
   scale?: Mui.SliderProps["scale"];
   step?: Mui.SliderProps["step"];
   track?: Mui.SliderProps["track"];
   valueLabelDisplay?: Mui.SliderProps["valueLabelDisplay"];

   // Allow to overload text props
   variant?: Mui.TextFieldProps["variant"] | "square";
   className?: Mui.TextFieldProps["className"];

   // Allow to overload box props
   boxProps?: Mui.BoxProps;
}

export interface InputRangeProps extends Omit<InputSliderProps, "value" | "type" | "onChange">, ICtrl<number[]> {
   type: "Range";

   disableSwap?: Mui.SliderProps["disableSwap"];
}

const InputSlider = (props: InputSliderProps | InputRangeProps) => {
   // The state
   const theme = Mui.useTheme();

   // The props
   const {
      // ICtrl
      label,
      value,
      disabled = false,
      autoFocus = false,
      // Slider
      marks,
      min,
      max,
      scale,
      step,
      track,
      valueLabelDisplay,
      refCtrl: propsRefSlider,
      // TextProps
      variant,
      className,
      // BoxProps
      boxProps,
   } = props;

   // The state
   const [focus, setFocus] = React.useState(false);
   const sliderRef = useRefSlider();
   const handleRefSlider = sliderRef.current.useHandler();

   // Allow the caller to use the select functions
   if (propsRefSlider) {
      propsRefSlider.current = sliderRef.current;
   }

   // sliderfunctions
   const changeValue = React.useCallback<Required<Mui.SliderProps>["onChange"]>(
      (event, value, activeThumb) => {
         if ((!props.type || props.type === "Slider") && props.onChange) {
            if (typeof value === "number") {
               props.onChange(value);
            } else {
               props.onChange(null);
            }
         }
         if (props.type === "Range" && props.onChange) {
            if (Array.isArray(value)) {
               props.onChange(value);
            } else {
               props.onChange(null);
            }
         }
      },
      [props]
   );

   const handleRefSpan = React.useCallback(
      (span: HTMLSpanElement) => {
         if (span) {
            let input = span.querySelector("input");
            if (input) {
               handleRefSlider(input);
               input.onfocus = () => setFocus(true);
               input.onblur = () => setFocus(false);
               if (autoFocus && sliderRef.current) {
                  sliderRef.current.focus();
               }
            }
         }
      },
      [handleRefSlider, sliderRef, autoFocus, setFocus]
   );

   const offset = variant === "filled" || variant === "square";
   const disableSwap = props.type === "Range" ? props.disableSwap : undefined;
   // The markup
   return (
      <Mui.Box
         {...boxProps}
         position="relative"
         className={css({
            "&:hover .MuiOutlinedInput-notchedOutline": {
               borderColor: focus ? undefined : theme.palette.getContrastText(theme.palette.background.default),
            },
            "&:hover .MuiInput-underline:before": {
               borderColor: focus ? undefined : theme.palette.getContrastText(theme.palette.background.default),
               borderWidth: focus ? undefined : 2,
            },
            "&:hover .MuiFilledInput-underline:before": {
               borderColor: focus ? undefined : theme.palette.getContrastText(theme.palette.background.default),
            },
            "&:hover .MuiFilledInput-underline": {
               backgroundColor: focus
                  ? undefined
                  : Mui.alpha(
                       theme.palette.getContrastText(theme.palette.background.default),
                       theme.palette.action.focusOpacity
                    ),
            },
         })}
      >
         <Mui.TextField
            fullWidth
            value=" "
            disabled={disabled}
            label={label}
            variant={variant === "square" ? "filled" : variant}
            InputProps={{
               readOnly: true,
               sx:
                  variant === "square"
                     ? {
                          borderTopLeftRadius: 0,
                          borderTopRightRadius: 0,
                       }
                     : undefined,
            }}
            className={css({
               pointerEvents: "none",
               "& .MuiInputLabel-root": {
                  color: focus ? theme.palette.primary.main : undefined,
               },
               "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: focus ? theme.palette.primary.main : undefined,
                  borderWidth: focus ? 2 : 1,
               },
               "& .MuiInput-underline:before": {
                  borderColor: focus ? theme.palette.primary.main : undefined,
                  borderWidth: focus ? 2 : 1,
               },
               "& .MuiFilledInput-underline:before": {
                  borderColor: focus ? theme.palette.primary.main : undefined,
                  borderWidth: focus ? 2 : 1,
               },
            })}
         />
         <Mui.Slider
            ref={handleRefSpan}
            value={value !== null ? value : 0}
            marks={marks}
            min={min}
            max={max}
            scale={scale}
            step={step}
            track={track}
            disableSwap={disableSwap}
            valueLabelDisplay={valueLabelDisplay}
            onChange={changeValue}
            disabled={disabled}
            className={css(className, {
               "& .MuiSlider-markLabel": {
                  top: variant === "standard" || offset ? "-8px" : "18px",
               },
            })}
            sx={{
               position: "absolute",
               left: 16,
               top: offset ? 24 : 16,
               right: 16,
               width: "auto",
               "&::after": {
                  display: "block",
                  content: '" "',
                  position: "absolute",
                  left: -16,
                  right: -16,
                  top: offset ? -24 : -16,
                  bottom: variant === "standard" || offset ? -4 : -12,
               },
            }}
         />
      </Mui.Box>
   );
};

export default InputSlider;

// Allow to use hooks
export const useInputSlider = genericHook<InputSliderProps, RefSlider, number>(InputSlider, useRefSlider);
export const useInputRange = genericHook<InputRangeProps, RefSlider, number[]>(InputSlider, useRefSlider);
