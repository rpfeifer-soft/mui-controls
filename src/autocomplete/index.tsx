/** @format */

import * as React from 'react';
import { observer } from 'mobx-react';
import { HtmlDivProps } from '../types';
import { makeAutoObservable } from 'mobx';
import { Button, ButtonGroup, TextField } from '@material-ui/core';
import Autocomplete from './autocomplete';

export interface AutoCompleteTestProps extends HtmlDivProps {
}

type variantTypes = "standard" | "outlined" | "filled";

class TestState {
   value: string = '';
   variant: variantTypes = "standard";

   constructor() {
      makeAutoObservable(this);
   }

   setValue(value: string) {
      this.value = value;
   }

   setVariant(variant: variantTypes) {
      this.variant = variant;
   }
}

const AutoCompleteTest = observer(({children, ...props}: React.PropsWithChildren<AutoCompleteTestProps>) => {
   const [state] = React.useState(new TestState());
   return (
      <div {...props}>
         <Autocomplete
            textProps={{
               autoFocus: true,
               fullWidth: true,
               value: state.value,
               onChange: (event) => state.setValue(event.target.value),
               variant: state.variant
            }} 
         />
         <hr/>
         Value: '{state.value}'
         <hr/>
         <ButtonGroup>
            <Button 
               onClick={() => state.setVariant('standard')} 
               variant={state.variant === "standard" ? "contained" : undefined}>Standard</Button>
            <Button 
               onClick={() => state.setVariant('outlined')}
               variant={state.variant === "outlined" ? "contained" : undefined}>Outlined</Button>
            <Button 
               onClick={() => state.setVariant('filled')}
               variant={state.variant === "filled" ? "contained" : undefined}>Filled</Button>
         </ButtonGroup>
      </div>
   );
});

export default AutoCompleteTest;