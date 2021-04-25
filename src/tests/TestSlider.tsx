/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { InputSlider, useInputSlider, useRefSlider } from "../package";
import { useActions, useChoice, useSwitch } from "../hooks";
import { OptionGroup } from "../components";
import { InputSliderProps } from "../package/slider";

export interface TestSliderProps extends Mui.BoxProps {
   hook?: boolean;
}

const TestSlider = (props: TestSliderProps) => {
   // The state
   const refSlider = useRefSlider();
   const [label, Label] = useChoice("Label", ["", "Label"] as const, "Label");
   const [value, setValue] = React.useState<number | null>(null);

   const Slider = useInputSlider(null, "Label");

   const [disabled, Disabled] = useSwitch("Disabled");
   const [variant, Variant] = useChoice("Variant", ["standard", "outlined", "filled", "square"] as const);
   const [valueLabelDisplay, ValueLabelDisplay] = useChoice(
      "ValueLabelDisplay",
      ["", "on", "off", "auto"] as const,
      "auto"
   );
   const [track, Track] = useChoice("Track", ["", "normal", "inverted"] as const, "normal");
   const [marks, Marks] = useChoice("Marks", ["", "true", "array"] as const);
   const [step, Step] = useChoice("Step", ["", "2", "null"] as const);
   const Values = useActions("Init", ["", "21", "10"] as const);
   const Actions = useActions("Actions", ["Focus", "Select", "Scale x2"] as const);
   const [scale, setScale] = React.useState<((value: number) => number) | undefined>(undefined);

   // The props
   const { hook = false, ...boxProps } = props;

   // The functions
   const onChange = (value: number | null) => {
      setValue(value);
   };

   let useMarks: InputSliderProps["marks"];
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
            <Slider.Box
               autoFocus
               variant={variant}
               disabled={disabled}
               marks={useMarks}
               step={step ? JSON.parse(step) : undefined}
               scale={scale}
               track={track ? track : false}
               valueLabelDisplay={valueLabelDisplay ? valueLabelDisplay : undefined}
            />
         ) : (
            <InputSlider
               autoFocus
               variant={variant}
               label={label}
               value={value}
               disabled={disabled}
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
            value: '{JSON.stringify(hook ? Slider.value : value)}'
         </Mui.Paper>
         {!hook && <Label />}
         <Variant />
         <Track />
         <Marks />
         <Step />
         <ValueLabelDisplay />
         <OptionGroup title="Options">
            <Disabled />
         </OptionGroup>
         <Values
            onChosen={(value) => {
               if (value) {
                  (hook ? Slider.setValue : setValue)(+value);
               } else {
                  (hook ? Slider.setValue : setValue)(null);
               }
               return true;
            }}
         />
         <Actions
            onChosen={(chosen) => {
               if (chosen === "Focus") {
                  hook ? Slider.focus() : refSlider.current.focus();
               } else if (chosen === "Select") {
                  hook ? Slider.select() : refSlider.current.select();
               } else if (chosen === "Scale x2") {
                  setScale((_scale: any) => (x: number) => 2 * x);
               }
            }}
         />
      </Mui.Box>
   );
};

export default TestSlider;
