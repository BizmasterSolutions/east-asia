import { UTApi } from "uploadthing/server";

// Reads UPLOADTHING_TOKEN from the environment automatically.
export const utapi = new UTApi();

// Extracts the UploadThing file key from a stored URL, e.g.
// https://<appId>.ufs.sh/f/<key> or https://utfs.io/f/<key>
export function extractUploadThingKey(url) {
  if (!url) return null;
  const match = String(url).match(/\/f\/([^/?#]+)/);
  return match ? match[1] : null;
}
