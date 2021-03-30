/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";
import { ICtrl } from "../types";

export interface IAddress {
   description: string;
   lat?: number;
   lon?: number;
}

// interface IRequestCache {
//    [searchUrl: string]: IAddress[];
// }

// const requestCache: IRequestCache = {};

function addRequest(searchUrl: string, result: IAddress[]): IAddress[] {
   // requestCache[searchUrl] = result;
   localStorage.setItem(searchUrl, JSON.stringify(result));
   return result;
}
function getRequest(searchUrl: string): IAddress[] | undefined {
   // return requestCache[searchUrl];
   const json = localStorage.getItem(searchUrl);
   return json ? JSON.parse(json) : undefined;
}

function photonUrl(searchFor: string, lat?: number, lon?: number) {
   if (searchFor.length < 4) return "";

   const location = lat !== undefined && lon !== undefined ? `lat=${lat}&lon=${lon}&` : "";
   return `https://photon.komoot.io/api?limit=3&${location}q=${encodeURIComponent(searchFor)}`;
}

function cachedAddress(searchFor: string, lat?: number, lon?: number) {
   const searchUrl = photonUrl(searchFor, lat, lon);
   if (!searchUrl) {
      return [];
   }
   return getRequest(searchUrl);
}

async function searchAddress(searchFor: string, lat?: number, lon?: number): Promise<IAddress[]> {
   const searchUrl = photonUrl(searchFor, lat, lon);
   if (!searchUrl) {
      return [];
   }

   const response = await fetch(searchUrl);
   if (!response.ok) return [];

   const json = JSON.parse(await response.text());
   console.log(json);
   if (json.type === "FeatureCollection" && Array.isArray(json.features) && json.features.length > 0) {
      const addresses = json.features.map((feature: any) => {
         const [longitude, latitude] =
            feature.geometry && feature.geometry.coordinates ? feature.geometry.coordinates : [];
         let description = searchFor;
         const { type, name, country, county, postcode, city, street, housenumber } = feature.properties;
         console.log(type, feature.properties);
         switch (type) {
            case "city":
               description = county ? `${name}, ${county}, ${country}` : `${name}, ${country}`;
               break;
            case "locality":
               description = city ? `${name}, ${city}, ${country}` : `${name}, ${country}`;
               break;
            case "street":
               description = housenumber
                  ? `${name} ${housenumber}, ${postcode} ${city}, ${country}`
                  : `${name}, ${postcode} ${city}, ${country}`;
               break;
            case "house":
               if (!housenumber) {
                  return null;
               }
               description = `${street} ${housenumber}, ${postcode} ${city}, ${country}`;
               break;
         }
         console.log(description);
         const address: IAddress = {
            description,
            lat: latitude,
            lon: longitude,
         };
         return address;
      });
      const valids = addresses.filter((address: IAddress | null) => Boolean(address)) as IAddress[];
      const uniques: IAddress[] = [];
      valids.forEach((valid) => {
         if (!uniques.find((unique) => unique.description === valid.description)) {
            uniques.push(valid);
         }
      });
      return addRequest(searchUrl, uniques);
   }
   return addRequest(searchUrl, searchFor ? [{ description: searchFor }] : []);
}

interface IState {
   current: string;
   options: IAddress[];
   searchFor: string;
   loading: boolean;
   open: boolean;
   selected: number;
}

function setOptions(state: IState, options: IAddress[]) {
   let selected = state.selected;
   if (selected >= 0) {
      // Check for valid selection
      if (options.length <= selected || options[selected].description !== state.options[selected].description) {
         selected = -1;
      }
   }
   return { ...state, options, loading: false, selected };
}

export interface AddressProps extends ICtrl<IAddress>, Omit<Mui.BoxProps, "onChange"> {
   variant?: Mui.TextFieldProps["variant"];

   requestDelay?: number;
   lat?: number;
   lon?: number;

   noOptionsText?: string;
}

const Address = (props: AddressProps) => {
   // The props
   const {
      // ICtrl
      label,
      value,
      onChange,
      disabled,
      readOnly,
      required,
      autoFocus,
      // Address
      variant,
      requestDelay = 500,
      lat,
      lon,
      noOptionsText = "-",
      // Box
      ...boxProps
   } = props;

   // The state
   const [state, setState] = React.useState<IState>({
      current: value ? value.description : "",
      options: [],
      searchFor: "",
      loading: false,
      open: false,
      selected: -1,
   });

   React.useEffect(() => {
      setState((state) => ({ ...state, value }));
   }, [value]);

   React.useEffect(() => {
      if (!state.open) {
         // Only search when open or not cached
         return;
      }
      const cachedAnswer = cachedAddress(state.searchFor, lat, lon);
      if (cachedAnswer) {
         setState((state) => setOptions(state, cachedAnswer));
         return;
      }
      setState((state) => ({ ...state, loading: true }));

      // Start the delay
      const timer = setTimeout(async () => {
         const options = await searchAddress(state.searchFor, lat, lon);
         setState((state) => setOptions(state, options));
      }, requestDelay);
      // Return clean up function for delay
      return ((timerToClear: NodeJS.Timer) => () => {
         clearTimeout(timerToClear);
         setState((state) => ({ ...state, loading: false }));
      })(timer);
   }, [state.open, state.searchFor, requestDelay, lat, lon]);

   // The functions
   const onInputChange = React.useMemo(
      () => (event: React.ChangeEvent<HTMLInputElement>) => {
         const newValue = event.target.value;
         setState((state) => {
            if (value && !newValue && !required) {
               // This must change the newValue
               setTimeout(() => onChange(null));
            }
            return {
               ...state,
               current: newValue,
               searchFor: newValue,
               open: newValue.length >= 4,
            };
         });
      },
      [required, onChange, value]
   );

   const onInputKeyDown = React.useMemo(
      () => (event: React.KeyboardEvent<HTMLInputElement>) => {
         console.log(event.key);
         setState((state) => {
            switch (event.key) {
               case "Escape":
                  if (state.open) {
                     event.preventDefault();
                     return { ...state, open: false };
                  }
                  break;

               case "Enter":
                  event.preventDefault();
                  if (state.open && state.selected >= 0 && state.options.length > state.selected) {
                     const option = state.options[state.selected];
                     // Inform the parent
                     if (onChange) {
                        setTimeout(() => onChange(option), 0);
                     }
                     return {
                        ...state,
                        selected: -1,
                        open: false,
                        current: option.description,
                     };
                  }
                  break;

               case "ArrowUp":
                  if (state.open) {
                     event.preventDefault();
                     return {
                        ...state,
                        selected: Math.max(state.selected - 1, 0),
                     };
                  }
                  break;

               case "ArrowDown":
                  if (state.open) {
                     event.preventDefault();
                     return {
                        ...state,
                        selected: Math.min(state.selected + 1, state.options.length - 1),
                     };
                  } else if (state.current.length >= 4) {
                     return {
                        ...state,
                        open: true,
                        selected: state.options.findIndex((option) => option.description === state.current),
                     };
                  }
                  break;
            }
            return state;
         });
      },
      [onChange]
   );

   const onInputBlur = React.useMemo(
      () => (event: React.FocusEvent<HTMLInputElement>) => {
         // Leave the current value
         setState((state) => ({
            ...state,
            open: false,
            current: value ? value.description : "",
         }));
      },
      [value]
   );

   // The markup
   return (
      <Mui.Box {...boxProps} sx={{ position: "relative" }}>
         <Mui.TextField
            label={label}
            required={required}
            disabled={disabled}
            variant={variant}
            InputProps={{
               readOnly,
            }}
            autoFocus={autoFocus}
            value={state.current}
            onChange={onInputChange}
            onKeyDown={onInputKeyDown}
            onBlur={onInputBlur}
            fullWidth
         />
         {state.open && (
            <Mui.Paper sx={{ padding: 2, position: "absolute", left: 0, right: 0, zIndex: 9999 }}>
               {state.loading && <Mui.LinearProgress />}
               {!state.loading && !state.options.length && noOptionsText}
               {!state.loading &&
                  Boolean(state.options.length) &&
                  state.options.map((option, index) => (
                     <Mui.Box
                        sx={{
                           color: index === state.selected ? "#F00" : undefined,
                        }}
                        key={option.description}
                     >
                        {option.description}
                     </Mui.Box>
                  ))}
            </Mui.Paper>
         )}
      </Mui.Box>
   );
};

export default Address;
