/** @format */

const noOp = () => {};
const noValue = () => '';

type DFocus = () => void;
type DSelect = (start: number, end: number, direction?: "forward" | "backward" | "none") => void;
type DValue = () => string;

class InputRef {
   private dFocus: DFocus = noOp;
   private dSelect: DSelect = noOp;
   private dValue: DValue = noValue;

   set(input: HTMLInputElement) {
      this.dFocus = !input ? noOp : () => input.focus();
      this.dSelect = !input
         ? noOp 
         : (start, end, direction) => {
            if(input.type === 'number') {
               input.type = 'text';
               input.setSelectionRange(start, end, direction);
               input.type = 'number';
            } else {
               input.setSelectionRange(start, end, direction);
            }
         }
      this.dValue = !input ? noValue : () => input.value;
   }

   select(start: number, end: number, direction?: "forward" | "backward" | "none") {
      this.dSelect(start, end, direction);
   }

   focus(start?: number, end?: number, direction?: "forward" | "backward" | "none") {
      if(start !== undefined && end !== undefined) {
         this.dSelect(start, end, direction);
      }
      this.dFocus();
   }

   focusStart() {
      this.dSelect(0, 0);
      this.dFocus();
   }

   focusEnd() {
      const length = this.dValue().length;
      this.dSelect(length, length);
      this.dFocus();
   }
   
   focusAll() {
      const length = this.dValue().length;
      this.dSelect(0, length);
      this.dFocus();
   }
}

export default InputRef;