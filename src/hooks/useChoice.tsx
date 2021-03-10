/** @format */

import * as React from "react";
import { ButtonProps } from "@material-ui/core";
import { OptionButton, OptionGroup } from "../components";

export interface ChoiceProps extends Omit<ButtonProps, "variant" | "onClick"> {}

function useChoice<T extends string>(
   title: string,
   choices: ReadonlyArray<T>,
   active: false
): [T | false, React.FC<ChoiceProps>];
function useChoice<T extends string>(title: string, choices: ReadonlyArray<T>, active?: T): [T, React.FC<ChoiceProps>];
function useChoice<T extends string>(title: string, choices: ReadonlyArray<T>, active?: T | false) {
   const [all] = React.useState(choices);
   const [current, setCurrent] = React.useState(active);
   const render = (props: ChoiceProps) => {
      // The markup
      return (
         <OptionGroup title={title}>
            {all.map((choice, index) => (
               <OptionButton
                  key={index}
                  {...props}
                  onClick={() => setCurrent(choice)}
                  variant={current === choice ? "contained" : "outlined"}
               >
                  {choice}
               </OptionButton>
            ))}
         </OptionGroup>
      );
   };
   return [current, render];
}

export default useChoice;
