/** @format */

import * as React from "react";

import { HookOptions, ICtrl, IRefCtrl } from "./types";

type HookPropsType<T extends ICtrl<U>, U> = Omit<T, "value" | "label" | "onChange">;

export function genericHook<T extends ICtrl<U>, V extends IRefCtrl, U = Exclude<T["value"], null>>(
   Ctrl: (props: T) => JSX.Element,
   useRefCtrl: () => React.MutableRefObject<V>
) {
   return (initValue: U | null, initLabel?: string, options?: HookOptions) => {
      const [value, setValue] = React.useState(initValue);
      const [label, setLabel] = React.useState(initLabel);
      const refCtrl = useRefCtrl();

      const [state] = React.useState({
         // Internal members
         refCtrl,
         // Access values
         value,
         label,
         // Access functions
         setValue,
         setLabel,
         onChange: (value: U | null) => value,
         focus: () => refCtrl.current.focus(),
         select: () => refCtrl.current.select(),
         // The control
         Box: (undefined as unknown) as (props: HookPropsType<T, U>) => JSX.Element,
      });

      // Update the volatile values
      state.value = options && options.fixValue ? initValue : value;
      state.label = options && options.fixLabel ? initLabel : label;

      // We have to create the handlers here
      const onChange = React.useCallback(
         (value) => {
            state.setValue(state.onChange(value));
         },
         [state]
      );

      // Allow to create the element
      state.Box = React.useCallback(
         (props: HookPropsType<T, U>) => {
            const inputCtrlProps = ({
               ...props,
               // Our props are priorized
               value: state.value,
               label: state.label,
               refCtrl: state.refCtrl,
               onChange: onChange,
            } as unknown) as T;
            return <Ctrl {...inputCtrlProps} />;
         },
         [onChange, state]
      );
      return state as Omit<typeof state, "refCtrl">;
   };
}
