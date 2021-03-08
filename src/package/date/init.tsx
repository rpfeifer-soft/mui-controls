/** @format */

import * as React from "react";
import { observer } from "mobx-react";
import { LocalizationProvider } from "@material-ui/lab";
import MomentUtils from "@material-ui/lab/AdapterMoment";
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
      <LocalizationProvider dateLibInstance={moment} dateAdapter={DateUtils} locale={locale}>
         {children}
      </LocalizationProvider>
   );
});

export default DateTimeInit;
