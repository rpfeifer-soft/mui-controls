/** @format */

import * as React from "react";
import { Snackbar, SnackbarProps } from "@material-ui/core";

export interface MessageProps extends Omit<SnackbarProps, "open" | "message"> {
   durationInMS?: number;
}

function useMessage(): [(message: string) => void, React.FC<MessageProps>] {
   const [current, setCurrent] = React.useState("");
   const [changeNo, setChangeNo] = React.useState(0);

   const showMessage = (message: string) => {
      setCurrent(message);
      setChangeNo(changeNo + 1);
   };

   const Render = (props: MessageProps) => {
      // The props
      const { durationInMS = 5000, ...snackProps } = props;

      // The hooks
      const change = changeNo;
      const message = current;
      React.useEffect(() => {
         if (!message) {
            return;
         }
         const timeout = setTimeout(() => {
            setCurrent("");
         }, durationInMS);
         return () => clearTimeout(timeout);
      }, [change, message, durationInMS]);

      // The markup
      return <Snackbar {...snackProps} open={Boolean(message)} message={message} />;
   };
   return [showMessage, Render];
}

export default useMessage;
