/** @format */

import * as React from "react";
import * as MUI from "@material-ui/core";

export interface AlertProps extends Pick<MUI.AlertProps, "variant" | "severity" | "onClose" | "children"> {
   alertTitle?: MUI.AlertTitleProps | string | false;
}

const Alert = (props: AlertProps) => {
   // The props
   const { children, alertTitle, ...alertProps } = props;

   const titleProps = typeof alertTitle === "string" ? { children: alertTitle } : alertTitle;
   // The markup
   return (
      <MUI.Alert {...alertProps}>
         {alertTitle && <MUI.AlertTitle {...titleProps} />}
         {children}
      </MUI.Alert>
   );
};

export default Alert;
