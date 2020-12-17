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
}

const AuthCodeTest = observer(({children, ...props}: React.PropsWithChildren<AuthCodeTestProps>) => {
   const [state] = React.useState(new TestState());
   return (
      <div {...props}>
         <AuthCode
               autoFocus
               value={state.value}
               onChange={(value) => state.setValue(value)}
               onSubmit={(value) => state.setMessage(`Submitted ${value}!`)}
            />
         <hr style={{ marginTop: 256}}/>
         Value: '{state.value}'
         <hr/>
         <ButtonGroup>
            <Button disabled={!state.value} onClick={() => state.setValue('')}>-</Button>
            <Button disabled={state.value === '123456'} onClick={() => state.setValue('123456')}>123456</Button>
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