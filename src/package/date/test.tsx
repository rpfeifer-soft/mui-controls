/** @format */

import * as React from "react";
import { observer } from "mobx-react";
import { Button, ButtonGroup, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import DateTimeField from ".";
import DateTimeInit from "./init";
import InputRef from "../InputRef";

const useStyles = makeStyles(() => ({
   container: {},
}));

export interface DateTimeFieldTestProps
   extends React.DetailedHTMLProps<React.HtmlHTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const DateTimeFieldTest = observer((props: DateTimeFieldTestProps) => {
   // The styles
   const styles = useStyles();

   // The state
   const [value, setValue] = React.useState<Date | undefined>();
   const [mode, setMode] = React.useState<"desktop" | "normal" | "mobile">("normal");
   const [clearable, setClearable] = React.useState(false);
   const [disabled, setDisabled] = React.useState(false);
   const [timeSteps, setTimeSteps] = React.useState(0);
   const [inputRef] = React.useState(new InputRef());
   const [variant, setVariant] = React.useState<"filled" | "outlined" | "standard">("standard");

   // The props
   const { className, ...divProps } = props;

   // The functions

   // The markup
   return (
      <div className={clsx(className, styles.container)} {...divProps}>
         <DateTimeInit cancelLabel="Schließen" todayLabel="H">
            <DateTimeField
               label="Input for dates"
               value={value}
               fullWidth
               onChange={(newValue) => setValue(newValue)}
               variant={variant}
               clearable={clearable}
               disabled={disabled}
               desktop={mode === "desktop" ? true : undefined}
               mobile={mode === "mobile" ? true : undefined}
               timeSteps={timeSteps}
               inputRef={inputRef}
            />
         </DateTimeInit>
         <hr style={{ marginTop: 256 }} />
         Value: '{value?.toString()}'
         <hr />
         <Button onClick={() => setClearable(!clearable)} variant={clearable ? "contained" : "outlined"}>
            Clearable
         </Button>
         <Button onClick={() => setDisabled(!disabled)} variant={disabled ? "contained" : "outlined"}>
            Disabled
         </Button>
         <Button onClick={() => setTimeSteps(0)} variant={!timeSteps ? "contained" : "outlined"}>
            -
         </Button>
         <Button onClick={() => setTimeSteps(1)} variant={timeSteps === 1 ? "contained" : "outlined"}>
            1
         </Button>
         <Button onClick={() => setTimeSteps(5)} variant={timeSteps === 5 ? "contained" : "outlined"}>
            5
         </Button>
         <Button onClick={() => setTimeSteps(15)} variant={timeSteps === 15 ? "contained" : "outlined"}>
            15
         </Button>
         <Button onClick={() => setTimeSteps(30)} variant={timeSteps === 30 ? "contained" : "outlined"}>
            30
         </Button>
         <div />
         <ButtonGroup>
            <Button onClick={() => setVariant("standard")} variant={variant === "standard" ? "contained" : undefined}>
               Standard
            </Button>
            <Button onClick={() => setVariant("outlined")} variant={variant === "outlined" ? "contained" : undefined}>
               Outlined
            </Button>
            <Button onClick={() => setVariant("filled")} variant={variant === "filled" ? "contained" : undefined}>
               Filled
            </Button>
         </ButtonGroup>
         <div />
         <ButtonGroup>
            <Button onClick={() => setMode("desktop")} variant={mode === "desktop" ? "contained" : "outlined"}>
               Desktop
            </Button>
            <Button onClick={() => setMode("normal")} variant={mode === "normal" ? "contained" : "outlined"}>
               Normal
            </Button>
            <Button onClick={() => setMode("mobile")} variant={mode === "mobile" ? "contained" : "outlined"}>
               Mobile
            </Button>
         </ButtonGroup>
         <div />
         <Button onClick={() => inputRef.focusAll()}>Focus</Button>
         <Button onClick={() => setValue(new Date(1978, 9, 21))}>21.10.1978</Button>
      </div>
   );
});

export default DateTimeFieldTest;
