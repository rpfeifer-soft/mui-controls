/** @format */

import * as React from "react";
import * as MUI from "@material-ui/core";

export interface AlertProps extends Pick<MUI.AlertProps, "variant" | "severity" | "onClose" | "children"> {}

const Alert = (props: AlertProps) => {
   // The markup
   return <MUI.Alert {...props} />;
};

export default Alert;
