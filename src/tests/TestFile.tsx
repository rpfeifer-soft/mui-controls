/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { InputFile, useInputFile, useRefFile } from "../package";
import { useActions, useChoice, useSwitch } from "../hooks";
import { OptionGroup } from "../components";
import { FileType, IFile } from "../package/types";
import { InputFileProps } from "../package/file";

export interface TestFileProps extends Mui.BoxProps {
   hook?: boolean;
}

const exampleValues = [
   {
      name: "Logo",
      size: 5123,
      previewUrl: "/logo192.png",
      type: FileType.image,
   },
];

const TestFile = (props: TestFileProps) => {
   // The state
   const refFile = useRefFile();
   const [label, Label] = useChoice("Label", ["", "Label"] as const, "Label");
   const [value, setValue] = React.useState<IFile[] | null>(exampleValues);

   const File = useInputFile(exampleValues, "Label");

   const [disabled, Disabled] = useSwitch("Disabled");
   const [readOnly, ReadOnly] = useSwitch("ReadOnly");
   const [required, Required] = useSwitch("Required");
   const [lineHeight, LineHeight] = useChoice("Height", ["60", "120", "240"] as const, "60");
   const Actions = useActions("Actions", ["Focus"] as const);

   // The props
   const { hook = false, ...boxProps } = props;

   const onChange = React.useCallback<Required<InputFileProps>["onChange"]>((value) => {
      setValue(value);
   }, []);

   const onUpload = React.useCallback((file: File) => {
      setValue((value) => {
         const newFile = {
            name: file.name,
            size: file.size,
            previewUrl: "/logo192.png",
            type: FileType.other,
         };
         return value ? [...value, newFile] : [newFile];
      });
   }, []);

   // The markup
   return (
      <Mui.Box {...boxProps}>
         {hook ? (
            <File.Box
               autoFocus
               disabled={disabled}
               readOnly={readOnly}
               required={required}
               lineHeight={+lineHeight}
               onUpload={onUpload}
            />
         ) : (
            <InputFile
               autoFocus
               label={label}
               value={value}
               onChange={onChange}
               onUpload={onUpload}
               disabled={disabled}
               readOnly={readOnly}
               required={required}
               lineHeight={+lineHeight}
               refCtrl={refFile}
            />
         )}
         <hr />
         <Mui.Paper
            sx={{
               padding: 1,
            }}
            variant="outlined"
         >
            value: '{JSON.stringify(hook ? File.value : value)}'
         </Mui.Paper>
         {!hook && <Label />}
         <LineHeight />
         <OptionGroup title="Options">
            <Disabled />
            <ReadOnly />
            <Required />
         </OptionGroup>
         <Actions
            onChosen={(chosen) => {
               if (chosen === "Focus") {
                  hook ? File.focus() : refFile.current.focus();
               } else if (chosen === "Select") {
                  hook ? File.select() : refFile.current.select();
               }
            }}
         />
      </Mui.Box>
   );
};

export default TestFile;
