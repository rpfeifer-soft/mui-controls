/** @format */

import * as React from 'react';
import { observer } from 'mobx-react';
import { makeAutoObservable } from 'mobx';
import AuthCode from '.';
import { Button, ButtonGroup, Snackbar } from '@material-ui/core';

type HtmlDivProps = React.DetailedHTMLProps<
   React.HtmlHTMLAttributes<HTMLDivElement>, HTMLDivElement
>;

export interface AuthCodeTestProps extends HtmlDivProps {
}

class TestState {
   value: string = '';
   message: string | false = false;
   interval: NodeJS.Timeout;
   elevation?: number;

   constructor() {
      makeAutoObservable(this);
   }

   setValue(value: string) {
      this.value = value;
   }

   setMessage(message: string) {
      this.message = message;
      if(this.interval) {
         clearTimeout(this.interval);
      }
      this.interval = setTimeout(() => {
         this.clearMessage();
      }, 5000)
   }

   clearMessage() {
      this.message = false;
   }

   setElevation(elevation?: number) {
      this.elevation = elevation;
   }
}

const AuthCodeTest = observer(({children, ...props}: React.PropsWithChildren<AuthCodeTestProps>) => {
   const [state] = React.useState(new TestState());
   return (
      <div {...props}>
         <AuthCode
               autoFocus
               value={state.value}
               elevation={state.elevation}
               onChange={(value) => state.setValue(value)}
               onSubmit={(value) => state.setMessage(`Submitted ${value}!`)}
            />
         <hr style={{ marginTop: 256}}/>
         Value: '{state.value}'
         <hr/>
         <ButtonGroup>
            <Button disabled={state.elevation === undefined} onClick={() => state.setElevation()}>-</Button>
            <Button disabled={state.elevation === 1} onClick={() => state.setElevation(1)}>1</Button>
            <Button disabled={state.elevation === 2} onClick={() => state.setElevation(2)}>2</Button>
            <Button disabled={state.elevation === 3} onClick={() => state.setElevation(3)}>3</Button>
            <Button disabled={state.elevation === 4} onClick={() => state.setElevation(4)}>4</Button>
            <Button disabled={state.elevation === 8} onClick={() => state.setElevation(8)}>8</Button>
            <Button disabled={state.elevation === 16} onClick={() => state.setElevation(16)}>16</Button>
         </ButtonGroup>
         <Snackbar
            anchorOrigin={{
               vertical: 'bottom',
               horizontal: 'left'
            }}
            open={!!state.message}
            message={state.message}
         />
      </div>
   );
});

export default AuthCodeTest;