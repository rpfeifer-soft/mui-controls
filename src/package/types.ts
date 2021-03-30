export interface ICtrl<T> {
   label?: string;
   value: T | null;
   disabled?: boolean;
   readOnly?: boolean;
   required?: boolean;
   autoFocus?: boolean;

   onChange: (value: T | null) => void;
}