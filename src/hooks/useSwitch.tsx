/** @format */

import * as React from "react";
import { ButtonProps } from "@material-ui/core";
import { OptionButton } from "../components";

export interface SwitchProps extends Omit<ButtonProps, "variant" | "onClick"> {
   maySwitch?: (next: boolean) => boolean;
}

function createRender(name: string, current: boolean, setCurrent: (next: boolean) => void) {
   return (props: SwitchProps) => {
      // The props
      const { maySwitch, ...btnProps } = props;
      // The functions
      const onClick = (next: boolean) => {
         if (maySwitch && !maySwitch(next)) {
            return;
         }
         setCurrent(next);
      };
      // The markup
      return (
         <OptionButton {...btnProps} onClick={() => onClick(!current)} variant={current ? "contained" : "outlined"}>
            {name}
         </OptionButton>
      );
   };
}

function useSwitch(name: string, active?: boolean): [boolean, React.FC<SwitchProps>] {
   const [current, setCurrent] = React.useState(active || false);

   return [current, React.useMemo(() => createRender(name, current, setCurrent), [name, current, setCurrent])];
}

export default useSwitch;
