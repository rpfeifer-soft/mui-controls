/** @format */

import { IAddress } from "../types";

export default function photonParser(text: string, json: any, debugMode = false): IAddress[] | undefined {
   if (!json
      || !json.type
      || json.type !== "FeatureCollection"
      || !Array.isArray(json.features)
      || json.features.length === 0
   ) {
      return;
   }
   const addresses = json.features.map((feature: any) => {
      const [longitude, latitude] =
         feature.geometry && feature.geometry.coordinates ? feature.geometry.coordinates : [];
      let description = text;
      const { type, name, country, county, postcode, city, street, housenumber } = feature.properties;

      if (debugMode) {
         console.log(type, feature.properties);
      }
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
            if (housenumber) {
               description = `${street} ${housenumber}, ${postcode} ${city}, ${country}`;
            } else if (street) {
               description = `${name}, ${street}, ${postcode} ${city}, ${country}`;
            } else {
               return null;
            }
            break;
      }
      if (debugMode) {
         console.log(description);
      }
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
   return uniques;
}