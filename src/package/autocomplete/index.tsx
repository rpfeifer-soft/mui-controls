/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { observer } from "mobx-react";
import InputRef from "../InputRef";

type HtmlDivProps = React.DetailedHTMLProps<React.HtmlHTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const useStyles = Mui.makeStyles(() => ({
   popper: {
      zIndex: 9999,
      maxHeight: "27em",
      overflowY: "auto",
   },
}));

export interface AutocompleteProps<T> extends Omit<HtmlDivProps, "onChange"> {
   label?: string;
   variant?: "standard" | "outlined" | "filled";
   autoFocus?: boolean;
   required?: boolean;
   fullwidth?: boolean;
   disabled?: boolean;
   options?: T[];
   selected: T | undefined;
   noOptionsText?: string;
   inputRef?: InputRef;

   onChange?: (selected: T | undefined) => void;

   getLabel: (entry: T) => string;
   getKey?: (entry: T) => string;
   hasMatch?: (entry: T, filter: string) => boolean;

   textProps?: Omit<
      Mui.TextFieldProps,
      "value" | "onChange" | "label" | "autoFocus" | "fullwidth" | "disabled" | "required" | "variant"
   >;
}

function defaultMatcher(value: string, filter: string) {
   return value.toLocaleLowerCase().includes(filter.toLocaleLowerCase());
}

export function typedAutocomplete<T>() {
   return observer(({ children, ...props }: React.PropsWithChildren<AutocompleteProps<T>>) => {
      const styles = useStyles(props);
      const textAnchor = React.useRef<HTMLInputElement>(null);
      const listElement = React.useRef<HTMLUListElement>(null);
      const blurTimer = React.useRef<any>();

      const {
         label,
         options,
         variant,
         selected: initSelected,
         autoFocus,
         required,
         fullwidth,
         disabled,
         noOptionsText = "-",
         inputRef,
         onChange,
         getLabel,
         getKey = getLabel,
         hasMatch,
         textProps,

         ...divProps
      } = props;

      // State values
      const [selected, setSelected] = React.useState<T | undefined>(initSelected);
      const [filter, setFilter] = React.useState<string | false>(false);
      const [focusedEntry, setFocusedEntry] = React.useState<T | false>(false);
      const [closed, setClosed] = React.useState(false);

      if (blurTimer.current && initSelected) {
         clearTimeout(blurTimer.current);
         blurTimer.current = undefined;
      }
      // Init after selection change from outside
      if (selected !== initSelected) {
         setSelected(initSelected);
         setFilter(false);
         setFocusedEntry(false);
         setClosed(false);
      }

      // Memoized values
      const filteredOptions = React.useMemo(() => {
         let filteredOptions = options;
         if (filteredOptions && filter) {
            let currentFilter = filter;
            let currentHasMatch = hasMatch || ((p, q) => defaultMatcher(getLabel(p), q));
            filteredOptions = filteredOptions.filter((p) => currentHasMatch(p, currentFilter));
         }
         return filteredOptions;
      }, [filter, hasMatch, getLabel, options]);

      // Handlers
      const mountInput = (input: HTMLInputElement) => {
         if (inputRef) {
            inputRef.set(input);
         }
      };
      const changeSelected = (selected: T | undefined) => {
         setSelected(selected);
         setFilter(false);
         setFocusedEntry(false);
         setClosed(false);
         if (onChange) {
            onChange(selected);
         }
      };
      const changeFilter = (filter: string | false) => {
         setFilter(filter);
         setFocusedEntry(false);
         setClosed(false);
      };
      const handleBlur = () => {
         blurTimer.current = setTimeout(() => {
            setFilter(false);
            setFocusedEntry(false);
            setClosed(false);
         }, 250);
      };
      const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, listElement: HTMLUListElement | null) => {
         switch (event.key) {
            case "Escape":
               setFilter(false);
               setFocusedEntry(false);
               setClosed(false);
               break;

            case "Backspace":
               if (!filter && selected) {
                  event.stopPropagation();

                  changeSelected(undefined);
               }
               break;

            case "Enter":
               if (focusedEntry !== false) {
                  event.preventDefault();
                  // Update the selection
                  changeSelected(focusedEntry);
               } else if (filteredOptions && filter) {
                  let entry = filteredOptions.find((p) => getLabel(p) === filter);
                  if (!entry && filteredOptions.length === 1) {
                     entry = filteredOptions[0];
                  }
                  if (entry) {
                     // Select now
                     changeSelected(entry);
                  }
               }
               break;

            case "ArrowUp":
            case "ArrowDown":
               event.preventDefault();
               if (closed && event.key === "ArrowDown") {
                  setClosed(false);
               }
               if (!filteredOptions || filteredOptions.length === 0) {
                  return;
               }
               let index = -1;
               if (focusedEntry === false) {
                  index = 0;
               } else {
                  index = filteredOptions.findIndex((p) => p === focusedEntry);
                  index = index !== -1 ? index + (event.key === "ArrowDown" ? 1 : -1) : index;
               }
               if (index >= 0 && index < filteredOptions.length) {
                  setFocusedEntry(filteredOptions[index]);
                  // Try to scroll into view
                  if (listElement && listElement.children[index]) {
                     listElement.children[index].scrollIntoView({
                        block: "nearest",
                     });
                  }
               } else if (index === -1 && focusedEntry) {
                  setClosed(true);
                  setFocusedEntry(false);
               }
               break;
         }
      };

      return (
         <div {...divProps}>
            <Mui.TextField
               {...textProps}
               ref={textAnchor}
               inputRef={mountInput}
               label={label}
               variant={variant}
               required={required}
               fullWidth={fullwidth}
               disabled={disabled}
               value={filter !== false ? filter : selected ? getLabel(selected) : ""}
               onChange={(event) => changeFilter(event.target.value)}
               onKeyDown={(event) => handleKeyDown(event, listElement.current)}
               onBlur={handleBlur}
            />
            <Mui.Popper
               open={!!filter && !!textAnchor.current && !closed}
               anchorEl={textAnchor.current}
               placement="bottom-start"
               className={styles.popper}
               container={document.body}
            >
               <Mui.Paper variant="outlined">
                  <Mui.List ref={listElement}>
                     {filteredOptions && filteredOptions.length > 0 && options && options.length > 0 ? (
                        filteredOptions.map((entry) => (
                           <Mui.ListItem
                              button
                              className="autocomplete-item"
                              autoFocus={false}
                              selected={entry === focusedEntry}
                              onClick={() => changeSelected(entry)}
                              key={getKey(entry)}
                           >
                              {getLabel(entry)}
                           </Mui.ListItem>
                        ))
                     ) : (
                        <Mui.ListItem>{noOptionsText}</Mui.ListItem>
                     )}
                  </Mui.List>
               </Mui.Paper>
            </Mui.Popper>
         </div>
      );
   });
}

const Autocomplete = typedAutocomplete<string>();

export default Autocomplete;
