/** @format */

import photonParser from "./package/address/photonParser";
import { IAddress } from "./package/types";

const debugMode = false;
const useLocalStorage = debugMode;

interface IRequestCache {
   [searchUrl: string]: IAddress[];
}

const requestCache: IRequestCache = {};

function addRequest(searchUrl: string, result: IAddress[]): IAddress[] {
   if (useLocalStorage) {
      localStorage.setItem(searchUrl, JSON.stringify(result));
   } else {
      requestCache[searchUrl] = result;
   }
   return result;
}
function getRequest(searchUrl: string): IAddress[] | undefined {
   if (useLocalStorage) {
      const json = localStorage.getItem(searchUrl);
      return json ? JSON.parse(json) : undefined;
   } else {
      return requestCache[searchUrl];
   }
}

function photonUrl(searchFor: string, limit: number, lat?: number, lon?: number) {
   if (searchFor.length < 4) return "";

   const location = lat !== undefined && lon !== undefined ? `lat=${lat}&lon=${lon}&` : "";
   return `https://photon.komoot.io/api?limit=${limit}&${location}q=${encodeURIComponent(searchFor)}`;
}

export function cachedAddress(searchFor: string, limit: number, lat?: number, lon?: number) {
   const searchUrl = photonUrl(searchFor, limit, lat, lon);
   if (!searchUrl) {
      return [];
   }
   return getRequest(searchUrl);
}

export async function searchAddress(
   searchFor: string,
   limit: number,
   lat?: number,
   lon?: number
): Promise<IAddress[]> {
   const searchUrl = photonUrl(searchFor, limit, lat, lon);
   if (!searchUrl) {
      return [];
   }

   const response = await fetch(searchUrl);
   if (!response.ok) return [];

   const json = JSON.parse(await response.text());
   if (debugMode) {
      console.log(json);
   }
   const addresses = photonParser(searchFor, json, debugMode);
   return addresses
      ? addRequest(searchUrl, addresses)
      : addRequest(searchUrl, searchFor ? [{ description: searchFor }] : []);
}

