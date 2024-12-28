import https from "https";
import { EuTypes } from "./schema/eu-types";

export const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export function fixUrl(url: string): string;
export function fixUrl(url: undefined): undefined;
export function fixUrl(url: string | undefined): string | undefined {
  return url ? encodeURI(decodeURIComponent(url)) : undefined;
}

const extensionToEuType: Record<string, EuTypes> = {
  JSONLD: EuTypes.JSON_LD,
};

export function getFormat(ext: string | undefined) {
  ext = ext?.toUpperCase();

  if (ext && ext in extensionToEuType) return extensionToEuType[ext];
  else if (ext && ext in EuTypes) return EuTypes[ext as keyof typeof EuTypes];
  // field is mandatory so we have to return something
  else return EuTypes.BIN;
}
