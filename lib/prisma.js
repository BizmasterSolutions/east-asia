import { PrismaClient } from "@prisma/client";
import { PrismaNeonHttp } from "@prisma/adapter-neon";

// PrismaNeonHttp is stateless HTTP — no persistent connections, safe to create per import.
// Use a versioned key so hot-reload always picks up a fresh client.
const CACHE_KEY = "__prisma_neon_v3__";

const prisma = globalThis[CACHE_KEY] ?? (() => {
  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL, {
    fetchOptions: { cache: "no-store" },
  });
  const client = new PrismaClient({ adapter });
  if (process.env.NODE_ENV !== "production") globalThis[CACHE_KEY] = client;
  return client;
})();

export default prisma;
