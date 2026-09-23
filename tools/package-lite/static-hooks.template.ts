// backend/static-hooks.ts — route behavior for the static (no-backend) package built by /package lite.
//
// The static backend answers GETs from a snapshot of the real API and gives writes generic REST
// semantics (POST appends to a collection, PATCH merges by id, DELETE removes). Only routes whose
// real behavior is more than that need an entry here — a state machine, a computed response, a
// write that touches several collections. Everything else stays generic.
//
// Bundled for the browser with esbuild, so only import browser-safe code (shared/ is the usual
// source — the same logic the real backend uses). Keys are `METHOD /path` with :params, prefix
// optional (`POST /requests/:id/action` and `POST /api/requests/:id/action` both match).

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

interface Db {
  get(route: string): any;                                  // current value of a snapshot route (with local changes applied)
  set(route: string, value: any): void;                     // overwrite a route's value (persisted to localStorage)
  remove(route: string): void;
  find(collection: string, id: string | number): any;       // item by id from a list route
  add(collection: string, item: any): any;                  // append; assigns an id in the collection's style, mirrors createdAt/updatedAt fields
  update(collection: string, id: string | number, patch: any): any;   // merge by id; returns the updated item
  delete(collection: string, id: string | number): boolean;
  nextId(collection: string): string | number;
  reset(): void;                                            // discard all local changes
}

interface HookRequest {
  method: string;
  route: string;                                            // path after the API prefix, e.g. /requests/REQ-2026-089/action
  params: Record<string, string>;                           // :params from the key that matched
  query: Record<string, string>;
  body: any;                                                // parsed JSON (or FormData entries)
  db: Db;
}

type HookResult = { status: number; body?: Json } | Json | void;

interface StaticHooks {
  routes: Record<string, (req: HookRequest) => HookResult | Promise<HookResult>>;
  latencyMs?: number;   // artificial delay per request, so loading states look like production
  timeShift?: boolean;  // move every timestamp in snapshot data forward by the time since capture (keeps "today"/"upcoming" data current)
}

const hooks: StaticHooks = {
  routes: {
    // Example — a workflow transition that the real backend computes:
    //
    // 'POST /requests/:id/action': ({ params, body, db }) => {
    //   const current = db.find('/requests', params.id);
    //   if (!current) return { status: 404, body: { error: 'Request not found' } };
    //   const next = applyAction(current, body);            // from '../shared/workflow.js'
    //   return db.update('/requests', params.id, next);
    // },
    //
    // A demo reset endpoint:
    // 'POST /dev/reset': ({ db }) => { db.reset(); return { ok: true }; },
  },
};

export default hooks;
