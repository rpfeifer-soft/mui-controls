
export interface ICtrl<T> {
   label?: string;
   value: T | null;
   disabled?: boolean;
   readOnly?: boolean;
   required?: boolean;
   autoFocus?: boolean;

   onChange?: (value: T | null) => void;
}

export interface IAddress {
   description: string;
   lat?: number;
   lon?: number;
}

export function noChange<T>(value: T | null) { }

type HookOption = "fixLabel" | "fixValue";
export type HookOptions = Partial<{ [id in HookOption]: boolean }>;

export interface IRefCtrl {
   focus: () => void;
   select: () => void;
}

export class NumberParser {
   private group: RegExp;
   private decimal: RegExp;
   private numeral: RegExp;
   private index: (d: any) => string;

   constructor(locale: string) {
      const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
      const numerals = Array.from(Intl.NumberFormat(locale, { useGrouping: false }).format(9876543210)).reverse();
      const index = new Map(numerals.map((d, i) => [d, i]));
      this.group = new RegExp(`[${parts.find(d => d.type === "group")?.value}]`, "g");
      this.decimal = new RegExp(`[${parts.find(d => d.type === "decimal")?.value}]`);
      this.numeral = new RegExp(`[${numerals.join("")}]`, "g");
      this.index = d => String(index.get(d));
   }
   parse(text: string) {
      text = text.trim()
         .replace(this.group, "")
         .replace(this.decimal, ".")
         .replace(this.numeral, this.index);
      return text ? +text : NaN;
   }
}