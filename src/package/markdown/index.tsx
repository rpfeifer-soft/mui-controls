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

const FormatSplitIcon = Mui.createSvgIcon(
   <path d="M3 15h8v-2H3v2zm0 4h8v-2H3v2zm0-8h8V9H3v2zm0-6v2h8V5H3zm10 0h8v14h-8V5z"></path>,
   "FormatSplitIcon"
);

const FormatItalicIcon = Mui.createSvgIcon(
   <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"></path>,
   "FormatItalicIcon"
);

const FormatUnderlineIcon = Mui.createSvgIcon(
   <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"></path>,
   "FormatUnderlineIcon"
);

const FormatLinkIcon = Mui.createSvgIcon(
   <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path>,
   "FormatLinkIcon"
);

function isValidUrl(url: string) {
   try {
      new URL(url);
   } catch (e) {
      return false;
   }
   return true;
}

export const useRefMarkdown = useRefText;

export interface InputMarkdownProps extends Omit<InputTextProps, "multiline"> {}

function InputMarkdown(props: InputMarkdownProps) {
   const context = useUIContext();
   const inputRef = useRefText();
   const [preview, setPreview] = React.useState(false);

   const onSplit = React.useCallback(() => {
      setPreview((preview) => !preview);
   }, []);

   const onBold = React.useCallback(() => {
      inputRef.current.setRange((splits) => [`**${splits[1]}**`, 2, 2 + splits[1].length]);
      inputRef.current.focus();
   }, [inputRef]);

   const onItalic = React.useCallback(() => {
      inputRef.current.setRange((splits) => [`*${splits[1]}*`, 1, 1 + splits[1].length]);
      inputRef.current.focus();
   }, [inputRef]);

   const onUnderline = React.useCallback(() => {
      inputRef.current.setRange((splits) => [`<u>${splits[1]}</u>`, 3, 3 + splits[1].length]);
      inputRef.current.focus();
   }, [inputRef]);

   const onLink = React.useCallback(async () => {
      let link = "";
      if (navigator.clipboard) {
         link = await navigator.clipboard.readText();
         if (!isValidUrl(link)) {
            link = "";
         }
      }

      inputRef.current.setRange((splits) => {
         const len = splits[1].length;
         return [`[${splits[1]}](${link})`, link ? 1 : len + 3, link ? 1 + len : len + 3];
      });
      inputRef.current.focus();
   }, [inputRef]);

   // The markup
   return (
      <InputText
         {...props}
         refCtrl={inputRef}
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
                     icon={<FormatSplitIcon />}
                     onClick={onSplit}
                     tooltipTitle={context.previewText || "Preview"}
                  />
                  <Mui.SpeedDialAction
                     icon={<FormatLinkIcon />}
                     onClick={onLink}
                     tooltipTitle={context.linkText || "Link"}
                  />
                  <Mui.SpeedDialAction
                     icon={<FormatItalicIcon />}
                     onClick={onItalic}
                     tooltipTitle={context.italicText || "Italic"}
                  />
                  <Mui.SpeedDialAction
                     icon={<FormatUnderlineIcon />}
                     onClick={onUnderline}
                     tooltipTitle={context.underlineText || "Underline"}
                  />
                  <Mui.SpeedDialAction
                     icon={<FormatBoldIcon />}
                     onClick={onBold}
                     tooltipTitle={context.boldText || "Bold"}
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
