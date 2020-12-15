/** @format */

import * as React from 'react';
import { observer } from 'mobx-react';
import { makeAutoObservable } from 'mobx';
import { Button, ButtonGroup } from '@material-ui/core';
import Autocomplete from '.';

type HtmlDivProps = React.DetailedHTMLProps<
   React.HtmlHTMLAttributes<HTMLDivElement>, HTMLDivElement
>;

export interface AutoCompleteTestProps extends HtmlDivProps {
}

type variantTypes = "standard" | "outlined" | "filled";

class TestState {
   value: string = '';
   variant: variantTypes = "standard";

   constructor() {
      makeAutoObservable(this);
   }

   setValue(value: string) {
      this.value = value;
   }

   setVariant(variant: variantTypes) {
      this.variant = variant;
   }
}
const options = ["Almuth", "Anastasia", "André", "Andreas", "Angelika", "Anke", "Anna", "Birgit", "Britta", "Caro", "Carsten", "Chrissi", "Christiane", "Christoph", "Christopher", "Clemens", "Dani", "David", "Dennis", "Didi", "Dirk", "Dmitrij", "Erhard", "Fabian", "Fee", "Franzi H.", "Franzi Z.", "Gabi H.", "Gabi Ho.", "Gabi R.", "Georgia", "Hagen", "Hamid", "Hannah", "Hannah R.", "Hanni", "Harald", "Helmuth", "Holger", "Irina", "Ivo", "Jakob H.", "Jane Doe (72)", "Jannik", "Jens M.", "Jochen", "Johannes K.", "Jonathan", "Jörg", "Juli", "Julia A.", "Julia F.", "Jürgen K.", "Jürgen R.", "Kai", "Katja", "Lisa", "Manfredo", "Manuela", "Marc", "Marie", "Marie M.", "Mario", "Mark M.", "Martin", "Matthias", "Milena B.", "Mira", "Moritz", "Naomi", "Nora R.", "Nora S.", "Norbert", "Norm", "Patrick", "Philipp", "Ralf S.", "Ralf Schä.", "René", "Rolf", "Rudi", "Sabine D.", "Sarah", "Sarah L.", "Sebastian", "Sebastian R.", "Sergey", "Siggi", "Steffen", "Sternchen", "Susann", "Sylvie", "Tamara", "Tim E.", "Timme", "Timo", "Tom", "Tony M.", "Ute", "Wolfgang", "Wolfram", "Yvonne"];
const AutoCompleteTest = observer(({children, ...props}: React.PropsWithChildren<AutoCompleteTestProps>) => {
   const [state] = React.useState(new TestState());
   return (
      <div {...props}>
         <Autocomplete
            label="Autocomplete of strings"
            options={options}
            selected={state.value}
            onChange={(value) => state.setValue(value || '')}
            getLabel={(entry) => entry}
            textProps={{
               autoFocus: true,
               fullWidth: true,
               variant: state.variant
            }} 
         />
         <hr style={{ marginTop: 256}}/>
         Value: '{state.value}'
         <hr/>
         <ButtonGroup>
            <Button 
               onClick={() => state.setVariant('standard')} 
               variant={state.variant === "standard" ? "contained" : undefined}>Standard</Button>
            <Button 
               onClick={() => state.setVariant('outlined')}
               variant={state.variant === "outlined" ? "contained" : undefined}>Outlined</Button>
            <Button 
               onClick={() => state.setVariant('filled')}
               variant={state.variant === "filled" ? "contained" : undefined}>Filled</Button>
         </ButtonGroup>
      </div>
   );
});

export default AutoCompleteTest;