/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { OptionButton, OptionGroup } from "../components";

export interface ChoiceProps<T extends string> extends Omit<Mui.ButtonProps, "variant" | "onClick"> {
   mayChoose?: (choice: T) => boolean;
}

function createRender<T extends string>(
   title: string,
   all: readonly T[],
   current: T | false | undefined,
   setCurrent: (next: T) => void
) {
   return (props: ChoiceProps<T>) => {
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

   return [
      current,
      React.useMemo(() => createRender(title, all, current, (next) => setCurrent(next)), [
         title,
         all,
         current,
         setCurrent,
      ]),
   ];
}

export default useChoice;
