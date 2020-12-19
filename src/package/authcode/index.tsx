/** @format */

import * as React from 'react';
import { observer } from 'mobx-react';
import { makeStyles, Paper, TextField } from '@material-ui/core';
import InputRef from '../InputRef';

type HtmlDivProps = React.DetailedHTMLProps<
   React.HtmlHTMLAttributes<HTMLDivElement>, HTMLDivElement
>;

const useStyles = makeStyles(() => ({
   input: {
      position: 'absolute',
      opacity: 0,
      left: -1000
   },
   container: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
      gap: '8px',
      gridGap: '8px',
      fontSize: '1.4rem'
   }, 
   item: {
      textAlign: 'center'
   }
}));

export interface AuthCodeProps extends Omit<HtmlDivProps, 'onChange' | 'onSubmit'> {
   autoFocus?: boolean;
   value: string;
   inputRef?: InputRef;
   onChange?: (value: string) => void;
   onSubmit?: (value: string) => void;
}

const AuthCode = observer(({children, ...props}: React.PropsWithChildren<AuthCodeProps>) => {
   const styles = useStyles(props);
   
   const {
      autoFocus,
      value: initValue,
      inputRef = new InputRef(),
      onChange,
      onSubmit,
      
      ...divProps
   } = props;

   // State values
   const [value, setValue] = React.useState(initValue);

   // Init after selection change from outside
   if(value !== initValue) {
      setValue(initValue);
   }

   // Handlers
   const changeValue = (value: string) => {
      const newValue = value.replace(/\D/g, '').slice(0, 6);
      setValue(newValue);

      if(onChange) {
         onChange(newValue);
      }
   }
   const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      switch(event.key) {
         case 'Enter':
            if(value.length === 6 &&
               onSubmit) {
               onSubmit(value);
            }
            break;
      }
   }
   const mountInput = (input: HTMLInputElement) => {
      if(inputRef) {
         inputRef.set(input);
      }
   }
   return (
      <div {...divProps}>
         <TextField 
            inputRef={mountInput}
            autoFocus={autoFocus}
            className={styles.input}
            value={value}
            onChange={(event) => changeValue(event.target.value)}
            onKeyDown={handleKeyDown}
            />
         <div className={styles.container} onClick={() => inputRef.focusEnd()}>
            {[0,1,2,3,4,5].map(index => (
               <div key={index}>
                  <Paper className={styles.item} variant="outlined">
                     {value.charAt(index) || (<span>&nbsp;</span>)}
                  </Paper>
               </div>
            ))}
         </div>
      </div>
   );
});

export default AuthCode;