/*
 * static-backend.js — stands in for the API when the package is served without its backend.
 *
 * Loaded by index.html ahead of the app bundle. Requests under the API prefix are answered here
 * instead of going over the network:
 *   GET                    -> assets/backend-snapshot.json, a capture of the real backend's responses
 *   POST/PUT/PATCH/DELETE  -> generic REST against those same collections: POST /todos appends to
 *                             the /todos list, PATCH /todos/3 merges into the item whose id is 3,
 *                             DELETE /todos/3 removes it.
 * Every change is written to localStorage and layered over the snapshot, so it survives reloads.
 * Routes whose real behavior isn't plain CRUD get a hook in static-backend-hooks.js
 * (source: backend/static-hooks.ts in the repo).
 *
 * Reset to the snapshot: open the app with ?reset, or run __staticBackend.reset() in the console.
 */
(function () {
  'use strict';
  if (window.__staticBackend) return;

  var realFetch = window.fetch.bind(window);
  var RealXHR = window.XMLHttpRequest;
  var scriptUrl = document.currentScript && document.currentScript.src;
  var snapshotUrl = new URL('backend-snapshot.json', scriptUrl || new URL('assets/', document.baseURI));

  var snapshot = null; // { app, prefix, routes: [{method, path}], get: { route: value } }
  var overlay = {};    // { route: value | {$deleted: true} }
  var storageKey = '';
  var warned = {};
  var DELETED = { $deleted: true };

  var ready = realFetch(snapshotUrl.href)
    .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)); })
    .then(function (s) {
      snapshot = s;
      snapshot.get = snapshot.get || {};
      snapshot.routes = snapshot.routes || [];
      storageKey = 'static-backend:' + (s.app || location.pathname);
      overlay = loadOverlay();
      if (/[?&]reset(?=[=&]|$)/.test(location.search + location.hash)) {
        reset();
        var clean = new URL(location.href);
        clean.searchParams.delete('reset');
        clean.hash = clean.hash.replace(/([?&])reset(=[^&]*)?(&|$)/, '$1').replace(/[?&]$/, '');
        history.replaceState(history.state, '', clean.href);
      }
      var changes = Object.keys(overlay).length;
      console.info('static-backend: ' + Object.keys(snapshot.get).length + ' captured routes under "' +
        (snapshot.prefix || '/') + '"' + (changes ? ', ' + changes + ' local change' + (changes === 1 ? '' : 's') : '') +
        ' — add ?reset to the URL to discard local changes');
    })
    .catch(function (err) {
      console.warn('static-backend: no snapshot at ' + snapshotUrl.href + ' — API requests go to the network.', err);
    });

  // ---------- overlay (localStorage) ----------
  function loadOverlay() {
    try { return JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch (e) { return {}; }
  }
  function saveOverlay() {
    try { localStorage.setItem(storageKey, JSON.stringify(overlay)); }
    catch (e) { console.warn('static-backend: could not persist change to localStorage', e); }
  }
  function reset() {
    overlay = {};
    try { localStorage.removeItem(storageKey); } catch (e) { /* ignore */ }
  }
  function isDeleted(v) { return !!v && typeof v === 'object' && v.$deleted === true; }
  function read(route) {
    if (route in overlay) { var v = overlay[route]; return isDeleted(v) ? undefined : v; }
    var s = snapshot.get[route];
    return s === undefined ? undefined : (options().timeShift ? shiftDates(s) : s);
  }
  function write(route, value) { overlay[route] = value; saveOverlay(); }

  // ---------- hooks ----------
  function hooks() {
    var h = window.__staticBackendHooks;
    return (h && h.default) || h || {};
  }
  function options() { return hooks(); }
  function stripPrefix(path) {
    var p = (snapshot.prefix || '').replace(/\/$/, '');
    return p && (path === p || path.indexOf(p + '/') === 0) ? (path.slice(p.length) || '/') : path;
  }
  function compile(pattern) {
    var names = [];
    var src = pattern.replace(/\/+$/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/:(\w+)/g, function (_, n) { names.push(n); return '([^/]+)'; });
    return { re: new RegExp('^' + (src || '/') + '$'), names: names };
  }
  function findHook(method, route) {
    var table = hooks().routes || {};
    var keys = Object.keys(table);
    for (var i = 0; i < keys.length; i++) {
      var parts = keys[i].trim().split(/\s+/);
      var m = (parts[0] || '').toUpperCase();
      if (m !== method && m !== 'ANY' && m !== '*') continue;
      var c = compile(stripPrefix(parts[1] || '/'));
      var hit = c.re.exec(route);
      if (!hit) continue;
      var params = {};
      c.names.forEach(function (n, j) { params[n] = decodeURIComponent(hit[j + 1]); });
      return { fn: table[keys[i]], params: params };
    }
    return null;
  }

  // ---------- generic REST ----------
  var ID_KEYS = ['id', '_id', 'uuid', 'slug', 'key'];
  var CREATED = ['createdAt', 'created_at', 'created', 'submittedAt'];
  var UPDATED = ['updatedAt', 'updated_at', 'modifiedAt', 'lastModified', 'updated'];

  function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
  function idOf(item) {
    if (!isObj(item)) return undefined;
    for (var i = 0; i < ID_KEYS.length; i++) if (item[ID_KEYS[i]] !== undefined) return String(item[ID_KEYS[i]]);
    return undefined;
  }
  function idKeyOf(list) {
    for (var i = 0; i < ID_KEYS.length; i++) {
      for (var j = 0; j < list.length; j++) if (isObj(list[j]) && list[j][ID_KEYS[i]] !== undefined) return ID_KEYS[i];
    }
    return 'id';
  }
  function uuid() { return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()); }
  function nextId(list) {
    var ids = list.map(idOf).filter(function (x) { return x !== undefined; });
    if (!ids.length) return uuid();
    var numeric = ids.every(function (x) { return /^\d+$/.test(x); });
    if (numeric) {
      var max = Math.max.apply(null, ids.map(Number));
      var sampleKey = idKeyOf(list);
      var sample = list.filter(isObj).filter(function (x) { return x[sampleKey] !== undefined; })[0];
      return typeof sample[sampleKey] === 'number' ? max + 1 : String(max + 1);
    }
    var parts = ids.map(function (x) { return /^(.*?)(\d+)$/.exec(x); });
    if (parts.every(Boolean) && parts.every(function (p) { return p[1] === parts[0][1]; })) {
      var next = Math.max.apply(null, parts.map(function (p) { return Number(p[2]); })) + 1;
      var width = Math.min.apply(null, parts.map(function (p) { return p[2].length; }));
      return parts[0][1] + String(next).padStart(width, '0');
    }
    return uuid();
  }
  // Mirror the timestamp fields (and their format) the existing records carry.
  function stamp(sample, item, keys, force) {
    if (!isObj(sample)) return;
    keys.forEach(function (k) {
      if (!(k in sample)) return;
      if (!force && item[k] !== undefined) return;
      var ref = sample[k];
      item[k] = typeof ref === 'number' ? Date.now()
        : /^\d{4}-\d{2}-\d{2}$/.test(String(ref)) ? new Date().toISOString().slice(0, 10)
        : new Date().toISOString();
    });
  }
  function addItem(collection, body) {
    var list = read(collection);
    var items = Array.isArray(list) ? list : [];
    var idKey = idKeyOf(items);
    var item = Object.assign({}, isObj(body) ? body : { value: body });
    if (item[idKey] === undefined) item[idKey] = nextId(items);
    stamp(items[0], item, CREATED, false);
    stamp(items[0], item, UPDATED, false);
    write(collection, items.concat([item]));
    return item;
  }
  function updateItem(collection, id, patch) {
    var list = read(collection);
    if (!Array.isArray(list)) return undefined;
    var i = -1;
    for (var k = 0; k < list.length; k++) if (idOf(list[k]) === String(id)) { i = k; break; }
    if (i < 0) return undefined;
    var idKey = idKeyOf(list);
    var next = Object.assign({}, list[i], isObj(patch) ? patch : {});
    next[idKey] = list[i][idKey];
    stamp(list[i], next, UPDATED, true);
    write(collection, list.slice(0, i).concat([next], list.slice(i + 1)));
    var detailRoute = collection + '/' + encodeURIComponent(String(id));
    var detail = read(detailRoute);
    if (isObj(detail)) write(detailRoute, Object.assign({}, detail, isObj(patch) ? patch : {}));
    return next;
  }
  function deleteItem(collection, id) {
    var list = read(collection);
    if (!Array.isArray(list)) return false;
    var rest = list.filter(function (x) { return idOf(x) !== String(id); });
    if (rest.length === list.length) return false;
    write(collection, rest);
    var detailRoute = collection + '/' + encodeURIComponent(String(id));
    if (read(detailRoute) !== undefined) write(detailRoute, DELETED);
    return true;
  }
  // /a/b        -> collection /a, id b            (when /a is a list)
  // /a/b/c      -> collection /a/b, id c          (when /a/b is a list)
  //             -> collection /a, id b, action c  (when only /a is a list)
  function locate(route) {
    var segs = route.split('/').filter(Boolean);
    for (var cut = segs.length - 1; cut >= 1 && cut >= segs.length - 2; cut--) {
      var collection = '/' + segs.slice(0, cut).join('/');
      if (Array.isArray(read(collection))) {
        return { collection: collection, id: decodeURIComponent(segs[cut]), action: segs.slice(cut + 1).join('/') || null };
      }
    }
    return null;
  }
  function itemAt(loc) {
    var list = read(loc.collection);
    for (var i = 0; i < list.length; i++) if (idOf(list[i]) === loc.id) return list[i];
    return undefined;
  }
  function knownGetRoute(route) {
    return snapshot.routes.some(function (r) {
      return (r.method === 'GET' || r.method === 'ANY') && compile(stripPrefix(r.path)).re.test(route);
    });
  }

  // Opt-in (hooks: { timeShift: true }): move every timestamp in snapshot data forward by the time
  // elapsed since capture, so "today"/"upcoming" data doesn't go stale between packaging and demo.
  var shiftMs = null;
  function shiftDates(v) {
    if (shiftMs === null) shiftMs = snapshot.capturedAt ? Date.now() - Date.parse(snapshot.capturedAt) : 0;
    if (!shiftMs) return v;
    return (function walk(x) {
      if (typeof x === 'string') {
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(x)) { var t = Date.parse(x); return isNaN(t) ? x : new Date(t + shiftMs).toISOString(); }
        if (/^\d{4}-\d{2}-\d{2}$/.test(x)) { var d = Date.parse(x + 'T00:00:00Z'); return isNaN(d) ? x : new Date(d + Math.floor(shiftMs / 864e5) * 864e5).toISOString().slice(0, 10); }
        return x;
      }
      if (Array.isArray(x)) return x.map(walk);
      if (isObj(x)) { var o = {}; Object.keys(x).forEach(function (k) { o[k] = walk(x[k]); }); return o; }
      return x;
    })(v);
  }

  // ---------- request handling ----------
  function warnOnce(key, msg) {
    if (warned[key]) return;
    warned[key] = true;
    console.warn('static-backend: ' + key + ' — ' + msg);
  }
  function reply(status, body) { return { status: status, body: body }; }
  function notFound(route) { return reply(404, { error: 'Not found: ' + route }); }

  function match(url) {
    if (!snapshot) return null;
    var u;
    try { u = new URL(url, document.baseURI); } catch (e) { return null; }
    if (u.origin !== location.origin && !/^https?:$/.test(u.protocol)) return null;
    var prefix = (snapshot.prefix || '').replace(/\/$/, '');
    var path = u.pathname;
    if (prefix) {
      var i = (path === prefix || path.indexOf(prefix + '/') === 0) ? 0 : path.indexOf(prefix + '/');
      if (i < 0) return null;
      path = path.slice(i + prefix.length) || '/';
    }
    var route = path.replace(/\/+$/, '') || '/';
    if (!prefix) {
      var known = route in snapshot.get || snapshot.routes.some(function (r) { return compile(r.path).re.test(route); });
      if (!known) return null;
    }
    return { route: route, search: u.search, url: u };
  }

  function parseBody(raw) {
    if (raw === undefined || raw === null || raw === '') return undefined;
    if (typeof raw === 'string') { try { return JSON.parse(raw); } catch (e) { return raw; } }
    if (typeof FormData !== 'undefined' && raw instanceof FormData) return Object.fromEntries(raw.entries());
    if (typeof URLSearchParams !== 'undefined' && raw instanceof URLSearchParams) return Object.fromEntries(raw.entries());
    return raw;
  }

  function handleGet(m) {
    var keys = m.search ? [m.route + m.search, m.route] : [m.route];
    for (var i = 0; i < keys.length; i++) {
      var v = read(keys[i]);
      if (v !== undefined) return reply(200, v);
    }
    var loc = locate(m.route);
    if (loc && !loc.action) {
      var item = itemAt(loc);
      return item !== undefined ? reply(200, item) : notFound(m.route);
    }
    warnOnce('GET ' + m.route, 'not in the snapshot. Re-run /package lite with the backend up, or add a hook for it.');
    return notFound(m.route);
  }
  function handlePost(m, body) {
    var target = read(m.route);
    if (Array.isArray(target)) return reply(201, addItem(m.route, body));
    var loc = locate(m.route);
    if (loc && loc.action) {
      var item = itemAt(loc);
      if (item === undefined) return notFound(m.route);
      // A nested collection that exists for other ids but wasn't captured for this one.
      if (knownGetRoute(m.route)) return reply(201, addItem(m.route, body));
      warnOnce('POST ' + loc.collection + '/:id/' + loc.action, 'no hook for this action — returned the item unchanged. Add one in backend/static-hooks.ts.');
      return reply(200, item);
    }
    if (isObj(target)) {
      var merged = Object.assign({}, target, isObj(body) ? body : {});
      write(m.route, merged);
      return reply(200, merged);
    }
    warnOnce('POST ' + m.route, 'no snapshot collection or hook — answered { ok: true }. Add a hook in backend/static-hooks.ts if the app needs a real response.');
    return reply(200, { ok: true });
  }
  function handleUpdate(m, body) {
    var loc = locate(m.route);
    if (loc && !loc.action) {
      var next = updateItem(loc.collection, loc.id, body);
      return next !== undefined ? reply(200, next) : notFound(m.route);
    }
    var cur = read(m.route);
    if (cur !== undefined) {
      var merged = isObj(cur) && isObj(body) ? Object.assign({}, cur, body) : body;
      write(m.route, merged);
      return reply(200, merged);
    }
    if (loc && loc.action) {
      var item = itemAt(loc);
      if (item === undefined) return notFound(m.route);
      warnOnce(m.method + ' ' + loc.collection + '/:id/' + loc.action, 'no hook for this action — returned the item unchanged. Add one in backend/static-hooks.ts.');
      return reply(200, item);
    }
    return notFound(m.route);
  }
  function handleDelete(m) {
    var loc = locate(m.route);
    if (loc && !loc.action) return deleteItem(loc.collection, loc.id) ? reply(204) : notFound(m.route);
    if (read(m.route) !== undefined) { write(m.route, DELETED); return reply(204); }
    return notFound(m.route);
  }

  function normalizeHookResult(out, fallbackStatus) {
    if (isObj(out) && typeof out.status === 'number' && ('body' in out || Object.keys(out).length === 1)) return reply(out.status, out.body);
    return reply(fallbackStatus, out);
  }

  async function handle(method, m, rawBody) {
    method = String(method || 'GET').toUpperCase();
    m.method = method;
    var body = parseBody(rawBody);
    var hook = findHook(method, m.route);
    if (hook) {
      var query = {};
      m.url.searchParams.forEach(function (v, k) { query[k] = v; });
      var out = await hook.fn({ method: method, route: m.route, params: hook.params, query: query, body: body, db: db });
      return normalizeHookResult(out, 200);
    }
    if (method === 'GET' || method === 'HEAD') return handleGet(m);
    if (method === 'POST') return handlePost(m, body);
    if (method === 'PUT' || method === 'PATCH') return handleUpdate(m, body);
    if (method === 'DELETE') return handleDelete(m);
    return reply(405, { error: method + ' is not supported by the static backend' });
  }
  async function respond(method, m, rawBody) {
    var r = await handle(method, m, rawBody);
    var latency = options().latencyMs;
    if (latency) await new Promise(function (res) { setTimeout(res, latency); });
    return r;
  }
  function toText(r) { return r.status === 204 ? '' : JSON.stringify(r.body === undefined ? null : r.body); }

  // ---------- fetch ----------
  window.fetch = async function (input, init) {
    await ready;
    var url = typeof input === 'string' ? input : (input instanceof URL ? input.href : input && input.url);
    var m = url ? match(url) : null;
    if (!m) return realFetch(input, init);
    var isReq = typeof Request !== 'undefined' && input instanceof Request;
    var method = (init && init.method) || (isReq && input.method) || 'GET';
    var raw = init ? init.body : undefined;
    if (raw === undefined && isReq && method !== 'GET' && method !== 'HEAD') raw = await input.clone().text();
    var r = await respond(method, m, raw);
    return new Response(r.status === 204 ? null : toText(r), {
      status: r.status,
      statusText: r.status === 204 ? 'No Content' : r.status < 400 ? 'OK' : 'Error',
      headers: { 'content-type': 'application/json' }
    });
  };

  // ---------- XMLHttpRequest (Angular HttpClient, axios) ----------
  function StaticXHR() {
    var xhr = new RealXHR();
    var meta = { method: 'GET', url: null };
    var realOpen = xhr.open, realSend = xhr.send;
    xhr.open = function (method, url) { meta.method = method; meta.url = url; return realOpen.apply(xhr, arguments); };
    xhr.send = function (body) {
      ready.then(async function () {
        var m = meta.url != null ? match(String(meta.url)) : null;
        if (!m) return realSend.call(xhr, body);
        var r = await respond(meta.method, m, body);
        var text = toText(r);
        var wantsJson = xhr.responseType === 'json';
        Object.defineProperties(xhr, {
          readyState: { value: 4, configurable: true },
          status: { value: r.status, configurable: true },
          statusText: { value: r.status < 400 ? 'OK' : 'Error', configurable: true },
          responseText: { value: text, configurable: true },
          response: { value: wantsJson ? (text ? JSON.parse(text) : null) : text, configurable: true },
          responseURL: { value: m.url.href, configurable: true }
        });
        xhr.getAllResponseHeaders = function () { return 'content-type: application/json\r\n'; };
        xhr.getResponseHeader = function (n) { return String(n).toLowerCase() === 'content-type' ? 'application/json' : null; };
        xhr.dispatchEvent(new Event('readystatechange'));
        xhr.dispatchEvent(new ProgressEvent('load'));
        xhr.dispatchEvent(new ProgressEvent('loadend'));
      });
    };
    return xhr;
  }
  StaticXHR.prototype = RealXHR.prototype;
  ['UNSENT', 'OPENED', 'HEADERS_RECEIVED', 'LOADING', 'DONE'].forEach(function (k) { StaticXHR[k] = RealXHR[k]; });
  window.XMLHttpRequest = StaticXHR;

  // ---------- public surface (also what hooks receive as `db`) ----------
  var db = {
    get: function (route) { return read(stripPrefix(route)); },
    set: function (route, value) { write(stripPrefix(route), value); },
    remove: function (route) { write(stripPrefix(route), DELETED); },
    find: function (collection, id) {
      var list = read(stripPrefix(collection));
      if (!Array.isArray(list)) return undefined;
      for (var i = 0; i < list.length; i++) if (idOf(list[i]) === String(id)) return list[i];
      return undefined;
    },
    add: function (collection, item) { return addItem(stripPrefix(collection), item); },
    update: function (collection, id, patch) { return updateItem(stripPrefix(collection), id, patch); },
    delete: function (collection, id) { return deleteItem(stripPrefix(collection), id); },
    nextId: function (collection) { var l = read(stripPrefix(collection)); return nextId(Array.isArray(l) ? l : []); },
    reset: reset
  };
  window.__staticBackend = {
    ready: ready,
    reset: reset,
    db: db,
    snapshot: function () { return snapshot; },
    changes: function () { return overlay; }
  };
})();
