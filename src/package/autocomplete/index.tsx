/** @format */

import * as React from 'react';
import { observer } from 'mobx-react';
import { List, ListItem, makeStyles, Paper, Popper, TextField, TextFieldProps, Typography } from '@material-ui/core';
import { makeAutoObservable, runInAction } from 'mobx';

type HtmlDivProps = React.DetailedHTMLProps<
   React.HtmlHTMLAttributes<HTMLDivElement>, HTMLDivElement
>;

const useStyles = makeStyles(() => ({
   popper: {
      zIndex: 9999,
      maxHeight: '27em',
      overflowY: 'auto'
   },
   focused: {
      fontWeight: 'bold'
   }
}));

export interface AutocompleteProps<T> extends Omit<HtmlDivProps, 'onChange'> {
   label?: string;
   options?: T[];
   selected: T | undefined;
   onChange?: (selected: T | undefined) => void;

   getLabel: (entry: T) => string;
   getKey?: (entry: T) => string;
   hasMatch?: (entry: T, filter: string) => boolean;

   textProps?: Omit<TextFieldProps, 'value' | 'onChange' | 'label'>;
}

class State<T> {
   selected: T | undefined;
   filter: string | false = false;
   getLabel: (entry: T) => string;
   hasMatch: (entry: T, filter: string) => boolean;
   focusedEntry: T | false = false;
   closed = false;

   constructor(private props: AutocompleteProps<T>) {
      makeAutoObservable(this);

      this.selected = props.selected;
      this.getLabel = props.getLabel;
      this.hasMatch = props.hasMatch ||
         ((entry, filter) => defaultMatcher(this.getLabel(entry),filter));
   }

   setSelected(entry: T | undefined) {
      this.selected = entry;
      this.filter = false;
      this.focusedEntry = false;
      this.closed = false;
      if(this.props.onChange) {
         this.props.onChange(this.selected);
      }
   }

   setFilter(filter: string | false) {
      this.filter = filter;
      this.focusedEntry = false;
      this.closed = false;
   }

   get filteredOptions() {
      let filteredOptions = this.props.options;
      if(filteredOptions && this.filter) {
         let filter = this.filter;
         filteredOptions = filteredOptions.filter(p => this.hasMatch(p, filter));
         // eslint-disable-next-line
         if(!filteredOptions.find(p => p == this.focusedEntry)) {
            // focus not existing
            this.focusedEntry = false;
         }
      }
      return filteredOptions;
   }

   handleBlur() {
      this.filter = false;
      this.focusedEntry = false;
      this.closed = false;
   }

   handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>, listElement: HTMLUListElement | null) {
      switch(event.key) {
         case 'Escape':
            this.handleBlur();
            break;

         case 'Backspace':
            if(!this.filter && this.selected) {
               event.stopPropagation();

               this.setSelected(undefined);
            }
            break;

         case 'Enter':
            if(this.focusedEntry !== false) {
               event.preventDefault();
               // Update the selection
               this.setSelected(this.focusedEntry);
            } else if(this.filteredOptions && this.filter) {
               let entry = this.filteredOptions.find(p => this.getLabel(p) === this.filter);
               if(!entry && this.filteredOptions.length === 1) {
                  entry = this.filteredOptions[0];
               }
               if(entry) {
                  // Select now
                  this.setSelected(entry);
               }
            }
            break;

         case 'ArrowUp':
         case 'ArrowDown':
            event.preventDefault();
            runInAction(() => {
               if(this.closed && event.key === 'ArrowDown') {
                  this.closed = false;
               }
               if(!this.filteredOptions || this.filteredOptions.length === 0) {
                  return;
               }
               let index = -1;
               if(this.focusedEntry === false) {
                  index = 0;
               } else {
                  index = this.filteredOptions.findIndex(p => p === this.focusedEntry);
                  index = index !== -1 ? index + (event.key === "ArrowDown" ? 1 : -1) : index;
               }
               if(index >= 0 && index < this.filteredOptions.length) {
                  this.focusedEntry = this.filteredOptions[index];
                  // Try to scroll into view
                  if(listElement && listElement.children[index]) {
                     listElement.children[index].scrollIntoView({
                        block: 'nearest'
                     });
                  }
               } else if(index === -1 && this.focusedEntry) {
                  this.closed = true;
                  this.focusedEntry = false;
               }
            });
            break;
      }
   }
}

function defaultMatcher(value: string, filter: string) {
   return value.toLocaleLowerCase().includes(filter.toLocaleLowerCase());
}

export function typedAutocomplete<T>() {
   return observer(({children, ...props}: React.PropsWithChildren<AutocompleteProps<T>>) => {
      const styles = useStyles(props);
      const [state] = React.useState(new State<T>(props)); 
      const textAnchor = React.useRef<HTMLInputElement>(null);
      const listElement = React.useRef<HTMLUListElement>(null);
      const {
         label,
         options,
         selected,
         onChange,
         getLabel,
         getKey = getLabel,
         hasMatch,
         textProps,
         
         ...divProps
      } = props;
      return (
         <div {...divProps}>
            <TextField {...textProps}
               ref={textAnchor}
               label={label}
               value={state.filter !== false 
                  ? state.filter 
                  : (state.selected ? getLabel(state.selected) : '')}
               onChange={(event) => state.setFilter(event.target.value)}
               onKeyDown={(event) => state.handleKeyDown(event, listElement.current)}
               onBlur={() => state.handleBlur()}
               />
            <Popper
               open={!!state.filter && !!textAnchor.current && !state.closed}
               anchorEl={textAnchor.current}
               placement="bottom-start"
               className={styles.popper}
               >
                  <Paper elevation={8}>
                     {state.filteredOptions ? (
                        <List ref={listElement}>
                           {state.filteredOptions.map(entry => (
                              <ListItem 
                                 button 
                                 className="autocomplete-item"
                                 autoFocus={false}
                                 selected={entry === state.focusedEntry}
                                 onClick={() => state.setSelected(entry)}
                                 key={getKey(entry)}
                              >
                                 {getLabel(entry)}
                              </ListItem>
                           ))}
                        </List>
                     ) : (
                        <Typography>No elements!</Typography>
                     )}
                  </Paper>
               </Popper>
         </div>
      );
   });
}

const Autocomplete = typedAutocomplete<string>();

export default Autocomplete;