/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import Address, { IAddress } from "../package/address";
import { useChoice, useSwitch } from "../hooks";
import { OptionGroup } from "../components";

export interface TestAddressProps extends Mui.BoxProps {}

const TestAddress = (props: TestAddressProps) => {
   // The state
   const [value, setValue] = React.useState<IAddress | null>(null);
   const [label, Label] = useChoice("Label", ["", "Address"] as const);
   const [disabled, Disabled] = useSwitch("Disabled");
   const [readOnly, ReadOnly] = useSwitch("ReadOnly");
   const [required, Required] = useSwitch("Required");
   const [variant, Variant] = useChoice("Variant", ["standard", "outlined", "filled"] as const);
   const [noOptionsText, NoOptionsText] = useChoice("NoOptionsText", ["", "nicht gefunden"] as const);

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
            lat={48.87}
            lon={8.34}
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
         </OptionGroup>
         <NoOptionsText />
      </Mui.Box>
   );
};

export default TestAddress;
