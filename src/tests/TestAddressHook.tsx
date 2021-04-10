/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { useInputAddress } from "../package";
import { useActions, useChoice, useSwitch } from "../hooks";
import { OptionGroup } from "../components";
import UIContext from "../package/UIContext";
import { cachedAddress, searchAddress } from "../geoTools";

export interface TestAddressHookProps extends Mui.BoxProps {}

const TestAddressHook = (props: TestAddressHookProps) => {
   // The state
   const Address = useInputAddress(null, "Label");
   const [disabled, Disabled] = useSwitch("Disabled");
   const [readOnly, ReadOnly] = useSwitch("ReadOnly");
   const [required, Required] = useSwitch("Required");
   const [local, Local] = useSwitch("Local");
   const [variant, Variant] = useChoice("Variant", ["standard", "outlined", "filled", "square"] as const);
   const [noOptionsText, NoOptionsText] = useChoice("NoOptionsText", ["", "nicht gefunden"] as const);
   const Values = useActions("Init", ["", "Alte Ziegelei 2, 76316 Malsch"] as const);
   const Actions = useActions("Actions", ["Focus", "Select"] as const);
   const [limit, Limit] = useChoice("Limit", ["", "5", "10"] as const);

   // The props
   const { ...boxProps } = props;

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
            <Address.Box
               autoFocus
               disabled={disabled}
               readOnly={readOnly}
               required={required}
               variant={variant}
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
            value: '{JSON.stringify(Address.value)}'
         </Mui.Paper>
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
                  Address.setValue({ description });
               } else {
                  Address.setValue(null);
               }
               return true;
            }}
         />
         <Actions
            onChosen={(chosen) => {
               if (chosen === "Focus") {
                  Address.focus();
               } else if (chosen === "Select") {
                  Address.select();
               }
            }}
         />
      </Mui.Box>
   );
};

export default TestAddressHook;
