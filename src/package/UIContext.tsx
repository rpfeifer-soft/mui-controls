/** @format */

import * as React from "react";
import { MuiPickersAdapterContext } from "@material-ui/lab/LocalizationProvider";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import { IAddress, NumberParser } from "./types";

export interface IUIContext {
   // For date components
   locale?: string;
   okText?: string;
   cancelText?: string;
   clearText?: string;
   todayText?: string;
   // For address components
   cachedAddress: (text: string) => IAddress[] | undefined;
   searchAddress: (text: string) => Promise<IAddress[]>;
   parseNumber: (text: string) => number;
   formatNumber: (value: number) => string;
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
   value: Partial<IUIContext>;
   children: React.ReactNode;
}

const NumberParserDE = new NumberParser("de");

const UIContext = (props: UIContextProps) => {
   // The props
   const { value, children } = props;

   // Check for overloading
   const context = React.useContext(Context);
   const combine: IUIContext = {
      locale: "de",
      cachedAddress: () => {
         throw new Error("Address functions not initialized in context!");
      },
      searchAddress: () => {
         throw new Error("Address functions not initialized in context!");
      },
      parseNumber: (text) => NumberParserDE.parse(text),
      formatNumber: (value) => value.toLocaleString(),
      ...context,
      ...value,
   };

   // The state
   const dateUtils = React.useMemo(() => {
      return new MomentUtils({
         locale: combine.locale,
         instance: moment,
      });
   }, [combine.locale]);

   // Set the correct locale
   moment.locale(combine.locale);

   // The markup
   return (
      <Context.Provider value={combine}>
         <MuiPickersAdapterContext.Provider value={dateUtils}>{children}</MuiPickersAdapterContext.Provider>
      </Context.Provider>
   );
};

export default UIContext;
