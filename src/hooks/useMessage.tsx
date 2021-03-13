/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";

export interface MessageProps extends Omit<Mui.SnackbarProps, "open" | "message"> {
   durationInMS?: number;
}

function createRender(current: string, changeNo: number, setCurrent: (value: string) => void) {
   return (props: MessageProps) => {
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
      return <Mui.Snackbar {...snackProps} open={Boolean(message)} message={message} />;
   };
}

function useMessage(): [(message: string) => void, React.FC<MessageProps>] {
   const [current, setCurrent] = React.useState("");
   const [changeNo, setChangeNo] = React.useState(0);

   const showMessage = (message: string) => {
      setCurrent(message);
      setChangeNo(changeNo + 1);
   };

   return [
      showMessage,
      React.useMemo(() => createRender(current, changeNo, setCurrent), [current, changeNo, setCurrent]),
   ];
}

export default useMessage;
