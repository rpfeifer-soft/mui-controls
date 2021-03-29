/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import Address, { IAddress } from "../package/address";

export interface TestAddressProps extends Mui.BoxProps {}

const TestAddress = (props: TestAddressProps) => {
   // The state
   const [value, setValue] = React.useState<string>("");

   // The props
   const { ...boxProps } = props;

   // The functions
   const onChange = (address: IAddress | null) => {
      setValue(address ? address.label : "");
   };

   // The markup
   return (
      <Mui.Box {...boxProps}>
         <Address value={value} lat={48.87} lon={8.34} onChange={onChange} />
         <hr />
         <Mui.Paper
            sx={{
               padding: 1,
            }}
            variant="outlined"
         >
            value: '{JSON.stringify(value)}'
         </Mui.Paper>
      </Mui.Box>
   );
};

export default TestAddress;
