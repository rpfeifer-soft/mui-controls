/** @format */

import * as React from "react";
import * as Mui from "@material-ui/core";

export interface IAddress {
   label: string;
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
         let label = searchFor;
         const { type, name, country, county, postcode, city, street, housenumber } = feature.properties;
         console.log(type, feature.properties);
         switch (type) {
            case "city":
               label = county ? `${name}, ${county}, ${country}` : `${name}, ${country}`;
               break;
            case "locality":
               label = city ? `${name}, ${city}, ${country}` : `${name}, ${country}`;
               break;
            case "street":
               label = housenumber
                  ? `${name} ${housenumber}, ${postcode} ${city}, ${country}`
                  : `${name}, ${postcode} ${city}, ${country}`;
               break;
            case "house":
               if (!housenumber) {
                  return null;
               }
               label = `${street} ${housenumber}, ${postcode} ${city}, ${country}`;
               break;
         }
         console.log(label);
         const address: IAddress = {
            label,
            lat: latitude,
            lon: longitude,
         };
         return address;
      });
      const valids = addresses.filter((address: IAddress | null) => Boolean(address)) as IAddress[];
      const uniques: IAddress[] = [];
      valids.forEach((valid) => {
         if (!uniques.find((unique) => unique.label === valid.label)) {
            uniques.push(valid);
         }
      });
      return addRequest(searchUrl, uniques);
   }
   return addRequest(searchUrl, searchFor ? [{ label: searchFor }] : []);
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
      if (options.length <= selected || options[selected].label !== state.options[selected].label) {
         selected = -1;
      }
   }
   return { ...state, options, loading: false, selected };
}

export interface AddressProps extends Omit<Mui.BoxProps, "onChange"> {
   value: string;
   requestDelay?: number;
   lat?: number;
   lon?: number;

   onChange?: (value: IAddress | null) => void;
}

const Address = (props: AddressProps) => {
   // The props
   const { value, onChange, requestDelay = 500, lat, lon, ...boxProps } = props;

   // The state
   const [state, setState] = React.useState<IState>({
      current: value,
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
         const value = event.target.value;
         setState((state) => ({
            ...state,
            current: value,
            searchFor: value,
            open: value.length >= 4,
         }));
      },
      []
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
                        current: option.label,
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
                        selected: state.options.findIndex((option) => option.label === state.current),
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
            current: value,
         }));
      },
      [value]
   );

   // The markup
   return (
      <Mui.Box {...boxProps} sx={{ position: "relative" }}>
         <Mui.TextField
            value={state.current}
            onChange={onInputChange}
            onKeyDown={onInputKeyDown}
            onBlur={onInputBlur}
            fullWidth
         />
         {state.open && (
            <Mui.Paper sx={{ padding: 2, position: "absolute", left: 0, right: 0 }}>
               {state.loading && <Mui.LinearProgress />}
               {!state.loading &&
                  state.options.map((option, index) => (
                     <Mui.Box
                        sx={{
                           color: index === state.selected ? "#F00" : undefined,
                        }}
                        key={option.label}
                     >
                        {option.label}
                     </Mui.Box>
                  ))}
            </Mui.Paper>
         )}
      </Mui.Box>
   );
};

export default Address;
