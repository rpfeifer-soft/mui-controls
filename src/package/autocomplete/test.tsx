/** @format */

import * as React from 'react';
import { observer } from 'mobx-react';
import { makeAutoObservable } from 'mobx';
import { Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import Autocomplete from '.';
import InputRef from '../InputRef';

type HtmlDivProps = React.DetailedHTMLProps<
   React.HtmlHTMLAttributes<HTMLDivElement>, HTMLDivElement
>;

export interface AutoCompleteTestProps extends HtmlDivProps {
}

type variantTypes = "standard" | "outlined" | "filled";

class TestState {
   value: string = '';
   variant: variantTypes = "standard";
   inDialog = false;
   options: string[] = [];
   inputRef = new InputRef();

   constructor() {
      makeAutoObservable(this);
   }

   setValue(value: string) {
      this.value = value;
   }

   setVariant(variant: variantTypes) {
      this.variant = variant;
   }

   setInDialog(inDialog: boolean) {
      this.inDialog = inDialog;
   }

   setOptions(options: string[]) {
      this.options = options;
   }
}
const c_options = ["Almuth", "Anastasia", "André", "Andreas", "Angelika", "Anke", "Anna", "Birgit", "Britta", "Caro", "Carsten", "Chrissi", "Christiane", "Christoph", "Christopher", "Clemens", "Dani", "David", "Dennis", "Didi", "Dirk", "Dmitrij", "Erhard", "Fabian", "Fee", "Franzi H.", "Franzi Z.", "Gabi H.", "Gabi Ho.", "Gabi R.", "Georgia", "Hagen", "Hamid", "Hannah", "Hannah R.", "Hanni", "Harald", "Helmuth", "Holger", "Irina", "Ivo", "Jakob H.", "Jane Doe (72)", "Jannik", "Jens M.", "Jochen", "Johannes K.", "Jonathan", "Jörg", "Juli", "Julia A.", "Julia F.", "Jürgen K.", "Jürgen R.", "Kai", "Katja", "Lisa", "Manfredo", "Manuela", "Marc", "Marie", "Marie M.", "Mario", "Mark M.", "Martin", "Matthias", "Milena B.", "Mira", "Moritz", "Naomi", "Nora R.", "Nora S.", "Norbert", "Norm", "Patrick", "Philipp", "Ralf S.", "Ralf Schä.", "René", "Rolf", "Rudi", "Sabine D.", "Sarah", "Sarah L.", "Sebastian", "Sebastian R.", "Sergey", "Siggi", "Steffen", "Sternchen", "Susann", "Sylvie", "Tamara", "Tim E.", "Timme", "Timo", "Tom", "Tony M.", "Ute", "Wolfgang", "Wolfram", "Yvonne"];
const AutoCompleteTest = observer(({children, ...props}: React.PropsWithChildren<AutoCompleteTestProps>) => {
   const [state] = React.useState(new TestState());
   return (
      <div {...props}>
         {state.inDialog ? (
            <Dialog open={state.inDialog} onClose={() => state.setInDialog(false)}>
               <DialogTitle>Anmeldung erforderlich</DialogTitle>
               <DialogContent>
                  <Typography gutterBottom>
                     Um die volle Funktionalität nutzen zu können, müssen Sie sich anmelden.
                  </Typography>
                  <Typography gutterBottom>
                     Bitte wählen Sie Ihren Benutzer aus, und lassen sie sich einen aktuellen Zugangscode zusenden.
                     Diesen können Sie dann im Anschluss zur Anmeldung verwenden.
                  </Typography>
                  <Autocomplete
                     label="Autocomplete of strings"
                     autoFocus
                     fullwidth
                     variant={state.variant}
                     options={state.options}
                     selected={state.value}
                     noOptionsText="Keine Werte!"
                     onChange={(value) => state.setValue(value || '')}
                     getLabel={(entry) => entry}
                  />
               </DialogContent>
               <DialogActions>
                  <Button
                     onClick={() => state.setOptions(c_options)}
                     children={`Laden`}
                     />
                  <Button
                     onClick={() => state.setInDialog(false)}
                     color="primary"
                     children={`Schließen`}
                  />
               </DialogActions>
            </Dialog>
         ) : (
            <Autocomplete
               label="Autocomplete of strings"
               autoFocus
               fullwidth
               variant={state.variant}
               options={state.options}
               selected={state.value}
               noOptionsText="Keine Werte!"
               inputRef={state.inputRef}
               onChange={(value) => state.setValue(value || '')}
               getLabel={(entry) => entry}
            />
         )}
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
         <ButtonGroup style={{marginLeft: 8}}>
            <Button
               onClick={() => state.setOptions(c_options)}>Laden</Button>
            <Button
               onClick={() => state.setInDialog(true)}
               variant={state.inDialog ? "contained" : undefined}>Dialog</Button>
         </ButtonGroup>
         <ButtonGroup style={{marginLeft: 8}}>
            <Button
               onClick={() => state.setValue("René")}
               variant={state.value === 'René' ? "contained" : undefined}>René</Button>
            <Button
               onClick={() => state.setValue('')}
               variant={!state.value ? "contained" : undefined}>Clear</Button>
         </ButtonGroup>
         <ButtonGroup style={{marginLeft: 8}}>
            <Button
               onClick={() => state.inputRef.focusEnd()}>Focus</Button>
            <Button
               onClick={() => state.inputRef.focusAll()}>Select</Button>
         </ButtonGroup>
      </div>
   );
});

export default AutoCompleteTest;