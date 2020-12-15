/** @format */

import * as React from 'react';
import { observer } from 'mobx-react';
import { TextField, TextFieldProps } from '@material-ui/core';

type HtmlDivProps = React.DetailedHTMLProps<
   React.HtmlHTMLAttributes<HTMLDivElement>, HTMLDivElement
>;

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