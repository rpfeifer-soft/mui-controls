/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { InputSelect, useRefSelect, useSingleSelect } from "../package";
import { useActions, useChoice, useMessage, useSwitch } from "../hooks";
import { OptionGroup } from "../components";

interface Option {
   label: string;
   id: string;
}

const allOptions: Option[] = [
   { label: "Almuth", id: "A" },
   { label: "Anastasia", id: "A" },
   { label: "André", id: "A" },
   { label: "Andreas", id: "A" },
   { label: "Angelika", id: "A" },
   { label: "Anke", id: "A" },
   { label: "Anna", id: "A" },
   { label: "Birgit", id: "B" },
   { label: "Britta", id: "B" },
   { label: "Caro", id: "C" },
   { label: "Carsten", id: "C" },
   { label: "Chrissi", id: "C" },
   { label: "Christiane", id: "C" },
   { label: "Christoph", id: "C" },
   { label: "Christopher", id: "C" },
   { label: "Clemens", id: "C" },
   { label: "Dani", id: "D" },
   { label: "David", id: "D" },
   { label: "Dennis", id: "D" },
   { label: "Didi", id: "D" },
   { label: "Dirk", id: "D" },
   { label: "Dmitrij", id: "D" },
   { label: "Erhard", id: "E" },
   { label: "Fabian", id: "F" },
   { label: "Fee", id: "F" },
   { label: "Franzi H.", id: "F" },
   { label: "Franzi Z.", id: "F" },
   { label: "Gabi H.", id: "G" },
   { label: "Gabi Ho.", id: "G" },
   { label: "Gabi R.", id: "G" },
   { label: "Georgia", id: "G" },
   { label: "Hagen", id: "H" },
   { label: "Hamid", id: "H" },
   { label: "Hannah", id: "H" },
   { label: "Hannah R.", id: "H" },
   { label: "Hanni", id: "H" },
   { label: "Harald", id: "H" },
   { label: "Helmuth", id: "H" },
   { label: "Holger", id: "H" },
   { label: "Irina", id: "I" },
   { label: "Ivo", id: "I" },
   { label: "Jakob H.", id: "J" },
   { label: "Jane Doe (72)", id: "J" },
   { label: "Jannik", id: "J" },
   { label: "Jens M.", id: "J" },
   { label: "Jochen", id: "J" },
   { label: "Johannes K.", id: "J" },
   { label: "Jonathan", id: "J" },
   { label: "Jörg", id: "J" },
   { label: "Juli", id: "J" },
   { label: "Julia A.", id: "J" },
   { label: "Julia F.", id: "J" },
   { label: "Jürgen K.", id: "J" },
   { label: "Jürgen R.", id: "J" },
   { label: "Kai", id: "K" },
   { label: "Katja", id: "K" },
   { label: "Lisa", id: "L" },
   { label: "Manfredo", id: "M" },
   { label: "Manuela", id: "M" },
   { label: "Marc", id: "M" },
   { label: "Marie", id: "M" },
   { label: "Marie M.", id: "M" },
   { label: "Mario", id: "M" },
   { label: "Mark M.", id: "M" },
   { label: "Martin", id: "M" },
   { label: "Matthias", id: "M" },
   { label: "Milena B.", id: "M" },
   { label: "Mira", id: "M" },
   { label: "Moritz", id: "M" },
   { label: "Naomi", id: "N" },
   { label: "Nora R.", id: "N" },
   { label: "Nora S.", id: "N" },
   { label: "Norbert", id: "N" },
   { label: "Norm", id: "N" },
   { label: "Patrick", id: "P" },
   { label: "Philipp", id: "P" },
   { label: "Ralf S.", id: "R" },
   { label: "Ralf Schä.", id: "R" },
   { label: "René", id: "R" },
   { label: "Rolf", id: "R" },
   { label: "Rudi", id: "R" },
   { label: "Sabine D.", id: "S" },
   { label: "Sarah", id: "S" },
   { label: "Sarah L.", id: "S" },
   { label: "Sebastian", id: "S" },
   { label: "Sebastian R.", id: "S" },
   { label: "Sergey", id: "S" },
   { label: "Siggi", id: "S" },
   { label: "Steffen", id: "S" },
   { label: "Sternchen", id: "S" },
   { label: "Susann", id: "S" },
   { label: "Sylvie", id: "S" },
   { label: "Tamara", id: "T" },
   { label: "Tim E.", id: "T" },
   { label: "Timme", id: "T" },
   { label: "Timo", id: "T" },
   { label: "Tom", id: "T" },
   { label: "Tony M.", id: "T" },
   { label: "Ute", id: "U" },
   { label: "Wolfgang", id: "W" },
   { label: "Wolfram", id: "W" },
   { label: "Yvonne", id: "Y" },
];

export interface TestSelectProps extends Mui.BoxProps {
   hook?: boolean;
}

const TestSelect = (props: TestSelectProps) => {
   // The state
   const refSelect = useRefSelect();
   const [label, Label] = useChoice("Label", ["", "Label"] as const, "Label");
   const [value, setValue] = React.useState<Option | null>(null);

   const Select = useSingleSelect<Option>()(null, "Label");

   const [showMessage, Message] = useMessage();
   const [disabled, Disabled] = useSwitch("Disabled");
   const [readOnly, ReadOnly] = useSwitch("ReadOnly");
   const [required, Required] = useSwitch("Required");
   const [async, Async] = useSwitch("Async");
   const [grouped, Grouped] = useSwitch("Grouped");
   const [ownLabels, OwnLabels] = useSwitch("OwnLabels");
   const [ownFilter, OwnFilter] = useSwitch("OwnFilter");
   const [variant, Variant] = useChoice("Variant", ["standard", "outlined", "filled"] as const);
   const [options, setOptions] = React.useState<Option[]>([]);
   const [loading, setLoading] = React.useState(false);
   const Actions = useActions("Actions", ["", "René", "Yvonne", "Focus", "Select"] as const);

   React.useEffect(() => {
      setOptions(async ? [] : allOptions);
   }, [async]);

   // The props
   const { hook = false, ...boxProps } = props;

   // The functions
   const onOpen = () => {
      if (options.length === 0) {
         setLoading(true);
         setTimeout(() => {
            setOptions(allOptions);
         }, 2000);
      }
   };

   Select.onChange = React.useCallback(
      (value) => {
         showMessage(JSON.stringify(value));
         return value;
      },
      [showMessage]
   );

   // The markup
   return (
      <Mui.Box {...boxProps}>
         {hook ? (
            <Select.Box
               type="Single"
               autoFocus
               variant={variant}
               disabled={disabled}
               readOnly={readOnly}
               required={required}
               options={options}
               getLabel={ownLabels ? (option) => option.label.toUpperCase() : undefined}
               filterOptions={
                  ownFilter ? (options, text) => options.filter((option) => option.label.includes(text)) : undefined
               }
               loading={loading}
               onOpen={onOpen}
               groupBy={grouped ? (value) => value.id : undefined}
            />
         ) : (
            <InputSelect
               autoFocus
               type="Single"
               label={label}
               value={value}
               variant={variant}
               disabled={disabled}
               readOnly={readOnly}
               required={required}
               options={options}
               getLabel={ownLabels ? (option) => option.label.toUpperCase() : undefined}
               filterOptions={
                  ownFilter ? (options, text) => options.filter((option) => option.label.includes(text)) : undefined
               }
               loading={loading}
               refCtrl={refSelect}
               onChange={(value) => {
                  setValue(value);
                  showMessage(JSON.stringify(value));
               }}
               onOpen={onOpen}
               groupBy={grouped ? (value) => value.id : undefined}
            />
         )}
         <hr />
         <Mui.Paper
            sx={{
               padding: 1,
            }}
            variant="outlined"
         >
            value: '{JSON.stringify(hook ? Select.value : value)}'
         </Mui.Paper>
         {!hook && <Label />}
         <Variant />
         <OptionGroup title="Options">
            <Disabled />
            <ReadOnly />
            <Required />
            <Async />
         </OptionGroup>
         <OptionGroup title="Own">
            <Grouped />
            <OwnLabels />
            <OwnFilter />
         </OptionGroup>
         <Actions
            onChosen={(chosen) => {
               if (chosen === "Focus") {
                  hook ? Select.focus() : refSelect.current.focus();
               } else if (chosen === "Select") {
                  hook ? Select.select() : refSelect.current.select();
               } else {
                  (hook ? Select.setValue : setValue)(options.find((option) => option.label === chosen) || null);
               }
            }}
         />
         <Message />
      </Mui.Box>
   );
};

export default TestSelect;
