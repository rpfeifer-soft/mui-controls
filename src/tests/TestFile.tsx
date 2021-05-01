/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { InputFile, useInputFile, useRefFile } from "../package";
import { useActions, useChoice, useMessage, useSwitch } from "../hooks";
import { OptionGroup } from "../components";
import { FileType, IFile } from "../package/types";
import { InputFileProps, IFileUpload } from "../package/file";
import { timeout } from "./tools";

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
   const [multiple, Multiple] = useSwitch("Multiple");
   const [moreInfo, MoreInfo] = useSwitch("MoreInfo");
   const [lineHeight, LineHeight] = useChoice("Height", ["60", "120", "240"] as const, "120");
   const Actions = useActions("Actions", ["Focus"] as const);
   const [showMessage, Message] = useMessage();

   // The props
   const { hook = false, ...boxProps } = props;

   const onChange = React.useCallback<Required<InputFileProps>["onChange"]>(
      (value) => {
         (hook ? File.setValue : setValue)(value);
      },
      [File, hook]
   );

   const onMore = React.useMemo(() => (moreInfo ? (file: IFile) => showMessage(file.name) : undefined), [
      moreInfo,
      showMessage,
   ]);

   const onUpload = React.useCallback(
      async (upload: IFileUpload) => {
         const file = upload.file;
         let steps = 50;
         while (!upload.isStopped() && steps-- > 0) {
            upload.progress((50 - steps) / 50);
            await timeout(100);
         }
         if (upload.isStopped()) {
            upload.canceled();
         } else {
            onChange(
               upload.added({
                  name: file.name,
                  size: file.size,
                  previewUrl: "/logo192.png",
                  type: FileType.other,
               })
            );
         }
      },
      [onChange]
   );

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
               multiple={multiple}
               onUpload={onUpload}
               onMore={onMore}
            />
         ) : (
            <InputFile
               autoFocus
               label={label}
               value={value}
               onChange={onChange}
               onUpload={onUpload}
               onMore={onMore}
               disabled={disabled}
               readOnly={readOnly}
               required={required}
               lineHeight={+lineHeight}
               multiple={multiple}
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
         <OptionGroup title="Settings">
            <Multiple />
            <MoreInfo />
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
         <Message />
      </Mui.Box>
   );
};

export default TestFile;
