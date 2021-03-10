/** @format */

import * as React from "react";
import { ButtonProps } from "@material-ui/core";
import { OptionButton } from "../components";

export interface SwitchProps extends Omit<ButtonProps, "variant" | "onClick"> {}

function useSwitch(name: string, active?: boolean): [boolean, React.FC<SwitchProps>] {
   const [current, setCurrent] = React.useState(active || false);
   const render = (props: SwitchProps) => {
      // The markup
      return (
         <OptionButton
            {...props}
            onClick={() => setCurrent((previous) => !previous)}
            variant={current ? "contained" : "outlined"}
         >
            {name}
         </OptionButton>
      );
   };
   return [current, render];
}

export default useSwitch;
