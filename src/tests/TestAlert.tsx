/** @format */

import Alert from "../package/alert";
import { Box, BoxProps } from "@material-ui/core";
import { OptionGroup } from "../components";
import { useChoice, useSwitch } from "../hooks";
import useMessage from "../hooks/useMessage";

export interface TestAlertProps extends BoxProps {}

const TestAlert = (props: TestAlertProps) => {
   // The state
   const [variant, Variant] = useChoice("Variant", ["standard", "filled", "outlined"]);
   const [severity, Severity] = useChoice("Severity", ["success", "info", "warning", "error"]);
   const [titleType, TitleType] = useChoice("Title", ["comp", "string"]);
   const [close, Close] = useSwitch("close");
   const [showMessage, Message] = useMessage();

   // The functions
   const onClose = () => {
      showMessage("Close button was pressed!");
   };

   // The markup
   return (
      <Box {...props}>
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
            This is an alert!
         </Alert>
         <hr />
         <Variant />
         <Severity />
         <TitleType />
         <OptionGroup title="Options">
            <Close />
         </OptionGroup>
         <Message />
      </Box>
   );
};

export default TestAlert;
