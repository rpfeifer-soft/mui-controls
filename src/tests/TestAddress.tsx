/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import Address, { IAddress } from "../package/address";
import { useActions, useChoice, useSwitch } from "../hooks";
import { OptionGroup } from "../components";

export interface TestAddressProps extends Mui.BoxProps {}

const TestAddress = (props: TestAddressProps) => {
   // The state
   const [value, setValue] = React.useState<IAddress | null>(null);
   const [label, Label] = useChoice("Label", ["", "Address"] as const);
   const [disabled, Disabled] = useSwitch("Disabled");
   const [readOnly, ReadOnly] = useSwitch("ReadOnly");
   const [required, Required] = useSwitch("Required");
   const [local, Local] = useSwitch("Local");
   const [variant, Variant] = useChoice("Variant", ["standard", "outlined", "filled"] as const);
   const [noOptionsText, NoOptionsText] = useChoice("NoOptionsText", ["", "nicht gefunden"] as const);
   const Values = useActions("Init", ["", "Alte Ziegelei 2, 76316 Malsch"] as const);
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
         <Address
            autoFocus
            label={label}
            value={value}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            variant={variant}
            requestLimit={limit ? Number(limit) : undefined}
            lat={local ? 48.87 : undefined}
            lon={local ? 8.34 : undefined}
            onChange={onChange}
            noOptionsText={noOptionsText || undefined}
         />
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
      </Mui.Box>
   );
};

export default TestAddress;
