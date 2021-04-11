/** @format */

import * as React from "react";
import { genericHook } from "../genericHook";
import InputText, { InputTextProps, useRefText } from "../text";

export const useRefMarkdown = useRefText;

export interface InputMarkdownProps extends Omit<InputTextProps, "multiline"> {}

function InputMarkdown(props: InputMarkdownProps) {
   // The markup
   return <InputText {...props} multiline />;
}

export default InputMarkdown;

// Allow to use hooks
export const useInputMarkdown = genericHook(InputMarkdown, useRefText);
