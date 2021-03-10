/** @format */

import * as React from "react";
import { ButtonProps } from "@material-ui/core";
import { OptionButton, OptionGroup } from "../components";

export interface ChoiceProps<T extends string> extends Omit<ButtonProps, "variant" | "onClick"> {
   mayChoose?: (choice: T) => boolean;
}

function useChoice<T extends string>(
   title: string,
   choices: ReadonlyArray<T>,
   active: false
): [T | false, React.FC<ChoiceProps<T>>];
function useChoice<T extends string>(
   title: string,
   choices: ReadonlyArray<T>,
   active?: T
): [T, React.FC<ChoiceProps<T>>];
function useChoice<T extends string>(title: string, choices: ReadonlyArray<T>, active?: T | false) {
   const [all] = React.useState(choices);
   const [current, setCurrent] = React.useState(active);
   const render = (props: ChoiceProps<T>) => {
      // The props
      const { mayChoose, ...btnProps } = props;
      // The functions
      const onClick = (what: T) => {
         if (mayChoose && !mayChoose(what)) {
            return;
         }
         setCurrent(what);
      };
      // The markup
      return (
         <OptionGroup title={title}>
            {all.map((choice, index) => (
               <OptionButton
                  key={index}
                  {...btnProps}
                  onClick={() => onClick(choice)}
                  variant={current === choice ? "contained" : "outlined"}
               >
                  {choice || "- empty -"}
               </OptionButton>
            ))}
         </OptionGroup>
      );
   };
   return [current, render];
}

export default useChoice;
