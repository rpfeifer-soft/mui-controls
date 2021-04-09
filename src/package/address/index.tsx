/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { IAddress, ICtrl, noChange } from "../types";
import { useUIContext } from "../UIContext";

interface IState {
   current: string;
   options: IAddress[];
   searchFor: string;
   loading: boolean;
   open: boolean;
   selected: number;
}

function setOptions(state: IState, options: IAddress[]) {
   let selected = state.selected;
   if (selected >= 0) {
      // Check for valid selection
      if (options.length <= selected || options[selected].description !== state.options[selected].description) {
         selected = -1;
      }
   }
   return { ...state, options, loading: false, selected };
}

const ArrowDropDown = Mui.createSvgIcon(<path d="M7 10l5 5 5-5z"></path>, "ArrowDropDown");

export interface InputAddressProps extends ICtrl<IAddress> {
   variant?: Mui.TextFieldProps["variant"];

   requestDelay?: number;

   noOptionsText?: string;

   boxProps?: Mui.BoxProps;
}

const InputAddress = (props: InputAddressProps) => {
   // The props
   const {
      // ICtrl
      label,
      value,
      onChange = noChange,
      disabled,
      readOnly,
      required,
      autoFocus,
      // Address
      variant,
      requestDelay = 500,
      noOptionsText = "-",
      // Box
      boxProps,
   } = props;

   // The state
   const context = useUIContext();
   const [state, setState] = React.useState<IState>({
      current: value ? value.description : "",
      options: [],
      searchFor: "",
      loading: false,
      open: false,
      selected: -1,
   });

   React.useEffect(() => {
      setState((state) => ({ ...state, current: value ? value.description : "" }));
   }, [value]);

   React.useEffect(() => {
      if (!state.open) {
         // Only search when open or not cached
         return;
      }
      const cachedAnswer = context.cachedAddress(state.searchFor);
      if (cachedAnswer) {
         setState((state) => setOptions(state, cachedAnswer));
         return;
      }
      setState((state) => ({ ...state, loading: true }));

      // Start the delay
      const timer = setTimeout(async () => {
         const options = await context.searchAddress(state.searchFor);
         setState((state) => setOptions(state, options));
      }, requestDelay);
      // Return clean up function for delay
      return ((timerToClear: NodeJS.Timer) => () => {
         clearTimeout(timerToClear);
         setState((state) => ({ ...state, loading: false }));
      })(timer);
   }, [context, state.open, state.searchFor, requestDelay]);

   // The functions
   const change = React.useMemo(
      () => (newValue: IAddress | null) => {
         // This must change the newValue
         setTimeout(() => onChange(newValue), 0);
         setState((state) => ({
            ...state,
            selected: -1,
            current: newValue ? newValue.description : "",
            open: false,
         }));
      },
      [onChange]
   );

   const onInputChange = React.useMemo(
      () => (event: React.ChangeEvent<HTMLInputElement>) => {
         const newValue = event.target.value;
         setState((state) => {
            let options = state.options;
            if (value && !newValue && !required) {
               // This must change the newValue
               setTimeout(() => onChange(null), 0);
               options = [];
            }
            return {
               ...state,
               options,
               current: newValue,
               searchFor: newValue,
               open: newValue.length >= 4,
            };
         });
      },
      [required, onChange, value]
   );

   const onInputKeyDown = React.useMemo(
      () => (event: React.KeyboardEvent<HTMLInputElement>) => {
         setState((state) => {
            switch (event.key) {
               case "Escape":
                  if (state.open) {
                     event.preventDefault();
                     return { ...state, open: false };
                  }
                  break;

               case "Enter":
                  event.preventDefault();
                  if (state.open && state.selected >= 0 && state.options.length > state.selected) {
                     const option = state.options[state.selected];
                     // Inform the parent
                     if (onChange) {
                        setTimeout(() => onChange(option), 0);
                     }
                     return {
                        ...state,
                        selected: -1,
                        open: false,
                        current: option.description,
                     };
                  }
                  break;

               case "ArrowUp":
                  if (state.open) {
                     event.preventDefault();
                     return {
                        ...state,
                        selected: Math.max(state.selected - 1, 0),
                     };
                  }
                  break;

               case "ArrowDown":
                  if (state.open) {
                     event.preventDefault();
                     return {
                        ...state,
                        selected: Math.min(state.selected + 1, state.options.length - 1),
                     };
                  } else if (state.current.length >= 4) {
                     return {
                        ...state,
                        open: true,
                        selected: state.options.findIndex((option) => option.description === state.current),
                     };
                  }
                  break;
            }
            return state;
         });
      },
      [onChange]
   );

   const onInputBlur = React.useMemo(
      () => (event: React.FocusEvent<HTMLInputElement>) => {
         // Leave the current value
         const clickedItem = event.relatedTarget;
         if (clickedItem && clickedItem instanceof HTMLElement && clickedItem.classList.contains("dropdown")) {
            // Do not change the state
            return;
         }
         if (clickedItem && clickedItem instanceof HTMLElement && clickedItem.classList.contains("option")) {
            // Click to one of our childs - regain focus
            setTimeout(() => event.target.focus(), 0);
            return;
         }
         setState((state) => ({
            ...state,
            open: false,
            current: value ? value.description : "",
         }));
      },
      [value]
   );

   const onDropDown = React.useMemo(
      () => (event: React.MouseEvent<HTMLElement>) => {
         setState((state) => ({
            ...state,
            open: state.open ? false : state.options.length > 0,
         }));
      },
      []
   );

   // The markup
   return (
      <Mui.Box {...boxProps} sx={{ position: "relative" }}>
         <Mui.TextField
            label={label}
            required={required}
            disabled={disabled}
            variant={variant}
            InputProps={{
               readOnly,
               endAdornment: (
                  <Mui.IconButton
                     size="small"
                     className="dropdown"
                     disabled={!state.open && !state.options.length}
                     sx={{
                        transform: state.open ? "rotate(180deg)" : undefined,
                        marginRight: -1,
                     }}
                     onClick={onDropDown}
                  >
                     <ArrowDropDown />
                  </Mui.IconButton>
               ),
            }}
            autoFocus={autoFocus}
            value={state.current}
            onChange={onInputChange}
            onKeyDown={onInputKeyDown}
            onBlur={onInputBlur}
            fullWidth
         />
         {state.open && (
            <Mui.Paper sx={{ position: "absolute", left: 0, right: 0, zIndex: 9999 }}>
               {state.loading && <Mui.LinearProgress />}
               {!state.loading && !state.options.length && noOptionsText}
               {!state.loading && Boolean(state.options.length) && (
                  <Mui.List>
                     {state.options.map((option, index) => (
                        <Mui.ListItem
                           button
                           className="option"
                           selected={state.selected === index}
                           onClick={() => change(option)}
                           key={option.description}
                        >
                           {option.description}
                        </Mui.ListItem>
                     ))}
                  </Mui.List>
               )}
            </Mui.Paper>
         )}
      </Mui.Box>
   );
};

export default InputAddress;
