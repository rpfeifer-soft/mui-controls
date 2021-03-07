/** @format */

import * as React from "react";
import { observer } from "mobx-react";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import "moment/locale/de";

export interface DateTimeInitProps {
   children: React.ReactNode;
   locale?: string;
   okLabel?: string;
   cancelLabel?: string;
   clearLabel?: string;
   todayLabel?: string;
}

let _okLabel: string | undefined;
let _cancelLabel: string | undefined;
let _clearLabel: string | undefined;
let _todayLabel: string | undefined;

export class DateUtils extends MomentUtils {
   okLabel?: string;
   cancelLabel?: string;
   clearLabel?: string;
   todayLabel?: string;

   constructor(params: any) {
      super(params);

      this.okLabel = _okLabel;
      this.cancelLabel = _cancelLabel;
      this.clearLabel = _clearLabel;
      this.todayLabel = _todayLabel;
   }
}

const DateTimeInit = observer((props: DateTimeInitProps) => {
   // The props
   const { children, locale = "de", okLabel, cancelLabel, clearLabel, todayLabel } = props;

   _okLabel = okLabel;
   _cancelLabel = cancelLabel;
   _clearLabel = clearLabel;
   _todayLabel = todayLabel;

   // Set the locale
   moment.locale(locale);

   // The markup
   return (
      <MuiPickersUtilsProvider libInstance={moment} utils={DateUtils} locale={locale}>
         {children}
      </MuiPickersUtilsProvider>
   );
});

export default DateTimeInit;
