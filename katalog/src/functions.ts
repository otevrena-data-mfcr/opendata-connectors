import https from "https";

export const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});


export function fixUrl(url: string): string;
export function fixUrl(url: undefined): undefined;
export function fixUrl(url: string | undefined): string | undefined {
  return url ? encodeURI(decodeURIComponent(url)) : undefined;
}