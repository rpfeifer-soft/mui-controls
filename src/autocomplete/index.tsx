/** @format */

import * as React from 'react';
import { observer } from 'mobx-react';
import { HtmlDivProps } from '../types';

export interface AutoCompleteTestProps extends HtmlDivProps {
}

const AutoCompleteTest = observer(({children, ...props}: React.PropsWithChildren<AutoCompleteTestProps>) => {
   return (
      <div {...props}>
         Test
      </div>
   );
});

export default AutoCompleteTest;