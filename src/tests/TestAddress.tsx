/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { InputAddress, useRefAddress } from "../package";
import { useActions, useChoice, useSwitch } from "../hooks";
import { OptionGroup } from "../components";
import UIContext from "../package/UIContext";
import { IAddress } from "../package/types";
import { cachedAddress, searchAddress } from "../geoTools";

export interface TestAddressProps extends Mui.BoxProps {}

const TestAddress = (props: TestAddressProps) => {
   // The state
   const refAddress = useRefAddress();
   const [value, setValue] = React.useState<IAddress | null>(null);
   const [label, Label] = useChoice("Label", ["", "Address"] as const);
   const [disabled, Disabled] = useSwitch("Disabled");
   const [readOnly, ReadOnly] = useSwitch("ReadOnly");
   const [required, Required] = useSwitch("Required");
   const [local, Local] = useSwitch("Local");
   const [variant, Variant] = useChoice("Variant", ["standard", "outlined", "filled"] as const);
   const [noOptionsText, NoOptionsText] = useChoice("NoOptionsText", ["", "nicht gefunden"] as const);
   const Values = useActions("Init", ["", "Alte Ziegelei 2, 76316 Malsch"] as const);
   const Actions = useActions("Actions", ["Focus", "Select"] as const);
   const [limit, Limit] = useChoice("Limit", ["", "5", "10"] as const);

   // The props
   const { ...boxProps } = props;

   // The functions
   const onChange = (address: IAddress | null) => {
      setValue(address);
   };

   // The markup
   return (
      <Mui.Box {...boxProps}>
         <UIContext
            value={{
               cachedAddress: (text) =>
                  cachedAddress(text, limit ? Number(limit) : 3, local ? 48.87 : undefined, local ? 8.34 : undefined),
               searchAddress: (text) =>
                  searchAddress(text, limit ? Number(limit) : 3, local ? 48.87 : undefined, local ? 8.34 : undefined),
            }}
         >
            <InputAddress
               autoFocus
               label={label}
               value={value}
               disabled={disabled}
               readOnly={readOnly}
               required={required}
               variant={variant}
               onChange={onChange}
               refCtrl={refAddress}
               noOptionsText={noOptionsText || undefined}
            />
         </UIContext>
         <hr />
         <Mui.Paper
            sx={{
               padding: 1,
            }}
            variant="outlined"
         >
            value: '{JSON.stringify(value)}'
         </Mui.Paper>
         <Label />
         <Variant />
         <OptionGroup title="Options">
            <Disabled />
            <ReadOnly />
            <Required />
            <Local />
         </OptionGroup>
         <NoOptionsText />
         <Limit />
         <Values
            onChosen={(description) => {
               if (description) {
                  setValue({ description });
               } else {
                  setValue(null);
               }
               return true;
            }}
         />
         <Actions
            onChosen={(chosen) => {
               if (chosen === "Focus") {
                  refAddress.current.focus();
               } else if (chosen === "Select") {
                  refAddress.current.select();
               }
            }}
         />
      </Mui.Box>
   );
};

export default TestAddress;
