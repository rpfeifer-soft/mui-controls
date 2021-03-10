/** @format */

import * as React from "react";
import Alert from "../package/alert";
import { AlertTitle, Box, BoxProps } from "@material-ui/core";
import { OptionGroup } from "../components";
import { useChoice, useSwitch } from "../hooks";

export interface TestAlertProps extends BoxProps {}

const TestAlert = (props: TestAlertProps) => {
   // The state
   const [variant, Variant] = useChoice(["standard", "filled", "outlined"]);
   const [severity, Severity] = useChoice(["success", "info", "warning", "error"]);
   const [title, Title] = useSwitch("title");
   const [close, Close] = useSwitch("close");

   // The functions
   const onClose = () => {
      alert("Closed");
   };

   // The markup
   return (
      <Box {...props}>
         <Alert variant={variant} severity={severity} onClose={close ? onClose : undefined}>
            {title && <AlertTitle sx={{ textTransform: "uppercase" }}>{severity || "Title"}</AlertTitle>}
            This is an alert!
         </Alert>
         <hr />
         <Variant />
         <Severity />
         <OptionGroup>
            <Title />
            <Close />
         </OptionGroup>
      </Box>
   );
};

export default TestAlert;
