import {
  listenAndServe,
  ServerRequest,
} from "https://deno.land/std@0.81.0/http/server.ts";

import app from "./app.ts";

const BINDING = ":8000";

console.log(`Listening for requests on ${BINDING}...`);

await listenAndServe(BINDING, app);
