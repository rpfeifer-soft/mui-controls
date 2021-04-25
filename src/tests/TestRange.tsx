/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { InputSlider, useInputRange, useRefSlider } from "../package";
import { useActions, useChoice, useSwitch } from "../hooks";
import { OptionGroup } from "../components";
import { InputRangeProps } from "../package/slider";

export interface TestRangeProps extends Mui.BoxProps {
   hook?: boolean;
}

const TestRange = (props: TestRangeProps) => {
   // The state
   const refSlider = useRefSlider();
   const [label, Label] = useChoice("Label", ["", "Label"] as const, "Label");
   const [value, setValue] = React.useState<number[] | null>(null);

   const Range = useInputRange(null, "Label");

   const [disabled, Disabled] = useSwitch("Disabled");
   const [disableSwap, DisableSwap] = useSwitch("DisableSwap");
   const [variant, Variant] = useChoice("Variant", ["standard", "outlined", "filled", "square"] as const);
   const [valueLabelDisplay, ValueLabelDisplay] = useChoice(
      "ValueLabelDisplay",
      ["", "on", "off", "auto"] as const,
      "auto"
   );
   const [track, Track] = useChoice("Track", ["", "normal", "inverted"] as const, "normal");
   const [marks, Marks] = useChoice("Marks", ["", "true", "array"] as const);
   const [step, Step] = useChoice("Step", ["", "2", "null"] as const);
   const Values = useActions("Init", ["", "[10, 21]", "[19, 78]"] as const);
   const Actions = useActions("Actions", ["Focus", "Select", "Scale x2"] as const);
   const [scale, setScale] = React.useState<((value: number) => number) | undefined>(undefined);

   // The props
   const { hook = false, ...boxProps } = props;

   // The functions
   const onChange = (value: number[] | null) => {
      setValue(value);
   };

   let useMarks: InputRangeProps["marks"];
   if (marks) {
      useMarks = marks === "true" || [
         { value: 0, label: "" },
         { value: 10, label: "10." },
         { value: 21, label: "21." },
         { value: 78, label: "1978" },
         { value: 100, label: "" },
      ];
   }
   // The markup
   return (
      <Mui.Box {...boxProps}>
         {hook ? (
            <Range.Box
               autoFocus
               type="Range"
               variant={variant}
               disabled={disabled}
               disableSwap={disableSwap}
               marks={useMarks}
               step={step ? JSON.parse(step) : undefined}
               scale={scale}
               track={track ? track : false}
               valueLabelDisplay={valueLabelDisplay ? valueLabelDisplay : undefined}
            />
         ) : (
            <InputSlider
               autoFocus
               type="Range"
               variant={variant}
               label={label}
               value={value}
               disabled={disabled}
               disableSwap={disableSwap}
               onChange={onChange}
               refCtrl={refSlider}
               marks={useMarks}
               step={step ? JSON.parse(step) : undefined}
               scale={scale}
               track={track ? track : false}
               valueLabelDisplay={valueLabelDisplay ? valueLabelDisplay : undefined}
            />
         )}
         <hr />
         <Mui.Paper
            sx={{
               padding: 1,
            }}
            variant="outlined"
         >
            value: '{JSON.stringify(hook ? Range.value : value)}'
         </Mui.Paper>
         {!hook && <Label />}
         <Variant />
         <Track />
         <Marks />
         <Step />
         <ValueLabelDisplay />
         <OptionGroup title="Options">
            <Disabled />
            <DisableSwap />
         </OptionGroup>
         <Values
            onChosen={(value) => {
               if (value) {
                  (hook ? Range.setValue : setValue)(JSON.parse(value));
               } else {
                  (hook ? Range.setValue : setValue)(null);
               }
               return true;
            }}
         />
         <Actions
            onChosen={(chosen) => {
               if (chosen === "Focus") {
                  hook ? Range.focus() : refSlider.current.focus();
               } else if (chosen === "Select") {
                  hook ? Range.select() : refSlider.current.select();
               } else if (chosen === "Scale x2") {
                  setScale((_scale: any) => (x: number) => 2 * x);
               }
            }}
         />
      </Mui.Box>
   );
};

export default TestRange;
