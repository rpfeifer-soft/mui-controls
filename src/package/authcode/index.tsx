/** @format */

import * as React from 'react';
import { observer } from 'mobx-react';
import { makeStyles, Paper, TextField } from '@material-ui/core';
import { makeAutoObservable } from 'mobx';

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
   elevation?: number;
   onChange?: (value: string) => void;
   onSubmit?: (value: string) => void;
}

class State {
   value: string = '';

   constructor(private props: AuthCodeProps) {
      makeAutoObservable(this);

      this.value = props.value;
   }

   setValue(value: string) {
      this.value = value.replace(/\D/g, '').slice(0, 6);

      if(this.props.onChange) {
         this.props.onChange(this.value);
      }
   }

   handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
      switch(event.key) {
         case 'Enter':
            if(this.value.length === 6 &&
               this.props.onSubmit) {
               this.props.onSubmit(this.value);
            }
            break;
      }
   }
}

const AuthCode = observer(({children, ...props}: React.PropsWithChildren<AuthCodeProps>) => {
   const styles = useStyles(props);
   const [state] = React.useState(new State(props)); 
   const focusElement = React.useRef<HTMLInputElement>(null);
   const {
      autoFocus,
      value,
      elevation,
      onChange,
      onSubmit,
      
      ...divProps
   } = props;
   const focus = () => {
      console.log(focusElement.current);
      if(focusElement.current) {
         focusElement.current.focus();
      }
   }
   return (
      <div {...divProps}>
         <TextField 
            inputRef={focusElement}
            autoFocus={autoFocus}
            className={styles.input}
            value={state.value}
            onChange={(event) => state.setValue(event.target.value)}
            onKeyDown={(event) => state.handleKeyDown(event)}
            />
         <div className={styles.container} onClick={() => focus()}>
            {[0,1,2,3,4,5].map(index => (
               <div key={index}>
                  <Paper className={styles.item} elevation={elevation}>
                     {state.value.charAt(index) || (<span>&nbsp;</span>)}
                  </Paper>
               </div>
            ))}
         </div>
      </div>
   );
});

export default AuthCode;