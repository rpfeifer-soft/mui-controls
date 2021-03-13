/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";

export interface AlertProps extends Pick<Mui.AlertProps, "variant" | "severity" | "onClose" | "children"> {
   alertTitle?: Mui.AlertTitleProps | string | false;
}

const Alert = (props: AlertProps) => {
   // The props
   const { children, alertTitle, ...alertProps } = props;

   const titleProps = typeof alertTitle === "string" ? { children: alertTitle } : alertTitle;
   // The markup
   return (
      <Mui.Alert {...alertProps}>
         {alertTitle && <Mui.AlertTitle {...titleProps} />}
         {children}
      </Mui.Alert>
   );
};

export default Alert;
