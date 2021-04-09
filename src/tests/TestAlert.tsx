/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import Alert from "../package/alert";
import { OptionGroup } from "../components";
import { useActions, useChoice, useSwitch } from "../hooks";
import useMessage from "../hooks/useMessage";

export interface TestAlertProps extends Mui.BoxProps {}

const TestAlert = (props: TestAlertProps) => {
   // The state
   const [content, setContent] = React.useState<Error | string>("The error!");
   const [variant, Variant] = useChoice("Variant", ["standard", "filled", "outlined"]);
   const [severity, Severity] = useChoice("Severity", ["success", "info", "warning", "error"]);
   const [titleType, TitleType] = useChoice("Title", ["comp", "string"]);
   const [close, Close] = useSwitch("close");
   const Actions = useActions("Content", ["String", "Error"] as const);
   const [showMessage, Message] = useMessage();

   // The functions
   const onClose = () => {
      showMessage("Close button was pressed!");
   };

   // The markup
   return (
      <Mui.Box {...props}>
         <Alert
            variant={variant}
            severity={severity}
            onClose={close ? onClose : undefined}
            alertTitle={
               titleType === "string"
                  ? "The title is here"
                  : titleType && {
                       sx: { textTransform: "uppercase" },
                       children: severity || "Title",
                    }
            }
         >
            {content}
         </Alert>
         <hr />
         <Variant />
         <Severity />
         <TitleType />
         <OptionGroup title="Options">
            <Close />
         </OptionGroup>
         <Message />
         <Actions
            onChosen={(action) => {
               if (action === "String") {
                  setContent("Ein normaler Fehler!");
               } else {
                  setContent(new Error("Ein Error Objekt"));
               }
            }}
         />
      </Mui.Box>
   );
};

export default TestAlert;
