/** @format */

const noOp = () => { };
const noValue = () => '';

export type DSetRangeUpdate = (split: [string, string, string]) => [string, number, number] | null;

type DFocus = () => void;
type DSelect = (start: number, end: number, direction?: "forward" | "backward" | "none") => void;
type DValue = () => string;
type DSetRange = (replace: DSetRangeUpdate) => void;

class InputRef {
   private dBlur: DFocus = noOp;
   private dFocus: DFocus = noOp;
   private dSelect: DSelect = noOp;
   private dValue: DValue = noValue;
   private dSetRange: DSetRange = noOp;

   set(input: HTMLInputElement) {
      this.dBlur = !input ? noOp : () => input.blur();
      this.dFocus = !input ? noOp : () => input.focus();
      this.dSelect = !input
         ? noOp
         : (start, end, direction) => {
            if (input.type === 'number') {
               input.type = 'text';
               input.setSelectionRange(start, end, direction);
               input.type = 'number';
            } else {
               input.setSelectionRange(start, end, direction);
            }
         }
      this.dValue = !input ? noValue : () => input.value;
      this.dSetRange = (replace) => {
         if (!replace) {
            return;
         }
         let split: [string, string, string] = ['', '', ''];
         if (input) {
            const value = input.value;
            const start = input.selectionStart;
            const end = input.selectionEnd;
            if (start !== null) {
               if (end !== null) {
                  split = [value.substr(0, start), value.substr(start, end - start), value.substr(end)];
               } else {
                  split = [value.substr(0, start), '', value.substr(start)];
               }
            }
         }
         const update = replace(split);
         if (update !== null) {
            const [replacement, start, end] = update;
            input.setRangeText(replacement);
            input.setSelectionRange(start + (input.selectionStart || 0), end + (input.selectionStart || 0));
            input.dispatchEvent(new Event('change', { bubbles: true }));
         }
      };
   }

   select(start: number, end: number, direction?: "forward" | "backward" | "none") {
      this.dSelect(start, end, direction);
   }

   focus(start?: number, end?: number, direction?: "forward" | "backward" | "none") {
      if (start !== undefined && end !== undefined) {
         this.dSelect(start, end, direction);
      }
      this.dFocus();
   }

   blur() {
      this.dBlur();
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

   setRange(update: DSetRangeUpdate) {
      return this.dSetRange(update);
   }
}

export default InputRef;