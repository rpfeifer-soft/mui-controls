/** @format */

import { ButtonProps } from "@material-ui/core";
import * as React from "react";
import { OptionButton, OptionGroup } from "./types";

export interface ChoiceProps extends Omit<ButtonProps, "variant" | "onClick"> {}

class Choice<T extends string> {
   active: T | false = false;
   choices: ReadonlyArray<T> = [];

   private constructor(choices: ReadonlyArray<T>, active?: T | false) {
      this.choices = choices;
      if (active !== false) {
         this.active = active && choices.includes(active) ? active : choices[0];
      }
   }

   static useChoice<T extends string>(choices: ReadonlyArray<T>, active: false): [T | false, React.FC<ChoiceProps>];
   static useChoice<T extends string>(choices: ReadonlyArray<T>, active?: T): [T, React.FC<ChoiceProps>];
   static useChoice<T extends string>(choices: ReadonlyArray<T>, active?: T | false) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [choice] = React.useState(new Choice(choices, active));
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [current, setCurrent] = React.useState(choice.active);
      const render = (props: ChoiceProps) => {
         // The markup
         return (
            <OptionGroup size="small">
               {choice.choices.map((choice, index) => (
                  <OptionButton
                     key={index}
                     onClick={() => setCurrent(choice)}
                     variant={current === choice ? "contained" : "outlined"}
                     {...props}
                  >
                     {choice}
                  </OptionButton>
               ))}
            </OptionGroup>
         );
      };
      return [current, render];
   }
}

export default Choice;
