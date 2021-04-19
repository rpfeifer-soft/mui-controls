/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { genericHook } from "../genericHook";
import InputText, { InputTextProps, useRefText } from "../text";
import { useUIContext } from "../UIContext";
import { css } from "@emotion/css";
import marked from "marked";

const FormatBoldIcon = Mui.createSvgIcon(
   <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"></path>,
   "FormatBold"
);

export const useRefMarkdown = useRefText;

export interface InputMarkdownProps extends Omit<InputTextProps, "multiline"> {}

function InputMarkdown(props: InputMarkdownProps) {
   const context = useUIContext();
   const [preview, setPreview] = React.useState(false);

   // The markup
   return (
      <InputText
         {...props}
         multiline
         boxProps={{
            ...props.boxProps,
            className: css({
               position: "relative",
               width: preview ? "50%" : undefined,
               paddingRight: preview ? 8 : undefined,
               "& .MuiSpeedDial-root": {
                  display: "none",
               },
               "&:focus-within .MuiSpeedDial-root": {
                  display: "flex",
               },
               "&:hover .MuiSpeedDial-root": {
                  display: "flex",
               },
            }),
         }}
         boxContent={
            <React.Fragment>
               <Mui.SpeedDial
                  ariaLabel="format"
                  direction="left"
                  icon={<Mui.SpeedDialIcon />}
                  FabProps={{ size: "small", tabIndex: -1 }}
                  sx={{ position: "absolute", right: preview ? 16 : 8, bottom: 0 }}
               >
                  <Mui.SpeedDialAction
                     icon={<FormatBoldIcon />}
                     onClick={() => setPreview(!preview)}
                     tooltipTitle={context.boldText || "bold"}
                  />
               </Mui.SpeedDial>
               {preview && (
                  <Mui.Paper
                     elevation={12}
                     sx={{
                        position: "absolute",
                        padding: 2,
                        paddingTop: 0,
                        top: 0,
                        left: "100%",
                        width: "100%",
                        height: "100%",
                     }}
                  >
                     <div dangerouslySetInnerHTML={{ __html: marked(props.value || "") }} />
                  </Mui.Paper>
               )}
            </React.Fragment>
         }
      />
   );
}

export default InputMarkdown;

// Allow to use hooks
export const useInputMarkdown = genericHook(InputMarkdown, useRefText);
