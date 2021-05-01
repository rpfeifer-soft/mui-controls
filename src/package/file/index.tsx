/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";

import { ICtrl, IFile, IRefCtrl, noChange } from "../types";
import InputRef from "../InputRef";
import { genericHook } from "../genericHook";
import { css } from "@emotion/css";

// https://next.material-ui.com/components/material-icons/
const AddFileIcon = Mui.createSvgIcon(
   <React.Fragment>
      <path
         d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm5 9h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
         opacity=".3"
      ></path>
      <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v4H7v2h4v4h2v-4h4v-2h-4z"></path>
   </React.Fragment>,
   "AddFileIcon"
);

const DeleteIcon = Mui.createSvgIcon(
   <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path>,
   "DeleteIcon"
);

const StopIcon = Mui.createSvgIcon(
   <path
      fillRule="evenodd"
      d="M8 16h8V8H8v8zm4-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
   ></path>,
   "StopIcon"
);

const MoreIcon = Mui.createSvgIcon(
   <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>,
   "MoreIcon"
);

// Trick the linter
const memoize = React.useMemo;

export class RefFile implements IRefCtrl {
   // The input control class
   private inputRef: InputRef = new InputRef();

   public value: IFile[] | null = null;
   public click = () => {};
   public reset = () => {};

   focus() {
      this.inputRef.focus();
   }

   select() {
      this.inputRef.focus();
   }

   useHandler = () => {
      return memoize(() => {
         // Register the input element
         return (input: HTMLInputElement) => {
            this.inputRef.set(input);
            this.click = input
               ? () => {
                    input.click();
                 }
               : () => {};
            this.reset = input
               ? () => {
                    input.value = "";
                 }
               : () => {};
         };
      }, []);
   };
}

export const useRefFile = () => React.useRef(new RefFile());

interface InputInfoProps {
   file: IFile | File;

   progress?: number;
}

const InputInfo = (props: InputInfoProps) => {
   const theme = Mui.useTheme();
   // Get the props
   const { file, progress } = props;

   return (
      <Mui.Box
         display="flex"
         fontSize="0.8em"
         padding="4px 6px 2px 6px"
         position="absolute"
         left={0}
         right={0}
         bottom={0}
      >
         <Mui.Box
            position="absolute"
            left={0}
            right={0}
            top={0}
            bottom={0}
            bgcolor={Mui.alpha(theme.palette.primary.light, 0.2)}
            borderTop={`1px solid ${Mui.alpha(theme.palette.primary.light, 0.4)}`}
         >
            {progress !== undefined && (
               <Mui.LinearProgress
                  key={file.name}
                  variant="determinate"
                  value={progress * 100}
                  sx={{
                     top: -5,
                  }}
               />
            )}
         </Mui.Box>
         <Mui.Box whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" flexGrow={1}>
            {file.name}
         </Mui.Box>
         <Mui.Box whiteSpace="nowrap">
            {file.size > 1024 * 1024
               ? `${Math.floor((file.size * 10) / 1024 / 1024) / 10} MB`
               : `${Math.floor((file.size * 10) / 1024) / 10} kB`}
         </Mui.Box>
      </Mui.Box>
   );
};

export interface IFileUpload {
   file: File;

   progress: (part: number) => void;
   isStopped: () => boolean;

   canceled: () => void;
   added: (file: IFile) => IFile[];
}

export interface InputFileProps extends ICtrl<IFile[]> {
   refCtrl?: React.MutableRefObject<RefFile>;

   // File props
   lineHeight: number;
   multiple?: boolean;
   onUpload?: (state: IFileUpload) => void;
   onMore?: (file: IFile) => void;

   // Allow to overload the boxprops
   boxProps?: Mui.BoxProps;
}

const InputFile = (props: InputFileProps) => {
   // The state
   const theme = Mui.useTheme();

   // The props
   const {
      // ICtrl
      label,
      value,
      onChange = noChange,
      disabled = false,
      autoFocus = false,
      readOnly = false,
      required = false,
      // File
      lineHeight,
      multiple = false,
      onUpload,
      onMore,
      refCtrl: propsRefFile,
      // Box
      boxProps,
   } = props;

   const [focus, setFocus] = React.useState(false);
   const [files, setFiles] = React.useState<File[]>([]);
   const [progress, setProgress] = React.useState(0);
   const [stopUpload, setStopUpload] = React.useState<(() => void) | null>(null);
   const fileRef = useRefFile();
   const handleRefFile = fileRef.current.useHandler();
   // We need the value later
   fileRef.current.value = value;

   // Allow the caller to use the select functions
   if (propsRefFile) {
      propsRefFile.current = fileRef.current;
   }

   React.useEffect(() => {
      if (!files.length) return;

      async function upload() {
         if (!onUpload) return;

         const file = files[0];
         let stopped = false;
         setStopUpload(() => () => (stopped = true));
         setProgress(0);

         const endUpload = () => {
            const remaining = files.filter((p) => p !== file);
            setStopUpload(() => null);
            setFiles(remaining);
            if (!remaining.length) {
               fileRef.current.reset();
            }
         };

         const state: IFileUpload = {
            file,
            progress: (part) => setProgress(part),
            isStopped: () => stopped,
            canceled: endUpload,
            added: (newFile: IFile) => {
               endUpload();
               return fileRef.current.value ? [...fileRef.current.value, newFile] : [newFile];
            },
         };
         onUpload(state);
      }
      upload();
   }, [fileRef, files, onUpload, onChange, setStopUpload]);

   // The functions
   const handleRefInput = React.useCallback(
      (input: HTMLInputElement) => {
         if (input) {
            handleRefFile(input);
            input.onfocus = () => setFocus(true);
            input.onblur = () => setFocus(false);
            if (onUpload) {
               input.onchange = async () => {
                  if (!input.files || !input.files.length) {
                     return;
                  }
                  const inputFiles = input.files;
                  // Save the files
                  setFiles((files) => {
                     if (!inputFiles) {
                        return files;
                     }
                     const newFiles = [...files];
                     for (let i = 0; i < inputFiles.length; i++) {
                        const newFile = inputFiles.item(i);
                        if (newFile) {
                           newFiles.push(newFile);
                        }
                     }
                     return newFiles;
                  });
               };
            }
            if (autoFocus && fileRef.current) {
               fileRef.current.focus();
            }
         }
      },
      [handleRefFile, fileRef, autoFocus, setFocus, onUpload]
   );

   const onAddFile = React.useCallback<React.MouseEventHandler>(
      (event) => {
         event.preventDefault();
         fileRef.current.focus();
         fileRef.current.click();
      },
      [fileRef]
   );

   const onFocus = React.useCallback<React.MouseEventHandler>(
      (event) => {
         event.preventDefault();
         fileRef.current.focus();
      },
      [fileRef]
   );

   const onDeleteFile = React.useCallback(
      (file: IFile) => {
         if (value && value.find((p) => p === file)) {
            onChange(value.filter((p) => p !== file));
         }
      },
      [onChange, value]
   );

   // The markup
   return (
      <Mui.Box
         {...boxProps}
         position="relative"
         className={css({
            "&:hover .MuiOutlinedInput-notchedOutline": {
               borderColor: focus
                  ? theme.palette.primary.main
                  : theme.palette.getContrastText(theme.palette.background.default),
            },
            "&:focus-within .MuiOutlinedInput-notchedOutline": {
               borderColor: theme.palette.primary.main,
               borderWidth: 2,
            },
            "&:focus-within .MuiInputLabel-root": {
               color: theme.palette.primary.main,
            },
         })}
      >
         <Mui.FormControl
            variant="outlined"
            fullWidth
            disabled={disabled}
            required={required}
            sx={{
               pointerEvents: "none",
               position: "absolute",
               width: "100%",
               height: "100%",
            }}
         >
            {label && <Mui.InputLabel>{label}</Mui.InputLabel>}
            <Mui.OutlinedInput
               label={label || undefined}
               value=" "
               readOnly
               sx={{
                  height: "100%",
               }}
            />
         </Mui.FormControl>
         <input
            type={disabled || readOnly ? "text" : "file"}
            multiple={multiple}
            ref={handleRefInput}
            className={css({
               position: "absolute",
               width: 0,
               opacity: 0,
               left: -1000,
            })}
         />
         <Mui.Box
            padding={1}
            display="grid"
            gridTemplateColumns={`repeat(auto-fit, minmax(${(lineHeight * 3) / 2}px, 1fr))`}
            onClick={onFocus}
            gap={1}
            zIndex={1}
         >
            {value &&
               value.map((file, index) => (
                  <Mui.Paper key={index} elevation={0} square variant="outlined">
                     <Mui.Box
                        position="relative"
                        height={lineHeight}
                        sx={{
                           backgroundImage: `url(${file.previewUrl})`,
                           backgroundRepeat: "no-repeat",
                           backgroundSize: "contain",
                           backgroundPosition: "center center",
                        }}
                     >
                        {!readOnly && !disabled && (
                           <Mui.IconButton
                              size="small"
                              sx={{
                                 float: "right",
                                 opacity: 0.3,
                              }}
                              className={css({
                                 "&:hover": {
                                    opacity: 0.9,
                                 },
                              })}
                              onClick={onMore ? () => onMore(file) : () => onDeleteFile(file)}
                           >
                              {onMore ? <MoreIcon fontSize="small" /> : <DeleteIcon fontSize="small" />}
                           </Mui.IconButton>
                        )}
                        <InputInfo file={file} />
                     </Mui.Box>
                  </Mui.Paper>
               ))}
            {files.map((file, index) => (
               <Mui.Paper key={index} elevation={0} square variant="outlined">
                  <Mui.Box position="relative" height={lineHeight}>
                     {stopUpload && !index && (
                        <Mui.IconButton
                           size="small"
                           sx={{
                              float: "right",
                              opacity: 0.3,
                           }}
                           className={css({
                              "&:hover": {
                                 opacity: 0.9,
                              },
                           })}
                           onClick={stopUpload}
                        >
                           <StopIcon fontSize="small" />
                        </Mui.IconButton>
                     )}
                     <InputInfo file={file} progress={!index ? progress : undefined} />
                  </Mui.Box>
               </Mui.Paper>
            ))}
            {!readOnly && !disabled && !files.length && (
               <Mui.Paper elevation={0} square variant="outlined">
                  <Mui.Box
                     height={lineHeight}
                     display="flex"
                     alignItems="center"
                     justifyContent="center"
                     onClick={onAddFile}
                     className={css({
                        "&:hover .plus": {
                           color: focus ? theme.palette.primary.main : theme.palette.text.primary,
                        },
                     })}
                  >
                     <AddFileIcon
                        fontSize="large"
                        className={
                           "plus " +
                           css({
                              color: focus ? theme.palette.primary.main : Mui.alpha(theme.palette.text.primary, 0.3),
                           })
                        }
                     />
                  </Mui.Box>
               </Mui.Paper>
            )}
         </Mui.Box>
      </Mui.Box>
   );
};

export default InputFile;

// Allow to use hooks
export const useInputFile = genericHook(InputFile, useRefFile);
