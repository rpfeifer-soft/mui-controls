/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { OptionButton, OptionGroup } from "../components";

export interface ActionsProps<T extends string> extends Omit<Mui.ButtonProps, "variant" | "onClick"> {
   onChosen: (action: T) => void;
}

function createRender<T extends string>(title: string, all: readonly T[]) {
   return (props: ActionsProps<T>) => {
      // The props
      const { onChosen, ...btnProps } = props;
      // The markup
      return (
         <OptionGroup title={title}>
            {all.map((action, index) => (
               <OptionButton key={index} {...btnProps} onClick={() => onChosen(action)}>
                  {action || "- empty -"}
               </OptionButton>
            ))}
         </OptionGroup>
      );
   };
}

function useActions<T extends string>(title: string, actions: ReadonlyArray<T>): React.FC<ActionsProps<T>> {
   const [all] = React.useState(actions);

   return React.useMemo(() => createRender(title, all), [title, all]);
}

export default useActions;
