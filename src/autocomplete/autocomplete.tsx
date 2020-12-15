/** @format */

import * as React from 'react';
import { observer } from 'mobx-react';
import { HtmlDivProps } from '../types';
import { TextField, TextFieldProps } from '@material-ui/core';

export interface AutocompleteProps extends HtmlDivProps {
   textProps?: TextFieldProps;
}

const Autocomplete = observer(({children, textProps, ...props}: React.PropsWithChildren<AutocompleteProps>) => {
   return (
      <div {...props}>
         <TextField {...textProps}/>
      </div>
   );
});

export default Autocomplete;