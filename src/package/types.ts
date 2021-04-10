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

