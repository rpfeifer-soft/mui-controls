/** @format */

import * as React from "react";
import { ButtonProps } from "@material-ui/core";
import { OptionButton, OptionGroup } from "../components";

export interface ActionsProps<T extends string> extends Omit<ButtonProps, "variant" | "onClick"> {
   onChosen: (action: T) => void;
}

function useActions<T extends string>(title: string, actions: ReadonlyArray<T>): React.FC<ActionsProps<T>> {
   const [all] = React.useState(actions);
   const Render = (props: ActionsProps<T>) => {
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
   return Render;
}

export default useActions;
