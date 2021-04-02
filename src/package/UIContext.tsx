/** @format */

import * as React from "react";
import * as MuiLab from "@material-ui/lab";
import MomentUtils from "@date-io/moment";
import moment from "moment";

export interface IUIContext {
   // For date components
   locale?: string;
   okText?: string;
   cancelText?: string;
   clearText?: string;
   todayText?: string;
}

// the context component
const Context = React.createContext<IUIContext | null>(null);

export function useUIContext() {
   const context = React.useContext(Context);
   if (!context) {
      throw new Error("Missing UIContext! Check providing UIContext.Provider component.");
   }
   return context;
}

export interface UIContextProps {
   value: IUIContext;
   children: React.ReactNode;
}

const UIContext = (props: UIContextProps) => {
   // The props
   const { value, children } = props;
   const { locale = "de" } = value;

   // The state
   const dateUtils = React.useMemo(() => {
      return new MomentUtils({
         locale: locale,
         instance: moment,
      });
   }, [locale]);

   // Set the correct locale
   moment.locale(locale);

   // The markup
   return (
      <Context.Provider value={value}>
         <MuiLab.MuiPickersAdapterContext.Provider value={dateUtils}>
            {children}
         </MuiLab.MuiPickersAdapterContext.Provider>
      </Context.Provider>
   );
};

export default UIContext;
