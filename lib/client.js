window.__ModuleLoader__.load({id:"@nagi-ovo/dsh-visualize",factory:(require)=>{var module={exports:{}};var exports=module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target2, all) => {
  for (var name2 in all)
    __defProp(target2, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.tsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject,
  name: () => name,
  tailSourceFor: () => tailSourceFor,
  turnCardsSource: () => turnCardsSource
});
module.exports = __toCommonJS(index_exports);

// src/client/VisualizeCard.tsx
var import_react4 = require("react");

// src/style.ts
var STYLE_IDS = ["whale", "editorial", "paper", "sketch", "terminal"];
var DEFAULT_STYLE = "whale";
var SYSTEM_SANS = "system-ui, -apple-system, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif";
function ld(light, dark) {
  return `light-dark(${light}, ${dark})`;
}
function series(pairs) {
  return Object.fromEntries(pairs.map(([light, dark], i) => [`series-${i + 1}`, ld(light, dark)]));
}
var GOOGLE_FONTS = "https://fonts.googleapis.com/css2?";
var STYLES = {
  whale: {
    id: "whale",
    label: "\u9CB8\u84DD \xB7 Whale (default)",
    // Everything comes from the host bridge and the stylesheet fallbacks.
    vars: {},
    chart: {}
  },
  editorial: {
    id: "editorial",
    label: "\u62A5\u520A \xB7 Editorial",
    vars: {
      "foreground": ld("#1a1a1a", "#f2efe9"),
      "muted-foreground": ld("#5f5f5f", "#a8a39b"),
      "card": ld("rgb(140 110 60 / 6%)", "rgb(255 235 205 / 5%)"),
      "border": ld("rgb(0 0 0 / 12%)", "rgb(255 255 255 / 14%)"),
      "primary": ld("#b24032", "#f07a62"),
      "primary-foreground": ld("#ffffff", "#151517"),
      ...series([
        ["#b24032", "#f07a62"],
        ["#28659d", "#78ade8"],
        ["#26826b", "#5eccab"],
        ["#a87810", "#e3b04b"],
        ["#7a4e8c", "#c395d2"],
        ["#6e6259", "#b2a696"]
      ]),
      "context": ld("#8a8a8a", "#6f6f6f"),
      "grid": ld("rgb(0 0 0 / 8%)", "rgb(255 255 255 / 9%)"),
      "axis": ld("rgb(26 26 26 / 60%)", "rgb(242 239 233 / 60%)"),
      "font-display": "'Source Serif 4', 'Noto Serif SC', 'Songti SC', serif",
      "font-sans": "'Libre Franklin', 'PingFang SC', 'Noto Sans SC', system-ui, sans-serif",
      "radius": "2px"
    },
    fontHref: `${GOOGLE_FONTS}family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=Libre+Franklin:wght@400;500;600&family=Noto+Serif+SC:wght@500;700&display=swap`,
    extraCss: "h1, h2, h3 { font-weight: 600; letter-spacing: -0.005em; }",
    chart: { pointRadius: 0, valueAxisLine: false }
  },
  paper: {
    id: "paper",
    label: "\u8BBA\u6587 \xB7 Paper",
    vars: {
      "foreground": ld("#111111", "#ececec"),
      "muted-foreground": ld("#555555", "#a6a6a6"),
      "card": ld("rgb(0 0 0 / 2.5%)", "rgb(255 255 255 / 4%)"),
      "border": ld("rgb(0 0 0 / 18%)", "rgb(255 255 255 / 18%)"),
      "primary": ld("#0072b2", "#58b6ed"),
      "primary-foreground": ld("#ffffff", "#111111"),
      ...series([
        ["#0072b2", "#58b6ed"],
        ["#d55e00", "#e8743b"],
        ["#0c9c67", "#35b67e"],
        ["#c774a4", "#da91bd"],
        ["#9d7d36", "#e69f00"],
        ["#3b3b3b", "#d0d0d0"]
      ]),
      "grid": ld("rgb(0 0 0 / 6%)", "rgb(255 255 255 / 7%)"),
      "grid-axes": "none",
      "axis": ld("rgb(17 17 17 / 70%)", "rgb(236 236 236 / 70%)"),
      "line-width": "1.5",
      "font-display": "'STIX Two Text', 'Noto Serif SC', 'Songti SC', serif",
      "font-sans": "'STIX Two Text', 'Noto Serif SC', 'Songti SC', serif",
      "radius": "2px"
    },
    fontHref: `${GOOGLE_FONTS}family=STIX+Two+Text:wght@400;500;600&family=Noto+Serif+SC:wght@400;600&display=swap`,
    chart: {
      pointRadius: 3,
      pointStyles: ["circle", "triangle", "rect", "rectRot", "crossRot", "star"],
      dashes: [[], [6, 3], [2, 2], [8, 3, 2, 3]]
    }
  },
  sketch: {
    id: "sketch",
    label: "\u624B\u7ED8 \xB7 Sketch",
    vars: {
      "foreground": ld("#1e1e1e", "#ececec"),
      "muted-foreground": ld("#5c5f66", "#a6a7ab"),
      "card": ld("rgb(250 176 5 / 9%)", "rgb(250 176 5 / 7%)"),
      "border": ld("rgb(30 30 30 / 35%)", "rgb(236 236 236 / 35%)"),
      "primary": ld("#2d71b7", "#74c0fc"),
      "primary-foreground": ld("#ffffff", "#1e1e1e"),
      ...series([
        ["#2d71b7", "#74c0fc"],
        ["#cb1913", "#ff8787"],
        ["#36a047", "#91ea91"],
        ["#7048e8", "#9775fa"],
        ["#e8590c", "#ffa94d"],
        ["#108f6c", "#55e6c6"]
      ]),
      "grid-axes": "none",
      "axis": ld("rgb(30 30 30 / 60%)", "rgb(236 236 236 / 60%)"),
      "line-width": "2.5",
      "font-display": "'Kalam', 'LXGW WenKai TC', 'Kaiti SC', 'STKaiti', cursive",
      "font-sans": "'Kalam', 'LXGW WenKai TC', 'Kaiti SC', 'STKaiti', cursive",
      "font-mono": "'LXGW WenKai Mono TC', ui-monospace, monospace",
      "font-size-base": "15px",
      "radius": "10px"
    },
    fontHref: `${GOOGLE_FONTS}family=Kalam:wght@400;700&family=LXGW+WenKai+TC:wght@400;700&family=LXGW+WenKai+Mono+TC:wght@400&display=swap`,
    // A hand-drawn card edge, and exact figures back in a legible sans.
    extraCss: `.card { border-width: 1.5px; border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px; }
.viz-stat-value, table { font-family: ${SYSTEM_SANS}; }`,
    chart: { tension: 0.35, pointRadius: 0, axisWidth: 1.5 }
  },
  terminal: {
    id: "terminal",
    label: "\u7EC8\u7AEF \xB7 Terminal",
    vars: {
      "foreground": ld("#1f2328", "#d6dccf"),
      "muted-foreground": ld("#59636e", "#8f9a8c"),
      "card": ld("rgb(0 0 0 / 3.5%)", "rgb(50 216 135 / 5%)"),
      "border": ld("rgb(0 0 0 / 16%)", "rgb(214 220 207 / 16%)"),
      "primary": ld("#177a46", "#32d887"),
      "primary-foreground": ld("#ffffff", "#0d0f0d"),
      ...series([
        ["#1e9157", "#32d887"],
        ["#8c5e03", "#f2b33d"],
        ["#3a757f", "#8ac9d4"],
        ["#9b0b9e", "#e07ce0"],
        ["#cf222e", "#ff6b6b"],
        ["#0a50ae", "#79a8ff"]
      ]),
      "grid": ld("rgb(0 0 0 / 10%)", "rgb(214 220 207 / 10%)"),
      "grid-axes": "both",
      "grid-dash": "2 4",
      "line-width": "1.5",
      "font-display": "'JetBrains Mono', 'LXGW WenKai Mono TC', 'Sarasa Mono SC', ui-monospace, 'SF Mono', monospace",
      "font-sans": "'JetBrains Mono', 'LXGW WenKai Mono TC', 'Sarasa Mono SC', ui-monospace, 'SF Mono', monospace",
      "font-mono": "'JetBrains Mono', 'LXGW WenKai Mono TC', 'Sarasa Mono SC', ui-monospace, 'SF Mono', monospace",
      "font-size-base": "13px",
      "radius": "0px"
    },
    fontHref: `${GOOGLE_FONTS}family=JetBrains+Mono:wght@400;500;700&family=LXGW+WenKai+Mono+TC:wght@400;700&display=swap`,
    extraCss: "body { font-variant-numeric: tabular-nums; }",
    chart: { tension: 0, pointRadius: 2, pointStyles: ["rect"] }
  }
};
var PAGE_CONFIG_GLOBAL = "__DSH_VISUALIZE_CONFIG__";
var STYLE_FILES_PATH = "/api/dsh-visualize/style-files";
function styleIdFrom(value) {
  return typeof value === "string" && STYLE_IDS.includes(value) ? value : DEFAULT_STYLE;
}

// ../workspace/node_modules/fflate/esm/browser.js
var u8 = Uint8Array;
var u16 = Uint16Array;
var i32 = Int32Array;
var fleb = new u8([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]);
var fdeb = new u8([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]);
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var freb = function(eb, start) {
  var b = new u16(31);
  for (var i = 0; i < 31; ++i) {
    b[i] = start += 1 << eb[i - 1];
  }
  var r = new i32(b[30]);
  for (var i = 1; i < 30; ++i) {
    for (var j = b[i]; j < b[i + 1]; ++j) {
      r[j] = j - b[i] << 5 | i;
    }
  }
  return { b, r };
};
var _a = freb(fleb, 2);
var fl = _a.b;
var revfl = _a.r;
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0);
var fd = _b.b;
var revfd = _b.r;
var rev = new u16(32768);
for (i = 0; i < 32768; ++i) {
  x = (i & 43690) >> 1 | (i & 21845) << 1;
  x = (x & 52428) >> 2 | (x & 13107) << 2;
  x = (x & 61680) >> 4 | (x & 3855) << 4;
  rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
}
var x;
var i;
var hMap = (function(cd, mb, r) {
  var s = cd.length;
  var i = 0;
  var l = new u16(mb);
  for (; i < s; ++i) {
    if (cd[i])
      ++l[cd[i] - 1];
  }
  var le = new u16(mb);
  for (i = 1; i < mb; ++i) {
    le[i] = le[i - 1] + l[i - 1] << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        var sv = i << 4 | cd[i];
        var r_1 = mb - cd[i];
        var v = le[cd[i] - 1]++ << r_1;
        for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
          co[rev[v] >> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);
    for (i = 0; i < s; ++i) {
      if (cd[i]) {
        co[i] = rev[le[cd[i] - 1]++] >> 15 - cd[i];
      }
    }
  }
  return co;
});
var flt = new u8(288);
for (i = 0; i < 144; ++i)
  flt[i] = 8;
var i;
for (i = 144; i < 256; ++i)
  flt[i] = 9;
var i;
for (i = 256; i < 280; ++i)
  flt[i] = 7;
var i;
for (i = 280; i < 288; ++i)
  flt[i] = 8;
var i;
var fdt = new u8(32);
for (i = 0; i < 32; ++i)
  fdt[i] = 5;
var i;
var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
var max = function(a) {
  var m = a[0];
  for (var i = 1; i < a.length; ++i) {
    if (a[i] > m)
      m = a[i];
  }
  return m;
};
var bits = function(d, p, m) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
};
var bits16 = function(d, p) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
};
var shft = function(p) {
  return (p + 7) / 8 | 0;
};
var slc = function(v, s, e) {
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  return new u8(v.subarray(s, e));
};
var ec = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
];
var err = function(ind, msg, nt) {
  var e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e, err);
  if (!nt)
    throw e;
  return e;
};
var inflt = function(dat, st, buf, dict) {
  var sl = dat.length, dl = dict ? dict.length : 0;
  if (!sl || st.f && !st.l)
    return buf || new u8(0);
  var noBuf = !buf;
  var resize = noBuf || st.i != 2;
  var noSt = st.i;
  if (noBuf)
    buf = new u8(sl * 3);
  var cbuf = function(l2) {
    var bl = buf.length;
    if (l2 > bl) {
      var nbuf = new u8(Math.max(bl * 2, l2));
      nbuf.set(buf);
      buf = nbuf;
    }
  };
  var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
  var tbts = sl * 8;
  do {
    if (!lm) {
      final = bits(dat, pos, 1);
      var type = bits(dat, pos + 1, 3);
      pos += 3;
      if (!type) {
        var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
        if (t > sl) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + l);
        buf.set(dat.subarray(s, t), bt);
        st.b = bt += l, st.p = pos = t * 8, st.f = final;
        continue;
      } else if (type == 1)
        lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
      else if (type == 2) {
        var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
        var tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        var ldt = new u8(tl);
        var clt = new u8(19);
        for (var i = 0; i < hcLen; ++i) {
          clt[clim[i]] = bits(dat, pos + i * 3, 7);
        }
        pos += hcLen * 3;
        var clb = max(clt), clbmsk = (1 << clb) - 1;
        var clm = hMap(clt, clb, 1);
        for (var i = 0; i < tl; ) {
          var r = clm[bits(dat, pos, clbmsk)];
          pos += r & 15;
          var s = r >> 4;
          if (s < 16) {
            ldt[i++] = s;
          } else {
            var c = 0, n = 0;
            if (s == 16)
              n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
            else if (s == 17)
              n = 3 + bits(dat, pos, 7), pos += 3;
            else if (s == 18)
              n = 11 + bits(dat, pos, 127), pos += 7;
            while (n--)
              ldt[i++] = c;
          }
        }
        var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
        lbt = max(lt);
        dbt = max(dt);
        lm = hMap(lt, lbt, 1);
        dm = hMap(dt, dbt, 1);
      } else
        err(1);
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
    }
    if (resize)
      cbuf(bt + 131072);
    var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
    var lpos = pos;
    for (; ; lpos = pos) {
      var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
      pos += c & 15;
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
      if (!c)
        err(2);
      if (sym < 256)
        buf[bt++] = sym;
      else if (sym == 256) {
        lpos = pos, lm = null;
        break;
      } else {
        var add = sym - 254;
        if (sym > 264) {
          var i = sym - 257, b = fleb[i];
          add = bits(dat, pos, (1 << b) - 1) + fl[i];
          pos += b;
        }
        var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
        if (!d)
          err(3);
        pos += d & 15;
        var dt = fd[dsym];
        if (dsym > 3) {
          var b = fdeb[dsym];
          dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
        }
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + 131072);
        var end = bt + add;
        if (bt < dt) {
          var shift = dl - dt, dend = Math.min(dt, end);
          if (shift + bt < 0)
            err(3);
          for (; bt < dend; ++bt)
            buf[bt] = dict[shift + bt];
        }
        for (; bt < end; ++bt)
          buf[bt] = buf[bt - dt];
      }
    }
    st.l = lm, st.p = lpos, st.b = bt, st.f = final;
    if (lm)
      final = 1, st.m = lbt, st.d = dm, st.n = dbt;
  } while (!final);
  return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
};
var et = /* @__PURE__ */ new u8(0);
var gzs = function(d) {
  if (d[0] != 31 || d[1] != 139 || d[2] != 8)
    err(6, "invalid gzip data");
  var flg = d[3];
  var st = 10;
  if (flg & 4)
    st += (d[10] | d[11] << 8) + 2;
  for (var zs = (flg >> 3 & 1) + (flg >> 4 & 1); zs > 0; zs -= !d[st++])
    ;
  return st + (flg & 2);
};
var gzl = function(d) {
  var l = d.length;
  return (d[l - 4] | d[l - 3] << 8 | d[l - 2] << 16 | d[l - 1] << 24) >>> 0;
};
function gunzipSync(data, opts) {
  var st = gzs(data);
  if (st + 8 > data.length)
    err(6, "invalid gzip data");
  return inflt(data.subarray(st, -8), { i: 2 }, opts && opts.out || new u8(gzl(data)), opts && opts.dictionary);
}
var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
var tds = 0;
try {
  td.decode(et, { stream: true });
  tds = 1;
} catch (e) {
}

// src/codec.ts
var MAX_META_FRAGMENT_BYTES = 4 * 1024 * 1024;
var MAX_META_GZIP_BYTES = MAX_META_FRAGMENT_BYTES;
var MAX_META_BASE64_CHARS = Math.ceil(MAX_META_GZIP_BYTES / 3) * 4;
function fragmentByteLength(value) {
  let bytes = 0;
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code < 128) bytes += 1;
    else if (code < 2048) bytes += 2;
    else if (code >= 55296 && code <= 56319 && i + 1 < value.length && value.charCodeAt(i + 1) >= 56320 && value.charCodeAt(i + 1) <= 57343) {
      bytes += 4;
      i += 1;
    } else bytes += 3;
    if (bytes > MAX_META_FRAGMENT_BYTES) return bytes;
  }
  return bytes;
}
function decodeWireFragment(value) {
  try {
    if (typeof value === "string") {
      return value.length <= MAX_META_FRAGMENT_BYTES && fragmentByteLength(value) <= MAX_META_FRAGMENT_BYTES ? value : void 0;
    }
    if (typeof value !== "object" || value === null) return void 0;
    const envelope = value;
    if (envelope["encoding"] !== "gzip-base64" || typeof envelope["data"] !== "string") return void 0;
    const size = envelope["byteLength"];
    if (typeof size !== "number" || !Number.isSafeInteger(size) || size < 0 || size > MAX_META_FRAGMENT_BYTES) return void 0;
    const data = base64Bytes(envelope["data"]);
    if (data === void 0 || data.length < 20 || data[0] !== 31 || data[1] !== 139 || data[2] !== 8 || data[3] !== 0) return void 0;
    const trailer = new DataView(data.buffer, data.byteOffset + data.length - 8, 8);
    if (trailer.getUint32(4, true) !== size) return void 0;
    if (!validDeflateSize(data.subarray(10, -8), size)) return void 0;
    const output = gunzipSync(data, { out: new Uint8Array(size + 1) });
    if (output.length !== size || crc32(output) !== trailer.getUint32(0, true)) return void 0;
    return new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(output);
  } catch {
    return void 0;
  }
}
var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function base64Bytes(text) {
  if (text.length === 0 || text.length > MAX_META_BASE64_CHARS || text.length % 4 !== 0) return void 0;
  if (/[^A-Za-z0-9+/=]/u.test(text)) return void 0;
  const padding = text.endsWith("==") ? 2 : text.endsWith("=") ? 1 : 0;
  if (text.slice(0, text.length - padding).includes("=")) return void 0;
  const size = text.length / 4 * 3 - padding;
  if (size > MAX_META_GZIP_BYTES) return void 0;
  if (padding === 2 && (ALPHABET.indexOf(text[text.length - 3]) & 15) !== 0) return void 0;
  if (padding === 1 && (ALPHABET.indexOf(text[text.length - 2]) & 3) !== 0) return void 0;
  const bytes = new Uint8Array(size);
  let at = 0;
  for (let i = 0; i < text.length; i += 4) {
    const bits2 = ALPHABET.indexOf(text[i]) << 18 | ALPHABET.indexOf(text[i + 1]) << 12 | (text[i + 2] === "=" ? 0 : ALPHABET.indexOf(text[i + 2])) << 6 | (text[i + 3] === "=" ? 0 : ALPHABET.indexOf(text[i + 3]));
    bytes[at++] = bits2 >>> 16;
    if (at < size) bytes[at++] = bits2 >>> 8;
    if (at < size) bytes[at++] = bits2;
  }
  return bytes;
}
var CRC_TABLE = Uint32Array.from({ length: 256 }, (_, index) => {
  let crc = index;
  for (let bit = 0; bit < 8; bit += 1) crc = crc & 1 ? 3988292384 ^ crc >>> 1 : crc >>> 1;
  return crc >>> 0;
});
function crc32(bytes) {
  let crc = 4294967295;
  for (const byte of bytes) crc = CRC_TABLE[(crc ^ byte) & 255] ^ crc >>> 8;
  return (crc ^ 4294967295) >>> 0;
}
function huffman(lengths) {
  const max2 = Math.max(...lengths);
  if (max2 === 0 || max2 > 15) throw new Error("invalid huffman tree");
  const counts = new Uint16Array(16);
  for (const length of lengths) if (length > 0) counts[length] = counts[length] + 1;
  const next = new Uint16Array(16);
  let code = 0;
  for (let bits2 = 1; bits2 <= max2; bits2 += 1) {
    code = (code + counts[bits2 - 1]) * 2;
    if (code + counts[bits2] > 1 << bits2) throw new Error("oversubscribed huffman tree");
    next[bits2] = code;
  }
  const table = new Int32Array(1 << max2);
  for (let symbol = 0; symbol < lengths.length; symbol += 1) {
    const length = lengths[symbol];
    if (length === 0) continue;
    let reversed = 0;
    let canonical = next[length];
    next[length] = canonical + 1;
    for (let i = 0; i < length; i += 1) {
      reversed = reversed * 2 + (canonical & 1);
      canonical >>>= 1;
    }
    for (let index = reversed; index < table.length; index += 1 << length) table[index] = symbol << 5 | length;
  }
  return { table, bits: max2 };
}
var FIXED_LITERAL = huffman(Array.from({ length: 288 }, (_, i) => i < 144 ? 8 : i < 256 ? 9 : i < 280 ? 7 : 8));
var FIXED_DISTANCE = huffman(Array.from({ length: 32 }, () => 5));
var LENGTH_BASE = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258];
var LENGTH_EXTRA = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
var DISTANCE_BASE = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];
var DISTANCE_EXTRA = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
var DYNAMIC_ORDER = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
function validDeflateSize(data, expected) {
  let position = 0;
  let produced = 0;
  const read = (bits2) => {
    if (position + bits2 > data.length * 8) throw new Error("truncated deflate");
    const at = position >>> 3;
    const value = ((data[at] ?? 0) | (data[at + 1] ?? 0) << 8 | (data[at + 2] ?? 0) << 16) >>> (position & 7);
    position += bits2;
    return value & (1 << bits2) - 1;
  };
  const symbol = (tree) => {
    const at = position >>> 3;
    const value = ((data[at] ?? 0) | (data[at + 1] ?? 0) << 8 | (data[at + 2] ?? 0) << 16) >>> (position & 7);
    const entry = tree.table[value & (1 << tree.bits) - 1];
    const length = entry & 31;
    if (length === 0) throw new Error("invalid deflate code");
    read(length);
    return entry >>> 5;
  };
  let final = 0;
  do {
    final = read(1);
    const type = read(2);
    if (type === 0) {
      position = Math.ceil(position / 8) * 8;
      const size = read(16);
      if ((size ^ read(16)) !== 65535 || produced + size > expected) return false;
      position += size * 8;
      if (position > data.length * 8) return false;
      produced += size;
      continue;
    }
    if (type === 3) return false;
    let literal = FIXED_LITERAL;
    let distance = FIXED_DISTANCE;
    if (type === 2) {
      const literals = read(5) + 257;
      const distances = read(5) + 1;
      const codes = read(4) + 4;
      if (literals > 286) return false;
      const lengths = Array.from({ length: 19 }, () => 0);
      for (let i = 0; i < codes; i += 1) lengths[DYNAMIC_ORDER[i]] = read(3);
      const tree = huffman(lengths);
      const values = [];
      while (values.length < literals + distances) {
        const value = symbol(tree);
        if (value < 16) values.push(value);
        else {
          if (value === 16 && values.length === 0) return false;
          const count = value === 16 ? read(2) + 3 : value === 17 ? read(3) + 3 : read(7) + 11;
          if (values.length + count > literals + distances) return false;
          const repeated = value === 16 ? values[values.length - 1] : 0;
          for (let i = 0; i < count; i += 1) values.push(repeated);
        }
      }
      if (!values[256]) return false;
      literal = huffman(values.slice(0, literals));
      const distanceLengths = values.slice(literals);
      distance = distanceLengths.some(Boolean) ? huffman(distanceLengths) : { table: new Int32Array(1), bits: 0 };
    }
    for (; ; ) {
      const value = symbol(literal);
      if (value === 256) break;
      if (value < 256) produced += 1;
      else {
        if (value > 285) return false;
        const index = value - 257;
        const length = LENGTH_BASE[index] + read(LENGTH_EXTRA[index]);
        const dist = symbol(distance);
        if (dist > 29 || DISTANCE_BASE[dist] + read(DISTANCE_EXTRA[dist]) > produced) return false;
        produced += length;
      }
      if (produced > expected) return false;
    }
  } while (final === 0);
  return produced === expected && Math.ceil(position / 8) === data.length;
}

// src/fragment.ts
var VISUALIZE_TOOL_NAME = "visualize";
function isVisualizeMode(value) {
  return value === "inline" || value === "wide" || value === "page";
}
var CARD_IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml"];
var IMAGE_ROUTE_PATH = "/api/dsh-visualize/image";
function visualizeMetaFrom(meta) {
  if (typeof meta !== "object" || meta === null) return void 0;
  const record = meta;
  if (record["kind"] !== "visualize") return void 0;
  const { fragment: encoded, title, mode, path, summary } = record;
  const fragment = decodeWireFragment(encoded);
  if (fragment === void 0 || typeof title !== "string" || typeof path !== "string") return void 0;
  if (!isVisualizeMode(mode)) return void 0;
  return {
    kind: "visualize",
    fragment,
    title,
    mode,
    path,
    ...summaryField(summary),
    style: styleIdFrom(record["style"]),
    ...imagesField(record["images"])
  };
}
function imagesField(images) {
  if (!Array.isArray(images)) return {};
  const list = images.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null) return [];
    const { src, id, type, bytes } = entry;
    if (typeof src !== "string" || typeof id !== "string" || typeof bytes !== "number") return [];
    if (!CARD_IMAGE_TYPES.includes(type)) return [];
    return [{ src, id, type, bytes }];
  });
  return list.length > 0 ? { images: list } : {};
}
function summaryField(summary) {
  return typeof summary === "string" && summary.trim().length > 0 ? { summary: summary.trim() } : {};
}
function visualizeMetaFromArgs(argsRaw) {
  if (typeof argsRaw !== "string" || argsRaw.length === 0) return void 0;
  const complete = parseCompleteArgs(argsRaw);
  if (complete !== void 0) {
    if (complete["action"] === "update" && typeof complete["fragment"] !== "string") return void 0;
    return descriptorFromFields(
      complete["fragment"],
      complete["title"],
      complete["mode"],
      complete["path"],
      complete["summary"]
    );
  }
  const closed = scanFragment(argsRaw, true);
  if (closed === void 0) return void 0;
  return descriptorFromFields(closed, void 0, streamedMode(argsRaw), void 0, void 0);
}
function parseCompleteArgs(raw) {
  let end = raw.length;
  while (end > 0) {
    const ch = raw[end - 1];
    if (ch === " " || ch === "\n" || ch === "\r" || ch === "	") {
      end -= 1;
      continue;
    }
    break;
  }
  if (end === 0 || raw[end - 1] !== "}") return void 0;
  try {
    const parsed = JSON.parse(raw.slice(0, end));
    if (typeof parsed !== "object" || parsed === null) return void 0;
    return parsed;
  } catch {
    return void 0;
  }
}
function descriptorFromFields(fragment, title, mode, path, summary) {
  if (typeof fragment !== "string") return void 0;
  if (mode !== void 0 && !isVisualizeMode(mode)) return void 0;
  const markup = trimStreamingScripts(fragment);
  if (markup.trim().length === 0) return void 0;
  return {
    kind: "visualize",
    fragment: markup,
    title: typeof title === "string" && title.trim().length > 0 ? title.trim() : "Visualization",
    mode: mode ?? "inline",
    path: typeof path === "string" ? path : "",
    ...summaryField(summary),
    // The arguments never name a style; the client substitutes its best guess.
    style: DEFAULT_STYLE
  };
}
function streamedMode(argsRaw) {
  const match = /"mode"\s*:\s*"([a-z]+)"/u.exec(argsRaw);
  return match !== null && isVisualizeMode(match[1]) ? match[1] : void 0;
}
var JSON_ESCAPES = {
  '"': '"',
  "\\": "\\",
  "/": "/",
  b: "\b",
  f: "\f",
  n: "\n",
  r: "\r",
  t: "	"
};
function extractStreamingFragment(argsRaw) {
  return scanFragment(argsRaw, false);
}
function scanFragment(argsRaw, requireClosed) {
  const opener = /"fragment"\s*:\s*"/u.exec(argsRaw);
  if (!opener) return void 0;
  let out = "";
  for (let i = opener.index + opener[0].length; i < argsRaw.length; i++) {
    const ch = argsRaw[i];
    if (ch === '"') return out;
    if (ch !== "\\") {
      out += ch;
      continue;
    }
    const next = argsRaw[i + 1];
    if (next === void 0) return requireClosed ? void 0 : out;
    if (next === "u") {
      const hex = argsRaw.slice(i + 2, i + 6);
      if (hex.length < 4) return requireClosed ? void 0 : out;
      const code = Number.parseInt(hex, 16);
      if (Number.isNaN(code)) return requireClosed ? void 0 : out;
      out += String.fromCharCode(code);
      i += 5;
      continue;
    }
    const short = JSON_ESCAPES[next];
    if (short === void 0) return requireClosed ? void 0 : out;
    out += short;
    i += 1;
  }
  return requireClosed ? void 0 : out;
}
var LAST_SCRIPT_OPEN = /<script\b[^>]*>?(?![\s\S]*<script\b)/iu;
function trimStreamingScripts(fragment) {
  const opener = LAST_SCRIPT_OPEN.exec(fragment);
  if (!opener) return fragment;
  const rest = fragment.slice(opener.index + opener[0].length);
  return /<\/script\s*>/iu.test(rest) ? fragment : fragment.slice(0, opener.index);
}

// src/frame-css.ts
var FRAME_CSS = `
:root {
  color-scheme: light dark;
  --background: var(--dsh-viz-background, transparent);
  --foreground: var(--dsh-viz-foreground, light-dark(rgb(26 28 31), rgb(240 242 245)));
  --card: var(--dsh-viz-card, light-dark(rgb(0 0 0 / 4%), rgb(255 255 255 / 6%)));
  --card-foreground: var(--dsh-viz-card-foreground, var(--foreground));
  --muted-foreground: var(--dsh-viz-muted-foreground, light-dark(rgb(26 28 31 / 55%), rgb(240 242 245 / 55%)));
  --border: var(--dsh-viz-border, light-dark(rgb(0 0 0 / 10%), rgb(255 255 255 / 12%)));
  --primary: var(--dsh-viz-primary, light-dark(rgb(65 118 230), rgb(110 150 240)));
  --primary-foreground: var(--dsh-viz-primary-foreground, light-dark(rgb(255 255 255), rgb(13 13 13)));
  --viz-series-1: var(--dsh-viz-series-1, var(--primary));
  --viz-series-2: var(--dsh-viz-series-2, light-dark(rgb(225 105 16), rgb(236 142 59)));
  --viz-series-3: var(--dsh-viz-series-3, light-dark(rgb(2 155 100), rgb(72 196 130)));
  --viz-series-4: var(--dsh-viz-series-4, light-dark(rgb(147 89 185), rgb(183 145 226)));
  --viz-series-5: var(--dsh-viz-series-5, light-dark(rgb(214 63 76), rgb(233 108 122)));
  --viz-series-6: var(--dsh-viz-series-6, light-dark(rgb(154 139 45), rgb(206 182 70)));
  --viz-context: var(--dsh-viz-context, var(--muted-foreground));
  --viz-grid: var(--dsh-viz-grid, var(--border));
  --viz-grid-axes: var(--dsh-viz-grid-axes, value);
  --viz-grid-dash: var(--dsh-viz-grid-dash, 0);
  --viz-axis: var(--dsh-viz-axis, var(--border));
  --viz-line-width: var(--dsh-viz-line-width, 2);
  --font-sans: var(--dsh-viz-font-sans, system-ui, -apple-system, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif);
  --font-display: var(--dsh-viz-font-display, var(--font-sans));
  --font-mono: var(--dsh-viz-font-mono, ui-monospace, 'SF Mono', Menlo, Consolas, monospace);
  --radius: var(--dsh-viz-radius, 8px);
  --font-size-base: var(--dsh-viz-font-size-base, 14px);
  --font-size-small: var(--dsh-viz-font-size-small, max(11px, calc(var(--font-size-base) - 2px)));
}

* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  background: var(--background);
  color: var(--foreground);
  font: 400 var(--font-size-base)/1.5 var(--font-sans);
}
/* A data-viz-src image the tool could not embed, or not yet: a neutral box showing its alt text. */
img[data-viz-src]:not([src]) {
  display: inline-block;
  min-width: 160px;
  min-height: 90px;
  max-width: 100%;
  padding: 8px;
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  background: var(--card);
  color: var(--muted-foreground);
  font-size: var(--font-size-small);
  vertical-align: middle;
}
h1, h2, h3 { margin: 0 0 0.5em; font-family: var(--font-display); font-weight: 500; line-height: 1.3; }
h1 { font-size: 1.3em; }
h2 { font-size: 1.15em; }
h3 { font-size: 1em; }
p { margin: 0 0 0.75em; }
a { color: var(--primary); }
code, kbd, samp, pre { font-family: var(--font-mono); }
svg text { fill: var(--foreground); font-size: var(--font-size-small); }
.text-small { font-size: var(--font-size-small); color: var(--muted-foreground); }

.card {
  background: var(--card);
  color: var(--card-foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 14px;
}

.btn {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: transparent;
  color: var(--foreground);
  font: inherit;
  cursor: pointer;
}
.btn:hover { background: color-mix(in oklab, var(--foreground) 6%, transparent); }
.btn-primary,
.btn[aria-pressed='true'],
.btn[aria-selected='true'],
.btn.is-selected {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--primary-foreground);
}
.btn-ghost { border-color: transparent; }
.btn:disabled { opacity: 0.5; cursor: default; }

.viz-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}
.viz-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
.viz-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 10px;
  margin-bottom: 12px;
}
.viz-stat .viz-stat-label,
.viz-stat > :first-child { font-size: var(--font-size-small); color: var(--muted-foreground); }
.viz-stat-value { font-size: 1.4em; font-weight: 500; line-height: 1.2; }
.viz-badge {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 999px;
  background: color-mix(in oklab, var(--primary) 14%, transparent);
  color: var(--primary);
  font-size: var(--font-size-small);
}

.form-label { display: block; font-size: var(--font-size-small); color: var(--muted-foreground); margin-bottom: 4px; }
.form-control, .form-select {
  width: 100%;
  padding: 5px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: transparent;
  color: var(--foreground);
  font: inherit;
}
.form-check { display: flex; align-items: center; gap: 6px; }
.form-check input { accent-color: var(--primary); }
input[type='range'] { accent-color: var(--primary); }

table { border-collapse: collapse; width: 100%; }
th, td { text-align: left; padding: 5px 10px; border-bottom: 1px solid var(--border); }
th { font-weight: 500; color: var(--muted-foreground); font-size: var(--font-size-small); }
.table-responsive { overflow-x: auto; }
`;
var PAGE_CSS = `
:root { --background: var(--dsh-viz-page, light-dark(rgb(255 255 255), rgb(24 24 27))); }
html { background: var(--background); }
body { min-height: 100vh; }
.viz-page { max-width: 1440px; margin: 0 auto; padding: 24px clamp(16px, 3vw, 40px) 48px; }
.viz-page-narrow { max-width: 960px; }
.viz-page-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 16px;
  padding: 12px clamp(16px, 3vw, 40px);
  background: var(--background);
  border-bottom: 1px solid var(--border);
}
.viz-page-header h1 { margin: 0; font-size: 1.25em; }
.viz-page-header .viz-controls { margin: 0 0 0 auto; }
.viz-section { margin-top: 32px; }
.viz-section:first-child { margin-top: 0; }
.viz-tabs { display: flex; flex-wrap: wrap; gap: 4px; border-bottom: 1px solid var(--border); margin-bottom: 20px; }
.viz-tab {
  appearance: none;
  padding: 8px 14px;
  border: 0;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  background: transparent;
  color: var(--muted-foreground);
  font: inherit;
  cursor: pointer;
}
.viz-tab:hover { color: var(--foreground); }
.viz-tab[aria-selected='true'] { color: var(--foreground); border-bottom-color: var(--primary); font-weight: 500; }
@media (max-width: 768px) {
  .viz-page-header .viz-controls { margin-left: 0; width: 100%; }
}
`;

// src/viz-helper.ts
var PROMPT_MESSAGE_TYPE = "dsh-visualize:prompt";
var STATE_MESSAGE_TYPE = "dsh-visualize:state";
var CARD_STATE_MAX_CHARS = 16 * 1024;
function scriptJson(value) {
  return JSON.stringify(value).replace(/[<>&\u2028\u2029]/gu, (ch) => `\\u${ch.charCodeAt(0).toString(16).padStart(4, "0")}`);
}
function vizHelperScript(style, chart, promptToken, state = {}) {
  return compact(`
(function () {
  var STYLE = ${JSON.stringify(style)};
  var CHART = ${JSON.stringify(chart)};
  var PROMPT_TOKEN = ${JSON.stringify(promptToken ?? null)};
  var STATE_TOKEN = ${JSON.stringify(state.token ?? null)};
  var saved = ${scriptJson(state.values ?? {})};
  var GENERIC = /^(serif|sans-serif|monospace|cursive|fantasy|system-ui|ui-[a-z-]+|-apple-system|emoji|math)$/;
  var paint = null;
  function host(root) { return root || document.body || document.documentElement; }
  function probe(root, prop, value) {
    var span = document.createElement('span');
    span.style.position = 'absolute';
    span.style.visibility = 'hidden';
    span.style.setProperty(prop, value);
    host(root).appendChild(span);
    var out = getComputedStyle(span).getPropertyValue(prop);
    span.remove();
    return out;
  }
  // A light-dark() nested inside another function (color-mix) survives into
  // the computed value, and canvas has no colour scheme to resolve it with:
  // pick the branch for the frame's scheme here.
  function pickScheme(css) {
    var dark = /dark/.test(getComputedStyle(document.documentElement).colorScheme);
    for (var at = css.indexOf('light-dark('); at !== -1; at = css.indexOf('light-dark(')) {
      var depth = 0, comma = -1, i = at + 11;
      for (; i < css.length; i++) {
        var ch = css.charAt(i);
        if (ch === '(') depth++;
        else if (ch === ')') { if (depth === 0) break; depth--; }
        else if (ch === ',' && depth === 0 && comma === -1) comma = i;
      }
      if (comma === -1 || i >= css.length) break;
      css = css.slice(0, at) + (dark ? css.slice(comma + 1, i) : css.slice(at + 11, comma)).trim() + css.slice(i + 1);
    }
    return css;
  }
  // Any CSS colour (light-dark, color-mix, hex) normalised through canvas.
  function rgba(css) {
    paint = paint || document.createElement('canvas').getContext('2d');
    paint.fillStyle = '#000';
    paint.fillStyle = pickScheme(css);
    var s = String(paint.fillStyle);
    if (s.charAt(0) === '#') {
      return [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16), 1];
    }
    var m = s.match(/[\\d.]+/g) || ['0', '0', '0'];
    // color-mix() and friends serialise as color(srgb r g b / a) with 0\u20131 channels.
    var k = /^color\\(srgb /.test(s) ? 255 : /^rgba?\\(/.test(s) ? 1 : 0;
    if (k === 0) return null;
    return [Math.round(Number(m[0]) * k), Math.round(Number(m[1]) * k), Math.round(Number(m[2]) * k), m.length > 3 ? Number(m[3]) : 1];
  }
  function alpha(css, a) {
    var c = rgba(css);
    if (c === null) return pickScheme(css);
    return 'rgba(' + c[0] + ', ' + c[1] + ', ' + c[2] + ', ' + Number((c[3] * (a === undefined ? 1 : a)).toFixed(3)) + ')';
  }
  function color(token, a, root) { return alpha(probe(root, 'color', 'var(' + token + ')'), a); }
  function raw(token, root) { return getComputedStyle(host(root)).getPropertyValue(token).trim(); }
  function smallSize(root) { return Math.max(11, parseFloat(probe(root, 'font-size', 'var(--font-size-small)')) || 12); }
  function family(root) { return getComputedStyle(host(root)).fontFamily; }
  function isValueAxis(scale) {
    var options = scale && scale.chart && scale.chart.options;
    return scale.axis !== ((options && options.indexAxis) || 'x');
  }
  function chartDefaults(Chart, root) {
    var d = Chart.defaults;
    var axes = raw('--viz-grid-axes', root) || 'value';
    var dash = (raw('--viz-grid-dash', root) || '0').split(/[\\s,]+/).map(Number).filter(function (n) { return n > 0; });
    var theme = {
      style: STYLE,
      fontFamily: family(root),
      fontSize: smallSize(root),
      foreground: color('--foreground', 1, root),
      muted: color('--muted-foreground', 1, root),
      primary: color('--primary', 1, root),
      context: color('--viz-context', 1, root),
      grid: color('--viz-grid', 1, root),
      axis: color('--viz-axis', 1, root),
      lineWidth: Number(raw('--viz-line-width', root)) || 2,
      series: [1, 2, 3, 4, 5, 6].map(function (i) { return color('--viz-series-' + i, 1, root); }),
      alpha: alpha,
      fade: fade,
    };
    d.font.family = theme.fontFamily;
    d.font.size = theme.fontSize;
    d.color = theme.muted;
    d.borderColor = theme.grid;
    var scale = d.scale;
    scale.grid.color = theme.grid;
    scale.border.color = theme.axis;
    // Chart.js 4 dashes gridlines through border.dash (the axis line too).
    scale.border.dash = dash;
    if (CHART.axisWidth) scale.border.width = CHART.axisWidth;
    if (axes === 'none') {
      // L-shaped axes with short outward ticks, no gridlines.
      scale.grid.drawOnChartArea = false;
      scale.grid.tickLength = 4;
      scale.grid.color = theme.axis;
    } else if (axes !== 'both') {
      scale.grid.display = function (ctx) { return isValueAxis(ctx.scale); };
    }
    if (CHART.valueAxisLine === false) {
      scale.border.display = function (ctx) { return !isValueAxis(ctx.scale); };
    }
    var line = d.elements.line, point = d.elements.point;
    line.borderWidth = theme.lineWidth;
    if (CHART.tension !== undefined) line.tension = CHART.tension;
    if (CHART.pointRadius !== undefined) point.radius = CHART.pointRadius;
    if (CHART.pointStyles) {
      point.pointStyle = function (ctx) { return CHART.pointStyles[ctx.datasetIndex % CHART.pointStyles.length]; };
      d.plugins.legend.labels.usePointStyle = true;
    }
    if (CHART.dashes) {
      line.borderDash = function (ctx) { return CHART.dashes[ctx.datasetIndex % CHART.dashes.length]; };
    }
    return theme;
  }
  // The house area fill: the colour fading out down the plot area.
  function fade(c, a) {
    return function (ctx) {
      var area = ctx.chart.chartArea;
      if (!area) return null;
      var g = ctx.chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
      g.addColorStop(0, alpha(c, a === undefined ? 0.25 : a));
      g.addColorStop(1, alpha(c, 0));
      return g;
    };
  }
  function fontsReady(text, root) {
    var fonts = document.fonts;
    if (!fonts || typeof fonts.load !== 'function') return Promise.resolve();
    var size = smallSize(root);
    var sample = (text || '') + ' ' + ((document.body && document.body.textContent) || '').slice(0, 600) + ' 0123456789';
    var names = family(root).split(',').map(function (n) { return n.trim(); })
      .filter(function (n) { return n.length > 0 && !GENERIC.test(n); }).slice(0, 3);
    var loads = names.map(function (n) {
      return fonts.load('400 ' + size + 'px ' + n, sample).catch(function () {});
    });
    var settled = Promise.all(loads).then(function () { return fonts.ready; });
    return Promise.race([settled, new Promise(function (done) { setTimeout(done, 2500); })]);
  }
  function prompt(text) {
    if (PROMPT_TOKEN === null || typeof text !== 'string' || text.trim() === '') return false;
    // Only from the reader's own gesture in this frame; the card re-checks.
    var activation = navigator.userActivation;
    if (activation && activation.isActive === false) return false;
    parent.postMessage({ type: ${JSON.stringify(PROMPT_MESSAGE_TYPE)}, token: PROMPT_TOKEN, text: text }, '*');
    return true;
  }
  // Saved state. Every write goes through JSON, so what the card stores is
  // what a reload gets back; the card enforces the same cap on its side.
  var posted = JSON.stringify(saved);
  function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function commit(next) {
    var json;
    try { json = JSON.stringify(next); } catch (e) { return false; }
    if (json.length > ${CARD_STATE_MAX_CHARS}) return false;
    saved = JSON.parse(json);
    if (STATE_TOKEN !== null && json !== posted) {
      posted = json;
      parent.postMessage({ type: ${JSON.stringify(STATE_MESSAGE_TYPE)}, token: STATE_TOKEN, state: saved }, '*');
    }
    return true;
  }
  function setState(key, value) {
    var next = Object.create(null);
    for (var k in saved) if (own(saved, k)) next[k] = saved[k];
    if (value === undefined) delete next[key]; else next[key] = value;
    return commit(next);
  }
  function getState(key, fallback) {
    if (!loaded) restore();
    return own(saved, key) ? JSON.parse(JSON.stringify(saved[key])) : fallback;
  }
  var KEEP = '[data-viz-keep]', FIELDS = 'input,select,textarea';
  var SKIP = /^(button|submit|reset|image|file|password|hidden)$/;
  var settled = Object.create(null), loaded = false;
  function keyOf(el) {
    if (SKIP.test(el.type)) return null;
    var name = el.getAttribute('data-viz-keep') || (el.type === 'radio' ? el.name : el.id || el.name);
    return name ? 'keep:' + name : null;
  }
  function valueOf(el) {
    if (el.type === 'checkbox') return el.checked;
    if (el.type === 'radio') return el.checked ? el.value : undefined;
    if (el.multiple) return [].filter.call(el.options, function (o) { return o.selected; }).map(function (o) { return o.value; });
    return el.value;
  }
  // Put a saved value into a control: the element whose value changed, false
  // when it already holds it, null when it cannot take it (yet).
  function put(el, v) {
    if (el.type === 'checkbox') {
      if (typeof v !== 'boolean') return null;
      if (el.checked === v) return false;
      el.checked = v;
      return el;
    }
    if (el.type === 'radio') {
      var hit = [].filter.call(document.getElementsByName(el.name), function (r) { return r.type === 'radio' && r.value === v; })[0];
      if (!hit) return null;
      if (hit.checked) return false;
      hit.checked = true;
      return hit;
    }
    if (el.multiple) {
      if (!Array.isArray(v)) return null;
      var changed = false;
      [].forEach.call(el.options, function (o) {
        var on = v.indexOf(o.value) !== -1;
        if (o.selected !== on) { o.selected = on; changed = el; }
      });
      return changed;
    }
    if (typeof v !== 'string') return null;
    if (el.tagName === 'SELECT' && ![].some.call(el.options, function (o) { return o.value === v; })) return null;
    if (el.value === v) return false;
    el.value = v;
    return el;
  }
  function fire(el) {
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }
  // Each key is restored once, by the first control that can take its value;
  // until the document has loaded, a select or radio group still parsing may
  // match later.
  function restore() {
    document.querySelectorAll(KEEP).forEach(function (box) {
      (box.matches(FIELDS) ? [box] : [].slice.call(box.querySelectorAll(FIELDS))).forEach(function (el) {
        var key = keyOf(el);
        if (key === null || settled[key]) return;
        var done = own(saved, key) ? put(el, saved[key]) : false;
        if (done === null && !loaded) return;
        settled[key] = true;
        if (done) fire(done);
      });
    });
  }
  function save(event) {
    var el = event.target;
    if (!el || !el.matches || !el.matches(FIELDS) || !el.closest(KEEP)) return;
    var key = keyOf(el), value = valueOf(el);
    if (key !== null && value !== undefined) setState(key, value);
  }
  addEventListener('input', save, true);
  addEventListener('change', save, true);
  new MutationObserver(function (records) {
    if (!loaded) return restore();
    for (var i = 0; i < records.length; i++) {
      for (var j = 0; j < records[i].addedNodes.length; j++) {
        var n = records[i].addedNodes[j];
        if (n.nodeType === 1 && (n.closest(KEEP) || n.querySelector(KEEP))) return restore();
      }
    }
  }).observe(document, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', function () { loaded = true; restore(); });
  var formats = {};
  function fmt(n, o) {
    if (typeof n !== 'number' || !isFinite(n)) return n === null || n !== n ? '\\u2014' : String(n);
    o = typeof o === 'number' ? { digits: o } : o || {};
    var opt = { style: o.percent ? 'percent' : o.currency ? 'currency' : 'decimal' };
    if (o.currency) opt.currency = o.currency;
    if (o.compact) opt.notation = 'compact';
    if (o.sign) opt.signDisplay = 'exceptZero';
    if (o.digits !== undefined) opt.minimumFractionDigits = opt.maximumFractionDigits = o.digits;
    else if (o.sig !== undefined) opt.maximumSignificantDigits = o.sig;
    else if (!o.currency) {
      var m = Math.abs(o.percent ? n * 100 : n);
      if (m >= 1 || m === 0) opt.maximumFractionDigits = o.percent || o.compact ? 1 : 2;
      else opt.maximumSignificantDigits = 2;
    }
    var key = (o.locale || '') + JSON.stringify(opt);
    var f = formats[key] || (formats[key] = new Intl.NumberFormat(o.locale, opt));
    return f.format(n) + (o.unit || '');
  }
  var NUMERIC = /^-?(\\d+\\.?\\d*|\\.\\d+)(e[+-]?\\d+)?$/i;
  function bind(root, render) {
    root = typeof root === 'string' ? document.querySelector(root) : root;
    if (!loaded) restore();
    var last = null;
    function params() {
      var p = {};
      root.querySelectorAll(FIELDS).forEach(function (el) {
        var name = el.getAttribute('data-viz-param') || el.name;
        if (!name || SKIP.test(el.type) || (el.type === 'radio' && !el.checked)) return;
        var v = valueOf(el);
        if (el.type === 'range' || el.type === 'number') v = v === '' ? null : Number(v);
        else if ((el.tagName === 'SELECT' || el.type === 'radio') && NUMERIC.test(v)) v = Number(v);
        p[name] = v;
      });
      return p;
    }
    function run(force) {
      var p = params(), json = JSON.stringify(p);
      if (force !== true && json === last) return p;
      last = json;
      var out = render(p) || {};
      root.querySelectorAll('[data-viz-out]').forEach(function (el) {
        var k = el.getAttribute('data-viz-out'), v = own(out, k) ? out[k] : p[k];
        if (v !== undefined) el.textContent = typeof v === 'number' ? fmt(v) : String(v);
      });
      return p;
    }
    root.addEventListener('input', run);
    root.addEventListener('change', run);
    run(true);
    return function () { return run(true); };
  }
  function chart(target, config, root) {
    var canvas = typeof target === 'string' ? document.querySelector(target) : target;
    root = root || canvas.parentNode;
    var theme = chartDefaults(Chart, root);
    var cfg = typeof config === 'function' ? config(theme) : config;
    var data = cfg.data || (cfg.data = {});
    var sets = data.datasets || (data.datasets = []);
    var options = cfg.options || (cfg.options = {});
    if (options.responsive === undefined) options.responsive = true;
    if (options.maintainAspectRatio === undefined) options.maintainAspectRatio = false;
    var plugins = options.plugins || (options.plugins = {});
    if (sets.length === 1 && !plugins.legend) plugins.legend = { display: false };
    function put(args) {
      var into = handle.chart ? handle.chart.data : data;
      if (args[0] !== undefined) into.labels = args[0];
      for (var i = 1; i < args.length; i++) if (into.datasets[i - 1]) into.datasets[i - 1].data = args[i];
    }
    var handle = {
      chart: null,
      theme: theme,
      update: function () {
        put(arguments);
        if (handle.chart) handle.chart.update();
        return handle;
      },
    };
    var text = (data.labels || []).concat(sets.map(function (d) { return d.label || ''; })).join(' ');
    handle.ready = fontsReady(text, root).then(function () {
      handle.chart = new Chart(canvas, cfg);
      return handle.chart;
    });
    return handle;
  }
  function selectTab(list, tab, save) {
    [].forEach.call(list.querySelectorAll('.viz-tab'), function (t, i) {
      var on = t === tab, panel = document.getElementById(t.getAttribute('aria-controls') || '');
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      if (panel) panel.hidden = !on;
      if (on && save && list.id && list.closest(KEEP)) setState('tab:' + list.id, i);
    });
  }
  document.addEventListener('click', function (event) {
    var tab = event.target.closest && event.target.closest('.viz-tab');
    var list = tab && tab.closest('.viz-tabs');
    if (list && !event.defaultPrevented) selectTab(list, tab, true);
  });
  // Panels follow the selected tab from the start; a kept pick is clicked
  // back, so the card's own tab handlers run as for the reader's click.
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.viz-tabs').forEach(function (list) {
      var tabs = list.querySelectorAll('.viz-tab');
      var kept = list.id && list.closest(KEEP) ? saved['tab:' + list.id] : undefined;
      if (typeof kept === 'number' && tabs[kept]) return tabs[kept].click();
      var on = list.querySelector('.viz-tab[aria-selected="true"]') || tabs[0];
      if (on) selectTab(list, on, false);
    });
  });
  window.dshViz = {
    style: STYLE, color: color, chartDefaults: chartDefaults, fontsReady: fontsReady,
    canPrompt: PROMPT_TOKEN !== null, prompt: prompt,
    bind: bind, fmt: fmt, chart: chart,
    state: {
      get: getState,
      set: function (key, value) { return setState(String(key), value); },
      clear: function () { return commit({}); },
    },
  };
})();
`);
}
function compact(script) {
  return script.replace(/^[ \t]+/gmu, "").replace(/^\/\/.*\n/gmu, "");
}

// src/shell.ts
var RESOURCE_ORIGINS = [
  "https://cdnjs.cloudflare.com",
  "https://cdn.jsdelivr.net",
  "https://esm.sh",
  "https://fonts.bunny.net",
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
  "https://unpkg.com"
];
var RESOURCE_SOURCES = ["blob:", "data:", ...RESOURCE_ORIGINS].join(" ");
var FRAME_CSP = [
  "default-src 'none'",
  `script-src 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' ${RESOURCE_SOURCES}`,
  `style-src 'unsafe-inline' ${RESOURCE_SOURCES}`,
  `img-src ${RESOURCE_SOURCES}`,
  `font-src ${RESOURCE_SOURCES}`,
  `media-src ${RESOURCE_SOURCES}`,
  "worker-src blob:",
  "connect-src blob: data:",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'"
].join("; ");
var HEIGHT_MESSAGE_TYPE = "dsh-visualize:height";
var STREAM_MESSAGE_TYPE = "dsh-visualize:stream";
function buildFrameDoc(options) {
  const style = STYLES[options.style ?? DEFAULT_STYLE] ?? STYLES[DEFAULT_STYLE];
  const rootVars = Object.entries({ ...options.themeVars, ...style.vars }).map(([name2, value]) => [name2, sanitizeCssValue(value)]).filter(([, value]) => value.length > 0).map(([name2, value]) => `--dsh-viz-${name2}: ${value};`).join(" ");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="no-referrer">
<meta http-equiv="Content-Security-Policy" content="${FRAME_CSP}">
<title>${escapeHtml(options.title)}</title>
${style.fontHref === void 0 ? "" : `<link rel="stylesheet" href="${escapeHtml(style.fontHref)}">
`}<style>${FRAME_CSS}${options.variant === "page" ? PAGE_CSS : ""}
:root { ${rootVars} color-scheme: ${options.colorScheme}; }
${options.variant === "page" ? "" : "body { padding: 4px 2px; }"}${style.extraCss === void 0 ? "" : `
${style.extraCss}`}</style>
<script>${vizHelperScript(style.id, style.chart, options.promptable === true ? options.reportToken : void 0, {
    values: options.savedState,
    token: options.savesState === true ? options.reportToken : void 0
  })}<\/script>
</head>
<body>
${options.fragment}
<script>${heightReporter(options.reportToken)}<\/script>
</body>
</html>
`;
}
function heightReporter(reportToken) {
  const token = JSON.stringify(reportToken);
  return `
(function () {
  var post = function () {
    parent.postMessage({
      type: ${JSON.stringify(HEIGHT_MESSAGE_TYPE)},
      token: ${token},
      height: document.documentElement.scrollHeight,
    }, '*');
  };
  new ResizeObserver(post).observe(document.documentElement);
  addEventListener('load', post);
  post();
})();
`;
}
function buildStreamShellDoc(options) {
  const shell = buildFrameDoc({
    ...options,
    title: "Streaming preview",
    fragment: `<div id="dsh-viz-stream-root"></div>
<style>
.dsh-viz-enter { animation: dsh-viz-enter 0.4s cubic-bezier(0.2, 0.7, 0.3, 1) both; }
@keyframes dsh-viz-enter { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
</style>
<script>${streamSync(options.reportToken)}<\/script>`
  });
  return shell;
}
function streamSync(reportToken) {
  return `
(function () {
  var root = document.getElementById('dsh-viz-stream-root');
  var token = ${JSON.stringify(reportToken)};
  function syncAttrs(cur, next) {
    var i, attrs = cur.attributes;
    for (i = attrs.length - 1; i >= 0; i--) {
      if (!next.hasAttribute(attrs[i].name)) cur.removeAttribute(attrs[i].name);
    }
    attrs = next.attributes;
    for (i = 0; i < attrs.length; i++) {
      if (cur.getAttribute(attrs[i].name) !== attrs[i].value) cur.setAttribute(attrs[i].name, attrs[i].value);
    }
  }
  function executable(node) {
    // Scripts parsed via innerHTML are permanently inert; an executable clone
    // runs on insertion. Streamed markup only ever appends, so each complete
    // script block arrives at its index exactly once and runs exactly once.
    var script = document.createElement('script');
    for (var i = 0; i < node.attributes.length; i++) {
      script.setAttribute(node.attributes[i].name, node.attributes[i].value);
    }
    script.textContent = node.textContent;
    return script;
  }
  function sync(cur, next) {
    var want = next.childNodes, have = cur.childNodes, i;
    for (i = 0; i < want.length; i++) {
      var target = want[i], live = have[i];
      if (live === undefined) {
        var added = target.nodeName === 'SCRIPT' ? executable(target) : target.cloneNode(true);
        if (added.nodeType === 1 && added.nodeName !== 'SCRIPT') added.classList.add('dsh-viz-enter');
        cur.appendChild(added);
        continue;
      }
      if (live.nodeType !== target.nodeType || live.nodeName !== target.nodeName) {
        cur.replaceChild(target.cloneNode(true), live);
        continue;
      }
      if (live.nodeType === 3 || live.nodeType === 8) {
        if (live.nodeValue !== target.nodeValue) live.nodeValue = target.nodeValue;
        continue;
      }
      if (live.nodeType === 1) {
        syncAttrs(live, target);
        sync(live, target);
      }
    }
    while (cur.childNodes.length > want.length) cur.removeChild(cur.lastChild);
  }
  addEventListener('message', function (event) {
    var data = event.data;
    if (!data || data.type !== ${JSON.stringify(STREAM_MESSAGE_TYPE)} || data.token !== token) return;
    if (typeof data.fragment !== 'string') return;
    var next = document.createElement('div');
    next.innerHTML = data.fragment;
    sync(root, next);
  });
})();
`;
}
function sanitizeCssValue(value) {
  const trimmed = value.trim();
  return /[;{}<>]/u.test(trimmed) ? "" : trimmed;
}
function escapeHtml(text) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

// src/client/prompt-bridge.ts
var PROMPT_MAX_CHARS = 2e3;
var PROMPT_INTERVAL_MS = 300;
function readPromptMessage(data, token) {
  if (typeof data !== "object" || data === null) return void 0;
  const message = data;
  if (message.type !== PROMPT_MESSAGE_TYPE || message.token !== token) return void 0;
  if (typeof message.text !== "string") return void 0;
  const text = message.text.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/gu, "").trim();
  if (text === "" || text.length > PROMPT_MAX_CHARS) return void 0;
  return text;
}
function readerIsInFrame(frame) {
  if (frame.ownerDocument.activeElement !== frame) return false;
  const activation = navigator.userActivation;
  return typeof activation?.isActive !== "boolean" || activation.isActive;
}
function draftPrompt(input, text, carded) {
  const state = input.state?.getSnapshot();
  if (state?.phase !== void 0 && state.phase !== "plain") return "busy";
  const draft = state?.draft?.trim() ?? "";
  if (draft !== "" && draft !== carded) {
    input.notify?.("info", keptDraftNotice());
    return "kept-draft";
  }
  input.setDraft(text);
  input.focus?.();
  return "drafted";
}
function composerFor(host, sessionId) {
  if (typeof sessionId !== "string" || sessionId === "") return void 0;
  try {
    const sessions = host.get("sessions");
    const scope = typeof sessions?.scope === "function" ? sessions.scope(sessionId) : void 0;
    const conversation = scope?.get("conversation");
    if (scope === void 0 || typeof conversation?.input?.for !== "function") return void 0;
    const input = conversation.input.for(scope);
    return typeof input?.setDraft === "function" ? input : void 0;
  } catch {
    return void 0;
  }
}
function promptSinkFor(host, sessionId) {
  if (typeof sessionId !== "string" || sessionId === "") return void 0;
  try {
    const sessions = host.get("sessions");
    const scope = typeof sessions?.scope === "function" ? sessions.scope(sessionId) : void 0;
    const conversation = scope?.get("conversation");
    if (typeof conversation?.input?.for !== "function") return void 0;
  } catch {
    return void 0;
  }
  return (text) => {
    const input = composerFor(host, sessionId);
    if (input === void 0) return "unavailable";
    const outcome = draftPrompt(input, text, cardDrafts.get(sessionId));
    if (outcome === "drafted") cardDrafts.set(sessionId, text);
    return outcome;
  };
}
var cardDrafts = /* @__PURE__ */ new Map();
function keptDraftNotice() {
  return document.documentElement.lang.toLowerCase().startsWith("zh") ? "\u8F93\u5165\u6846\u91CC\u5DF2\u6709\u8349\u7A3F\uFF0C\u5361\u7247\u7684\u5185\u5BB9\u6CA1\u6709\u5199\u5165" : "The composer already has a draft, so the card\u2019s text was not inserted";
}

// src/window-doc.ts
var FRAME_SANDBOX = "allow-scripts";
function buildWindowDoc(options) {
  const surface = sanitizeCssValue(options.background);
  const background = surface.length > 0 ? surface : options.colorScheme === "dark" ? "#1b1b1f" : "#ffffff";
  const inset = options.variant === "page" ? "0" : "16px 24px";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="no-referrer">
<title>${escapeHtml2(options.title)}</title>
<style>
:root { color-scheme: ${options.colorScheme}; background: ${background}; }
html, body { margin: 0; height: 100%; }
iframe { display: block; box-sizing: border-box; width: 100%; height: 100%; border: 0; padding: ${inset}; background: transparent; color-scheme: ${options.colorScheme}; }
</style>
</head>
<body><iframe sandbox="${FRAME_SANDBOX}" referrerpolicy="no-referrer" title="${escapeHtml2(options.title)}" srcdoc="${escapeHtml2(options.frameDoc)}"></iframe></body>
</html>
`;
}
function escapeHtml2(text) {
  return text.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("'", "&#39;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

// src/client/theme.ts
var TOKEN_BRIDGE = [
  ["foreground", "--dsw-alias-label-primary"],
  ["card", "--dsw-alias-bg-layer-1"],
  // The conversation surface itself, which a page frame fills its tab with.
  ["page", "--dsw-alias-bg-base"],
  ["muted-foreground", "--dsw-alias-label-caption"],
  ["border", "--dsw-alias-border-l2"],
  ["primary", "--dsw-alias-brand-primary-new-colorprimary-new-color"],
  ["primary-foreground", "--dsw-alias-label-primary-inverted"]
];
function resolveTheme() {
  const computed = getComputedStyle(document.body);
  const themeVars = {};
  for (const [frameName, hostToken] of TOKEN_BRIDGE) {
    themeVars[frameName] = computed.getPropertyValue(hostToken);
  }
  const scheme = computed.colorScheme;
  const colorScheme = scheme.includes("dark") && !scheme.includes("light") ? "dark" : scheme.includes("light") && !scheme.includes("dark") ? "light" : document.body.hasAttribute("data-ds-dark-theme") ? "dark" : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  return { themeVars, colorScheme };
}

// src/client/style.ts
var lastCreated = DEFAULT_STYLE;
function noteSettledStyle(style, argsRaw) {
  if (argsRaw !== void 0 && /"action"\s*:\s*"update"/u.test(argsRaw)) return;
  lastCreated = style;
}
function liveStyle() {
  return configuredStyle() ?? lastCreated;
}
function configuredStyle() {
  const config = globalThis[PAGE_CONFIG_GLOBAL];
  const style = config?.style;
  return typeof style === "string" && STYLE_IDS.includes(style) ? style : void 0;
}

// src/client/images.ts
var import_react = require("react");

// src/image-embed.ts
var TOKEN = /<script\b[\s\S]*?<\/script\s*>|<style\b[\s\S]*?<\/style\s*>|<!--[\s\S]*?-->|<img\b(?:[^>"']|"[^"]*"|'[^']*')*>/giu;
var SOURCE_ATTR = /\sdata-viz-src\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/iu;
var MAX_EMBEDDED_CHARS = 20 * 1024 * 1024;
function embedImages(fragment, urls, maxChars = MAX_EMBEDDED_CHARS) {
  if (urls.size === 0) return fragment;
  let left = maxChars;
  return fragment.replaceAll(TOKEN, (token) => {
    if (!/^<img\b/iu.test(token)) return token;
    const m = SOURCE_ATTR.exec(token);
    const url = m === null ? void 0 : urls.get(m[1] ?? m[2] ?? m[3]);
    if (url === void 0 || !url.startsWith("data:") || url.includes('"')) return token;
    if (url.length > left) return token;
    left -= url.length;
    return `<img src="${url}"${token.slice(4)}`;
  });
}
function dataUrlOf(type, data) {
  let binary = "";
  for (let at = 0; at < data.byteLength; at += 32768) {
    binary += String.fromCharCode(...data.subarray(at, at + 32768));
  }
  return `data:${type};base64,${btoa(binary)}`;
}

// src/client/images.ts
var LOAD_TIMEOUT_MS = 15e3;
var CACHE_BUDGET = 96 * 1024 * 1024;
var cache = /* @__PURE__ */ new Map();
var sizes = /* @__PURE__ */ new Map();
var cached = 0;
var fetchImpl = (...args) => fetch(...args);
function loadImage(image) {
  const hit = cache.get(image.id);
  if (hit !== void 0) return hit;
  const url = new URL(`${IMAGE_ROUTE_PATH.slice(1)}?id=${encodeURIComponent(image.id)}`, document.baseURI).href;
  const load = (async () => {
    try {
      const response = await fetchImpl(url, { credentials: "same-origin", signal: AbortSignal.timeout(LOAD_TIMEOUT_MS) });
      if (!response.ok) return void 0;
      const data = new Uint8Array(await response.arrayBuffer());
      return dataUrlOf(image.type, data);
    } catch {
      return void 0;
    }
  })();
  cache.set(image.id, load);
  void load.then((value) => {
    if (value === void 0) {
      cache.delete(image.id);
      return;
    }
    sizes.set(image.id, value.length);
    cached += value.length;
    for (const [id, size] of sizes) {
      if (cached <= CACHE_BUDGET || id === image.id) break;
      cache.delete(id);
      sizes.delete(id);
      cached -= size;
    }
  });
  return load;
}
function useCardImages(meta) {
  const images = meta.images ?? [];
  const key = images.map((image) => `${image.src}\0${image.id}\0${image.type}`).join("\n");
  const [loaded, setLoaded] = (0, import_react.useState)(void 0);
  (0, import_react.useEffect)(() => {
    if (images.length === 0) return;
    let live = true;
    void Promise.all(images.map(async (image) => [image.src, await loadImage(image)])).then((settled) => {
      if (!live) return;
      setLoaded({ key, urls: new Map(settled.flatMap(([src, url]) => url === void 0 ? [] : [[src, url]])) });
    });
    return () => {
      live = false;
    };
  }, [key]);
  const urls = loaded?.key === key ? loaded.urls : void 0;
  const fragment = (0, import_react.useMemo)(
    () => urls === void 0 ? void 0 : embedImages(meta.fragment, urls),
    [meta.fragment, urls]
  );
  if (images.length === 0) return meta;
  return fragment === void 0 ? void 0 : { ...meta, fragment };
}

// src/client/card-state.ts
var STORAGE_PREFIX = "dsh-visualize:state:";
var STATE_TOTAL_MAX_CHARS = 256 * 1024;
var STATE_WRITE_DELAY_MS = 400;
function cardStateKey(session, path, callId) {
  return `${session ?? ""}|${path === "" ? `call:${callId}` : path}`;
}
function isPlainObject(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
function cleanState(value, maxChars) {
  if (!isPlainObject(value)) return void 0;
  let json;
  try {
    json = JSON.stringify(value);
  } catch {
    return void 0;
  }
  if (json.length > maxChars) return void 0;
  return { values: JSON.parse(json), json };
}
function readStateMessage(data, token, maxChars = CARD_STATE_MAX_CHARS) {
  if (typeof data !== "object" || data === null) return void 0;
  const message = data;
  if (message.type !== STATE_MESSAGE_TYPE || message.token !== token) return void 0;
  return cleanState(message.state, maxChars)?.values;
}
function createCardStateStore(storage, options = {}) {
  const cardMax = options.cardMaxChars ?? CARD_STATE_MAX_CHARS;
  const totalMax = options.totalMaxChars ?? STATE_TOTAL_MAX_CHARS;
  const delay = options.delayMs ?? STATE_WRITE_DELAY_MS;
  const now = options.now ?? Date.now;
  const memory = /* @__PURE__ */ new Map();
  const pending = /* @__PURE__ */ new Set();
  let timer;
  function open() {
    try {
      return storage();
    } catch {
      return void 0;
    }
  }
  function parseEntry(raw) {
    if (raw === null) return void 0;
    try {
      const entry = JSON.parse(raw);
      if (entry === null || typeof entry !== "object") return void 0;
      const state = cleanState(entry.s, cardMax);
      if (state === void 0) return void 0;
      return { t: typeof entry.t === "number" && Number.isFinite(entry.t) ? entry.t : 0, s: state.values };
    } catch {
      return void 0;
    }
  }
  function others(store, except) {
    const found = [];
    for (let i = 0; i < store.length; i++) {
      const key = store.key(i);
      if (key === null || !key.startsWith(STORAGE_PREFIX) || key === except) continue;
      const raw = store.getItem(key) ?? "";
      found.push({ key, size: key.length + raw.length, t: parseEntry(raw)?.t ?? 0 });
    }
    return found.sort((a, b) => a.t - b.t);
  }
  function persist(store, key, json) {
    const full = STORAGE_PREFIX + key;
    if (json === "{}") {
      store.removeItem(full);
      return;
    }
    const value = `{"t":${now()},"s":${json}}`;
    const victims = others(store, full);
    let used = victims.reduce((sum, entry) => sum + entry.size, 0);
    while (used + full.length + value.length > totalMax && victims.length > 0) {
      const oldest = victims.shift();
      store.removeItem(oldest.key);
      used -= oldest.size;
    }
    for (; ; ) {
      try {
        store.setItem(full, value);
        return;
      } catch (error) {
        const oldest = victims.shift();
        if (oldest === void 0) throw error;
        store.removeItem(oldest.key);
      }
    }
  }
  function flush() {
    if (timer !== void 0) clearTimeout(timer);
    timer = void 0;
    if (pending.size === 0) return;
    const keys = [...pending];
    pending.clear();
    const store = open();
    if (store === void 0) return;
    for (const key of keys) {
      try {
        persist(store, key, memory.get(key) ?? "{}");
      } catch {
      }
    }
  }
  return {
    read(key) {
      let json = memory.get(key);
      if (json === void 0) {
        try {
          const entry = parseEntry(open()?.getItem(STORAGE_PREFIX + key) ?? null);
          if (entry !== void 0) json = JSON.stringify(entry.s);
        } catch {
        }
        if (json !== void 0) memory.set(key, json);
      }
      return json === void 0 || json === "{}" ? void 0 : JSON.parse(json);
    },
    write(key, values) {
      const state = cleanState(values, cardMax);
      if (state === void 0 || memory.get(key) === state.json) return;
      memory.set(key, state.json);
      pending.add(key);
      if (timer !== void 0) clearTimeout(timer);
      timer = setTimeout(flush, delay);
    },
    flush
  };
}
function pageStorage() {
  return typeof window === "undefined" ? void 0 : window.localStorage;
}
var cardStates = createCardStateStore(pageStorage);
if (typeof window !== "undefined") {
  addEventListener("pagehide", () => cardStates.flush());
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") cardStates.flush();
  });
}

// src/client/frame-lifecycle.ts
var import_react2 = require("react");
function useFirstVisible(target2) {
  const [seen, setSeen] = (0, import_react2.useState)(false);
  (0, import_react2.useEffect)(() => {
    if (seen) return;
    const element = target2.current;
    if (element === null) return;
    if (typeof IntersectionObserver !== "function") {
      setSeen(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.target === element && entry.isIntersecting)) return;
      setSeen(true);
      observer.disconnect();
    }, { rootMargin: "0px", threshold: 0 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [target2, seen]);
  const activate = (0, import_react2.useCallback)(() => setSeen(true), []);
  return [seen, activate];
}

// src/client/frame-messages.ts
function frameHeight(event, frame, token, minimum, maximum) {
  const source = frame?.contentWindow;
  if (source == null || event.source !== source) return void 0;
  const data = event.data;
  if (typeof data !== "object" || data === null) return void 0;
  const report = data;
  if (report.type !== HEIGHT_MESSAGE_TYPE || report.token !== token) return void 0;
  if (typeof report.height !== "number" || !Number.isFinite(report.height) || report.height < 0) return void 0;
  return Math.max(minimum, Math.min(Math.ceil(report.height), maximum));
}
function frameToken(scope) {
  const random = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2);
  return scope + ":" + random;
}

// src/client/frame-locale.ts
var import_react3 = require("react");

// src/client/settings-locale.ts
var EN = {
  styleHeading: "Card style",
  styleIntro: "New cards use this style. Cards already in a conversation keep the style they were made in.",
  "style.whale": "Whale",
  "style.whale.desc": "Matches the dsh interface",
  "style.editorial": "Editorial",
  "style.editorial.desc": "Headline states the finding, one story line",
  "style.paper": "Paper",
  "style.paper.desc": "Like a figure in a paper",
  "style.sketch": "Sketch",
  "style.sketch.desc": "Hand drawn, like a whiteboard",
  "style.terminal": "Terminal",
  "style.terminal.desc": "Monospaced, like a terminal",
  defaultTag: "Default",
  saving: "Saving\u2026",
  saved: "Saved. The next card uses {style}.",
  saveFailed: "Could not save the style. Try again.",
  readOnly: "This profile cannot be edited from here.",
  overridden: "Set in your profile",
  reset: "Use the default",
  unavailableTitle: "This dsh cannot change the card style here",
  unavailableBody: "Set it in {path} instead:",
  previewTitle: "Signups up 18% this week",
  previewNote: "Weekly signups, last 8 weeks",
  filesHeading: "Custom style files",
  filesIntro: "Notes the model reads after the built-in style, such as colours or wording to prefer. The workspace file is read last. Each file counts up to {max} bytes.",
  globalFile: "All workspaces",
  workspaceFile: "Workspace",
  workspacePick: "Workspace",
  fileExists: "Exists",
  fileMissing: "Not created",
  fileBlocked: "This path is a link or not a regular file, so it cannot be edited here.",
  bytes: "{bytes} / {max} bytes",
  tooLarge: "Over the {max}-byte limit by {over} bytes.",
  saveFile: "Save",
  fileSaved: "Saved. It applies from the next skill load.",
  fileRemoved: "Saved empty, so the file was removed.",
  fileSaveFailed: "Could not save the file: {reason}",
  filesUnavailable: "This dsh cannot edit the files here. Edit them directly:",
  filesLoading: "Loading style files\u2026",
  placeholder: "For example: use teal for the accent, label axes in English."
};
var ZH = {
  styleHeading: "\u5361\u7247\u98CE\u683C",
  styleIntro: "\u65B0\u751F\u6210\u7684\u5361\u7247\u7528\u8FD9\u4E2A\u98CE\u683C\u3002\u5BF9\u8BDD\u91CC\u5DF2\u6709\u7684\u5361\u7247\u4FDD\u6301\u5B83\u751F\u6210\u65F6\u7684\u98CE\u683C\u3002",
  "style.whale": "\u9CB8\u84DD",
  "style.whale.desc": "\u548C dsh \u754C\u9762\u4E00\u81F4",
  "style.editorial": "\u62A5\u520A",
  "style.editorial.desc": "\u6807\u9898\u5199\u7ED3\u8BBA\uFF0C\u4E00\u6761\u4E3B\u7EBF",
  "style.paper": "\u8BBA\u6587",
  "style.paper.desc": "\u8BBA\u6587\u63D2\u56FE\u5F0F",
  "style.sketch": "\u624B\u7ED8",
  "style.sketch.desc": "\u767D\u677F\u624B\u7ED8",
  "style.terminal": "\u7EC8\u7AEF",
  "style.terminal.desc": "\u7B49\u5BBD\u7EC8\u7AEF\u98CE",
  defaultTag: "\u9ED8\u8BA4",
  saving: "\u4FDD\u5B58\u4E2D\u2026",
  saved: "\u5DF2\u4FDD\u5B58\uFF0C\u4E0B\u4E00\u5F20\u5361\u7247\u7528\u300C{style}\u300D\u3002",
  saveFailed: "\u98CE\u683C\u6CA1\u6709\u4FDD\u5B58\u6210\u529F\uFF0C\u8BF7\u91CD\u8BD5\u3002",
  readOnly: "\u8FD9\u4E2A\u914D\u7F6E\u4E0D\u80FD\u5728\u8FD9\u91CC\u4FEE\u6539\u3002",
  overridden: "\u5DF2\u5728\u914D\u7F6E\u4E2D\u8BBE\u7F6E",
  reset: "\u6062\u590D\u9ED8\u8BA4",
  unavailableTitle: "\u8FD9\u4E2A\u7248\u672C\u7684 dsh \u4E0D\u80FD\u5728\u8FD9\u91CC\u5207\u6362\u5361\u7247\u98CE\u683C",
  unavailableBody: "\u8BF7\u5728 {path} \u91CC\u8BBE\u7F6E\uFF1A",
  previewTitle: "\u672C\u5468\u6CE8\u518C\u91CF\u4E0A\u6DA8 18%",
  previewNote: "\u8FD1 8 \u5468\u6BCF\u5468\u6CE8\u518C\u91CF",
  filesHeading: "\u81EA\u5B9A\u4E49\u98CE\u683C\u6587\u4EF6",
  filesIntro: "\u6A21\u578B\u5728\u5185\u7F6E\u98CE\u683C\u4E4B\u540E\u8BFB\u7684\u8865\u5145\u8BF4\u660E\uFF0C\u6BD4\u5982\u504F\u597D\u7684\u989C\u8272\u6216\u63AA\u8F9E\uFF1B\u5DE5\u4F5C\u533A\u6587\u4EF6\u6700\u540E\u8BFB\u3002\u6BCF\u4E2A\u6587\u4EF6\u6700\u591A\u8BA1\u5165 {max} \u5B57\u8282\u3002",
  globalFile: "\u6240\u6709\u5DE5\u4F5C\u533A",
  workspaceFile: "\u5DE5\u4F5C\u533A",
  workspacePick: "\u5DE5\u4F5C\u533A",
  fileExists: "\u5DF2\u5B58\u5728",
  fileMissing: "\u672A\u521B\u5EFA",
  fileBlocked: "\u8FD9\u4E2A\u8DEF\u5F84\u662F\u94FE\u63A5\u6216\u4E0D\u662F\u666E\u901A\u6587\u4EF6\uFF0C\u4E0D\u80FD\u5728\u8FD9\u91CC\u7F16\u8F91\u3002",
  bytes: "{bytes} / {max} \u5B57\u8282",
  tooLarge: "\u8D85\u51FA {max} \u5B57\u8282\u4E0A\u9650 {over} \u5B57\u8282\u3002",
  saveFile: "\u4FDD\u5B58",
  fileSaved: "\u5DF2\u4FDD\u5B58\uFF0C\u4E0B\u6B21\u52A0\u8F7D skill \u65F6\u751F\u6548\u3002",
  fileRemoved: "\u5185\u5BB9\u4E3A\u7A7A\uFF0C\u5DF2\u5220\u9664\u8BE5\u6587\u4EF6\u3002",
  fileSaveFailed: "\u6587\u4EF6\u6CA1\u6709\u4FDD\u5B58\u6210\u529F\uFF1A{reason}",
  filesUnavailable: "\u8FD9\u4E2A\u7248\u672C\u7684 dsh \u4E0D\u80FD\u5728\u8FD9\u91CC\u7F16\u8F91\u8FD9\u4E9B\u6587\u4EF6\uFF0C\u8BF7\u76F4\u63A5\u7F16\u8F91\uFF1A",
  filesLoading: "\u6B63\u5728\u8BFB\u53D6\u98CE\u683C\u6587\u4EF6\u2026",
  placeholder: "\u4F8B\u5982\uFF1A\u5F3A\u8C03\u8272\u7528\u9752\u7EFF\u8272\uFF0C\u5750\u6807\u8F74\u6807\u7B7E\u7528\u82F1\u6587\u3002"
};
function settingsLang(active) {
  return active !== void 0 && active.toLowerCase().startsWith("en") ? "en" : "zh";
}
function documentLang() {
  const lang = typeof document === "undefined" ? "" : document.documentElement.lang;
  return lang === "" ? "zh" : settingsLang(lang);
}
function fill(text, params) {
  return params === void 0 ? text : text.replace(/\{(\w+)\}/gu, (match, name2) => Object.hasOwn(params, name2) ? String(params[name2]) : match);
}
function translator(lang) {
  const dict = lang === "en" ? EN : ZH;
  return (key, params) => fill(dict[key], params);
}
function styleName(t, id) {
  return t(`style.${id}`);
}

// src/client/frame-locale.ts
function subscribeDocumentLang(notify) {
  if (typeof document === "undefined" || typeof MutationObserver !== "function") return () => void 0;
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  return () => observer.disconnect();
}
function useDocumentLang(selector) {
  const lang = (0, import_react3.useSyncExternalStore)(subscribeDocumentLang, documentLang, () => "zh");
  return selector({ active: lang });
}
function useVisualizeLanguage(useLocale = useDocumentLang) {
  return useLocale((snapshot) => settingsLang(snapshot.active));
}
var EN2 = {
  openWindow: "Open in new window",
  openPage: "Open page",
  show: "Show here",
  hide: "Collapse",
  kind: "Standalone page",
  rendering: "Visualize \xB7 rendering\u2026",
  settled: "Visualize \xB7 shown below the answer",
  failed: "Visualization failed",
  load: "Load visualization",
  waiting: "Loads when visible",
  release: "Stop and release",
  releaseHint: "Unload the frame. Reloading resets its interaction state.",
  stopped: "Stopped. Reloading resets the interaction state.",
  restart: "Reload visualization",
  windowFallback: "This host could not confirm a new window. The page is expanded here instead.",
  windowUnconfirmed: "This host could not confirm a new window. You can still use the visualization here.",
  streaming: "Visualize \xB7 streaming preview",
  composing: "Visualize \xB7 composing\u2026",
  previewTitle: "Visualization streaming preview"
};
var ZH2 = {
  openWindow: "\u5728\u65B0\u7A97\u53E3\u6253\u5F00",
  openPage: "\u6253\u5F00\u9875\u9762",
  show: "\u5728\u5BF9\u8BDD\u4E2D\u5C55\u5F00",
  hide: "\u6536\u8D77",
  kind: "\u72EC\u7ACB\u9875\u9762",
  rendering: "\u53EF\u89C6\u5316 \xB7 \u751F\u6210\u4E2D\u2026",
  settled: "\u53EF\u89C6\u5316 \xB7 \u5DF2\u5728\u56DE\u7B54\u4E0B\u65B9\u5C55\u793A",
  failed: "\u53EF\u89C6\u5316\u751F\u6210\u5931\u8D25",
  load: "\u52A0\u8F7D\u53EF\u89C6\u5316",
  waiting: "\u8FDB\u5165\u53EF\u89C1\u533A\u57DF\u540E\u52A0\u8F7D",
  release: "\u505C\u6B62\u5E76\u91CA\u653E",
  releaseHint: "\u5378\u8F7D\u6B64\u6846\u67B6\uFF1B\u91CD\u65B0\u52A0\u8F7D\u4F1A\u91CD\u7F6E\u4EA4\u4E92\u72B6\u6001\u3002",
  stopped: "\u5DF2\u505C\u6B62\uFF1B\u91CD\u65B0\u52A0\u8F7D\u4F1A\u91CD\u7F6E\u4EA4\u4E92\u72B6\u6001\u3002",
  restart: "\u91CD\u65B0\u52A0\u8F7D\u53EF\u89C6\u5316",
  windowFallback: "\u5F53\u524D\u5BBF\u4E3B\u65E0\u6CD5\u786E\u8BA4\u65B0\u7A97\u53E3\u662F\u5426\u6253\u5F00\uFF0C\u5DF2\u5728\u5BF9\u8BDD\u4E2D\u5C55\u5F00\u3002",
  windowUnconfirmed: "\u5F53\u524D\u5BBF\u4E3B\u65E0\u6CD5\u786E\u8BA4\u65B0\u7A97\u53E3\u662F\u5426\u6253\u5F00\uFF0C\u53EF\u7EE7\u7EED\u5728\u5BF9\u8BDD\u4E2D\u4F7F\u7528\u3002",
  streaming: "\u53EF\u89C6\u5316 \xB7 \u5B9E\u65F6\u9884\u89C8",
  composing: "\u53EF\u89C6\u5316 \xB7 \u6B63\u5728\u6784\u5EFA\u2026",
  previewTitle: "\u53EF\u89C6\u5316\u5B9E\u65F6\u9884\u89C8"
};
function frameLabels(lang) {
  return lang === "en" ? EN2 : ZH2;
}

// src/open-protocol.ts
var OPEN_PAGE_PATH = "/api/visualize/open";
var MAX_OPEN_PAGE_BYTES = 4 * 1024 * 1024;
var OPEN_PAGE_TTL_MS = 60 * 60 * 1e3;

// src/client/open-page.ts
function isDesktopHost() {
  if (typeof window === "undefined") return false;
  if ("__TAURI_INTERNALS__" in window || "__TAURI__" in window) return true;
  return typeof navigator !== "undefined" && /\bElectron\//u.test(navigator.userAgent);
}
var target;
function registerOpenPageTarget(next) {
  target = next;
  return () => {
    if (target === next) target = void 0;
  };
}
function openInSidebar(url) {
  const opener = target;
  if (opener === void 0) return false;
  try {
    return opener(url) === true;
  } catch {
    return false;
  }
}
async function publish(html, title) {
  if (typeof fetch !== "function") return void 0;
  try {
    const response = await fetch(OPEN_PAGE_PATH, {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mode: "page", html, title })
    });
    if (!response.ok) return void 0;
    const body = await response.json();
    if (body.ok !== true || body.mode !== "page") return void 0;
    return { url: body.url, token: body.token };
  } catch {
    return void 0;
  }
}
async function openSystem(token) {
  try {
    const response = await fetch(OPEN_PAGE_PATH, {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mode: "system", token })
    });
    if (!response.ok) return false;
    const body = await response.json();
    return body.ok === true && body.mode === "system" && body.opened === true;
  } catch {
    return false;
  }
}
async function openPageViaHost(html, title) {
  if (!isDesktopHost()) return false;
  const published = await publish(html, title);
  if (published === void 0) return false;
  if (openInSidebar(published.url)) return true;
  return await openSystem(published.token);
}
function canOpenPageViaHost() {
  return isDesktopHost() && typeof fetch === "function";
}

// src/client/VisualizeCard.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var MIN_HEIGHT = 48;
var HEIGHT_CAP = { inline: 800, wide: 1200, page: 800 };
var headerStyle = {
  display: "flex",
  alignItems: "baseline",
  gap: 8,
  fontSize: 12,
  opacity: 0.65,
  margin: "2px 0 6px",
  overflow: "hidden",
  whiteSpace: "nowrap"
};
var cardStyle = { minWidth: 0, maxWidth: "100%" };
var titleStyle = {
  fontWeight: 500,
  flexShrink: 0,
  maxWidth: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis"
};
var pathStyle = { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" };
var openStyle = {
  alignSelf: "center",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  marginLeft: "auto",
  width: 22,
  height: 22,
  padding: 0,
  border: 0,
  borderRadius: 4,
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
  // The header clips its overflow; keep the focus ring inside the button.
  outlineOffset: -2
};
function buildCardPage(meta, callId, stateKey) {
  const { themeVars, colorScheme } = resolveTheme();
  const variant = variantOf(meta);
  const frameDoc = buildFrameDoc({
    fragment: meta.fragment,
    title: meta.title,
    themeVars,
    colorScheme,
    style: meta.style,
    reportToken: frameToken(`window:${callId}`),
    variant,
    savedState: stateKey === void 0 ? void 0 : cardStates.read(stateKey)
  });
  const background = (variant === "page" ? themeVars.page : themeVars.card) ?? "";
  return buildWindowDoc({ frameDoc, title: meta.title, colorScheme, background, variant });
}
function openInWindowResult(meta, callId, stateKey) {
  if (!canOpenWindow()) return "unavailable";
  let popup = null;
  let url;
  try {
    popup = window.open("about:blank", "_blank");
    if (popup === null || popup.closed) return "unconfirmed";
    try {
      popup.opener = null;
    } catch {
    }
    url = URL.createObjectURL(new Blob([buildCardPage(meta, callId, stateKey)], { type: "text/html" }));
    popup.location.replace(url);
    return "__TAURI_INTERNALS__" in window || "__TAURI__" in window ? "unconfirmed" : "requested";
  } catch {
    try {
      if (url !== void 0 && typeof URL.revokeObjectURL === "function") URL.revokeObjectURL(url);
    } catch {
    }
    try {
      popup?.close();
    } catch {
    }
    return "unconfirmed";
  }
}
function openCardPage(meta, callId, stateKey) {
  if (!canOpenPageViaHost()) return openInWindowResult(meta, callId, stateKey);
  return openPageViaHost(buildCardPage(meta, callId, stateKey), meta.title).then((opened) => opened ? "opened" : openInWindowResult(meta, callId, stateKey)).catch(() => openInWindowResult(meta, callId, stateKey));
}
function settleOpen(attempt, done) {
  if (typeof attempt === "string") done(attempt);
  else void attempt.then(done);
}
function canOpenWindow() {
  return typeof window.open === "function" && typeof URL.createObjectURL === "function";
}
function variantOf(meta) {
  return meta.mode === "page" ? "page" : "card";
}
function OpenIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "svg",
    {
      width: "14",
      height: "14",
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9.5 2.5h4v4" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M13.5 2.5 7.5 8.5" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 9.5v3a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3" })
      ]
    }
  );
}
var frameStyle = {
  display: "block",
  width: "100%",
  border: 0,
  background: "transparent"
};
function firstResultLine(content) {
  for (const block of content) {
    if (block.type === "text" && typeof block.text === "string" && block.text.length > 0) {
      const newline = block.text.indexOf("\n");
      return newline === -1 ? block.text : block.text.slice(0, newline);
    }
  }
  return "visualization failed";
}
function useThemeTick() {
  const [themeTick, setThemeTick] = (0, import_react4.useState)(0);
  (0, import_react4.useEffect)(() => {
    const bump = () => setThemeTick((tick) => tick + 1);
    const observer = new MutationObserver(bump);
    observer.observe(document.documentElement, { attributes: true });
    observer.observe(document.body, { attributes: true });
    const media = matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", bump);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", bump);
    };
  }, []);
  return themeTick;
}
function useFrameDoc(meta, reportToken, variant, promptable = false, state) {
  const themeTick = useThemeTick();
  const theme = (0, import_react4.useMemo)(() => resolveTheme(), [meta, themeTick]);
  const themeKey = JSON.stringify(theme);
  const stateKey = state?.key;
  const savedState = (0, import_react4.useMemo)(
    () => stateKey === void 0 ? void 0 : cardStates.read(stateKey),
    [stateKey, themeKey, meta.fragment, meta.title, meta.style, variant]
  );
  const savesState = state?.saves === true;
  return (0, import_react4.useMemo)(() => {
    const doc = buildFrameDoc({
      fragment: meta.fragment,
      title: meta.title,
      themeVars: theme.themeVars,
      colorScheme: theme.colorScheme,
      reportToken,
      variant,
      style: meta.style,
      promptable,
      savedState,
      savesState
    });
    return { doc, colorScheme: theme.colorScheme };
  }, [meta, reportToken, variant, promptable, theme, savedState, savesState]);
}
function useStateRelay(frameRef, token, stateKey) {
  (0, import_react4.useEffect)(() => {
    if (stateKey === void 0) return;
    const onMessage = (event) => {
      const frame = frameRef.current;
      if (frame === null || event.source !== frame.contentWindow) return;
      const values = readStateMessage(event.data, token);
      if (values !== void 0) cardStates.write(stateKey, values);
    };
    addEventListener("message", onMessage);
    return () => removeEventListener("message", onMessage);
  }, [frameRef, token, stateKey]);
}
function usePromptRelay(frameRef, token, prompt) {
  const lastAt = (0, import_react4.useRef)(-Infinity);
  (0, import_react4.useEffect)(() => {
    if (prompt === void 0) return;
    const onMessage = (event) => {
      const frame = frameRef.current;
      if (frame === null || event.source !== frame.contentWindow) return;
      const text = readPromptMessage(event.data, token);
      if (text === void 0 || !readerIsInFrame(frame)) return;
      const now = performance.now();
      if (now - lastAt.current < PROMPT_INTERVAL_MS) return;
      lastAt.current = now;
      prompt(text);
    };
    addEventListener("message", onMessage);
    return () => removeEventListener("message", onMessage);
  }, [frameRef, token, prompt]);
}
function SizedFrame({ meta, callId, prompt, stateKey }) {
  const [height, setHeight] = (0, import_react4.useState)(MIN_HEIGHT);
  const frameRef = (0, import_react4.useRef)(null);
  usePromptRelay(frameRef, callId, prompt);
  useStateRelay(frameRef, callId, stateKey);
  (0, import_react4.useEffect)(() => {
    const onMessage = (event) => {
      const next = frameHeight(event, frameRef.current, callId, MIN_HEIGHT, HEIGHT_CAP[meta.mode]);
      if (next !== void 0) setHeight(next);
    };
    addEventListener("message", onMessage);
    return () => removeEventListener("message", onMessage);
  }, [callId, meta.mode]);
  const { doc, colorScheme } = useFrameDoc(
    meta,
    callId,
    variantOf(meta),
    prompt !== void 0,
    stateKey === void 0 ? void 0 : { key: stateKey, saves: true }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "iframe",
    {
      ref: frameRef,
      sandbox: FRAME_SANDBOX,
      referrerPolicy: "no-referrer",
      title: meta.title,
      srcDoc: doc,
      style: { ...frameStyle, height, colorScheme }
    },
    colorScheme
  );
}
function Frame(props) {
  const wrapRef = (0, import_react4.useRef)(null);
  const [seen, activate] = useFirstVisible(wrapRef);
  const [stopped, setStopped] = (0, import_react4.useState)(false);
  const labels = frameLabels(useVisualizeLanguage(props.useLocale));
  const mounted = seen && !stopped;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { ref: wrapRef, style: cardStyle, "data-visualize-viewport": "", "data-state": mounted ? "running" : stopped ? "stopped" : "waiting", children: [
    mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FrameBody, { ...props }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { ...noticeStyle, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: stopped ? labels.stopped : labels.waiting }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: ghostButtonStyle, onClick: () => {
        setStopped(false);
        activate();
      }, children: stopped ? labels.restart : labels.load })
    ] }),
    mounted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { padding: "3px 6px", textAlign: "right" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "button",
      {
        type: "button",
        style: { ...ghostButtonStyle, height: 24, fontSize: 11 },
        title: labels.releaseHint,
        "aria-label": labels.release + " \u2014 " + labels.releaseHint,
        onClick: () => setStopped(true),
        children: labels.release
      }
    ) })
  ] });
}
function FrameBody({ meta: persisted, callId, prompt, stateKey, useLocale }) {
  const [opening, setOpening] = (0, import_react4.useState)(false);
  const [unconfirmed, setUnconfirmed] = (0, import_react4.useState)(false);
  const labels = frameLabels(useVisualizeLanguage(useLocale));
  const meta = useCardImages(persisted);
  if (meta === void 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: headerStyle, children: [
    persisted.title,
    " \xB7 ",
    labels.rendering
  ] });
  if (meta.mode === "page") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageLauncher, { meta, callId, prompt, stateKey, useLocale });
  const open = () => {
    if (opening) return;
    setOpening(true);
    settleOpen(openCardPage(meta, callId, stateKey), (result) => {
      setUnconfirmed(result === "unconfirmed" || result === "unavailable");
      setOpening(false);
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: cardStyle, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: headerStyle, title: meta.path === "" ? meta.title : meta.path, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: titleStyle, children: meta.title }),
      meta.path !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: pathStyle, children: meta.path }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          style: openStyle,
          "aria-label": labels.openWindow,
          title: labels.openWindow,
          "aria-busy": opening,
          disabled: opening,
          onClick: open,
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpenIcon, {})
        }
      )
    ] }),
    unconfirmed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { role: "status", style: noticeStyle, children: labels.windowUnconfirmed }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SizedFrame, { meta, callId, prompt, stateKey })
  ] });
}
var THUMB_VIEWPORT_WIDTH = 1280;
var THUMB_VIEWPORT_HEIGHT = 800;
var THUMB_HEIGHT = 220;
var hostBorder = "1px solid var(--dsw-alias-border-l2, rgb(127 127 127 / 25%))";
var launcherStyle = {
  minWidth: 0,
  maxWidth: "100%",
  border: hostBorder,
  borderRadius: 10,
  overflow: "hidden"
};
var thumbStyle = {
  position: "relative",
  height: THUMB_HEIGHT,
  overflow: "hidden",
  cursor: "pointer",
  background: "var(--dsw-alias-bg-base, transparent)",
  borderBottom: hostBorder
};
var launcherBarStyle = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "8px 12px",
  padding: "10px 12px"
};
var launcherTextStyle = { flex: "1 1 220px", minWidth: 0 };
var oneLine = { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };
var launcherTitleStyle = { ...oneLine, fontSize: 14, fontWeight: 500, lineHeight: 1.4 };
var launcherSummaryStyle = { ...oneLine, fontSize: 12, lineHeight: 1.5, opacity: 0.65 };
var actionsStyle = { display: "flex", gap: 8, flexShrink: 0, marginLeft: "auto" };
var buttonBase = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  height: 30,
  padding: "0 12px",
  borderRadius: 8,
  font: "inherit",
  fontSize: 13,
  cursor: "pointer",
  whiteSpace: "nowrap"
};
var primaryButtonStyle = {
  ...buttonBase,
  border: "1px solid transparent",
  background: "var(--dsw-alias-brand-primary-new-colorprimary-new-color, rgb(65 118 230))",
  color: "var(--dsw-alias-label-primary-inverted, rgb(255 255 255))",
  fontWeight: 500
};
var ghostButtonStyle = { ...buttonBase, border: hostBorder, background: "transparent", color: "inherit" };
var noticeStyle = { fontSize: 12, lineHeight: 1.5, padding: "6px 12px", opacity: 0.75 };
function PageThumbnail({ meta, callId, stateKey, onOpen }) {
  const wrapRef = (0, import_react4.useRef)(null);
  const [width, setWidth] = (0, import_react4.useState)(0);
  (0, import_react4.useEffect)(() => {
    const wrap = wrapRef.current;
    if (wrap === null) return;
    const measure = () => setWidth(wrap.clientWidth);
    measure();
    if (typeof ResizeObserver !== "function") return;
    const observer = new ResizeObserver(measure);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);
  const { doc, colorScheme } = useFrameDoc(
    meta,
    `thumb:${callId}`,
    "page",
    false,
    stateKey === void 0 ? void 0 : { key: stateKey, saves: false }
  );
  const scale = width > 0 ? width / THUMB_VIEWPORT_WIDTH : 0.5;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: wrapRef, style: thumbStyle, "aria-hidden": "true", onClick: onOpen, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "iframe",
    {
      sandbox: FRAME_SANDBOX,
      referrerPolicy: "no-referrer",
      title: meta.title,
      srcDoc: doc,
      tabIndex: -1,
      style: {
        display: "block",
        position: "absolute",
        top: 0,
        left: 0,
        width: THUMB_VIEWPORT_WIDTH,
        height: THUMB_VIEWPORT_HEIGHT,
        border: 0,
        transform: `scale(${scale})`,
        transformOrigin: "0 0",
        pointerEvents: "none",
        colorScheme
      }
    },
    colorScheme
  ) });
}
function PageLauncher({ meta, callId, prompt, stateKey, useLocale }) {
  const opens = canOpenWindow() || canOpenPageViaHost();
  const [expanded, setExpanded] = (0, import_react4.useState)(!opens);
  const [windowUnconfirmed, setWindowUnconfirmed] = (0, import_react4.useState)(false);
  const [opening, setOpening] = (0, import_react4.useState)(false);
  const labels = frameLabels(useVisualizeLanguage(useLocale));
  const open = () => {
    if (opening) return;
    setOpening(true);
    settleOpen(openCardPage(meta, callId, stateKey), (result) => {
      const failed = result === "unconfirmed" || result === "unavailable";
      setWindowUnconfirmed(failed);
      setOpening(false);
      if (failed) {
        setExpanded(true);
      }
    });
  };
  const reveal = () => setExpanded(true);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: launcherStyle, "data-visualize-launcher": "", children: [
    expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SizedFrame, { meta, callId, prompt, stateKey }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageThumbnail, { meta, callId, stateKey, onOpen: opens ? open : reveal }),
    windowUnconfirmed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { role: "status", style: noticeStyle, children: labels.windowFallback }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: launcherBarStyle, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: launcherTextStyle, title: meta.path === "" ? meta.title : meta.path, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: launcherTitleStyle, children: meta.title }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: launcherSummaryStyle, children: meta.summary ?? labels.kind })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: actionsStyle, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            style: ghostButtonStyle,
            "aria-expanded": expanded,
            onClick: () => setExpanded((on) => !on),
            children: expanded ? labels.hide : labels.show
          }
        ),
        opens && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            type: "button",
            style: primaryButtonStyle,
            onClick: open,
            "aria-busy": opening,
            disabled: opening,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpenIcon, {}),
              labels.openPage
            ]
          }
        )
      ] })
    ] })
  ] });
}
function VisualizeCard({
  callId,
  block,
  visualizePrompt,
  visualizeSession,
  visualizeTail,
  useLocale
}) {
  const tailOwnsCard = (visualizeTail ?? ((selector) => selector(false)))((value) => value);
  const labels = frameLabels(useVisualizeLanguage(useLocale));
  const argsRaw = "kind" in block ? block.call?.argsRaw : "argsRaw" in block ? block.argsRaw : void 0;
  if (!("kind" in block)) {
    if (tailOwnsCard) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: headerStyle, children: labels.rendering });
    const live = visualizeMetaFromArgs(argsRaw);
    if (live !== void 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Frame, { meta: { ...live, style: liveStyle() }, callId, useLocale });
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: headerStyle, children: labels.rendering });
  }
  if (block.isError) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: headerStyle, children: [
      labels.failed,
      " \xB7 ",
      firstResultLine(block.content)
    ] });
  }
  const persisted = visualizeMetaFrom(block.meta);
  if (persisted !== void 0) noteSettledStyle(persisted.style, argsRaw);
  const fromArgs = persisted === void 0 ? visualizeMetaFromArgs(argsRaw) : void 0;
  const meta = persisted ?? (fromArgs === void 0 ? void 0 : { ...fromArgs, style: liveStyle() });
  if (meta === void 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: headerStyle, children: firstResultLine(block.content) });
  }
  if (tailOwnsCard && persisted !== void 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { ...headerStyle, cursor: "default" }, "data-visualize-receipt": "", title: meta.title, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: titleStyle, children: meta.title }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: labels.settled })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    Frame,
    {
      meta,
      callId,
      prompt: visualizePrompt,
      stateKey: cardStateKey(visualizeSession, meta.path, callId),
      useLocale
    }
  );
}
function sessionInjection(prompt, sessionId) {
  return {
    visualizePrompt: prompt,
    visualizeSession: typeof sessionId === "string" && sessionId !== "" ? sessionId : void 0
  };
}

// src/client/StreamingPreview.tsx
var import_react5 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
var STREAM_KEY = "dsh-visualize-stream";
var isIndex = (value) => Number.isSafeInteger(value) && value >= 0;
var isRecord = (value) => typeof value === "object" && value !== null;
var idOf = (value) => typeof value === "string" || typeof value === "number" ? String(value) : "";
function callChunk(chunk, step) {
  if (!isRecord(chunk) || !isIndex(chunk.index)) return void 0;
  if (chunk.type === "tool-call-delta") {
    return {
      step,
      index: chunk.index,
      id: idOf(chunk.id),
      name: typeof chunk.name === "string" ? chunk.name : void 0,
      text: typeof chunk.argumentsDelta === "string" ? chunk.argumentsDelta : "",
      final: false
    };
  }
  const block = chunk.block;
  if (chunk.type !== "block-end" || !isRecord(block) || block.type !== "tool-call") return void 0;
  if (typeof block.arguments !== "string") return void 0;
  return {
    step,
    index: chunk.index,
    id: idOf(block.id),
    name: typeof block.name === "string" ? block.name : void 0,
    text: block.arguments,
    final: true
  };
}
function streamInput(event) {
  const data = event.data;
  if (!isRecord(data) || !isIndex(data.turn)) return void 0;
  const turn = data.turn;
  if (event.type === "turn/start") return { kind: "turn", turn };
  if (event.type === "tool/call") return { kind: "call", turn, callId: idOf(data.callId) };
  if (event.type !== "assistant/live-chunk" || !isIndex(data.step)) return void 0;
  const chunk = callChunk(data.chunk, data.step);
  return chunk === void 0 ? void 0 : { kind: "chunk", turn, chunk };
}
function foldChunk(calls, chunk) {
  const slot = `${chunk.step}:${chunk.index}`;
  const at = calls.findIndex((call) => call.slot === slot);
  const previous = at === -1 ? void 0 : calls[at];
  const next = {
    slot,
    callId: previous?.callId || chunk.id,
    name: chunk.name ?? previous?.name ?? "",
    argsRaw: chunk.final ? chunk.text : (previous?.argsRaw ?? "") + chunk.text
  };
  return at === -1 ? [...calls, next] : calls.map((call, index) => index === at ? next : call);
}
function reduceStream(state, event) {
  const input = streamInput(event);
  if (input?.kind === "chunk") return { ...state, calls: foldChunk(state.calls, input.chunk) };
  if (input?.kind !== "call") return state;
  const calls = state.calls.filter((call) => call.callId !== input.callId);
  return calls.length === state.calls.length ? state : { ...state, calls };
}
var streamDefinition = {
  kind: STREAM_KEY,
  match: (event) => {
    const input = streamInput(event);
    return input === void 0 ? null : { id: String(input.turn), role: "start" };
  },
  start: (_context, match) => {
    const input = streamInput(match.event);
    return reduceStream({ turn: input?.turn ?? 0, calls: [] }, match.event);
  },
  update: (context, match) => reduceStream(context.state, match.event),
  publication: (match) => match.event.type === "assistant/live-chunk" ? "animation-frame" : "immediate",
  buildLocationData: (context, scope, previous) => {
    if (scope !== "turn" || context.state === void 0) return null;
    const { turn, calls } = context.state;
    let call;
    for (const candidate of calls) if (candidate.name === VISUALIZE_TOOL_NAME) call = candidate;
    if (call === void 0) return null;
    if (previous?.kind === "turn" && previous.turn === turn && previous.key === STREAM_KEY && previous.value.callId === call.callId && previous.value.argsRaw === call.argsRaw) return previous;
    return {
      kind: "turn",
      turn,
      key: STREAM_KEY,
      value: { callId: call.callId, argsRaw: call.argsRaw }
    };
  }
};
var FLUSH_MS = 150;
var PREVIEW_MAX_HEIGHT = 300;
var wrapStyle = { margin: "6px auto 2px", maxWidth: 760, width: "100%" };
var labelStyle = {
  fontSize: 12,
  opacity: 0.65,
  margin: "0 0 4px"
};
var frameStyle2 = {
  display: "block",
  width: "100%",
  border: 0,
  background: "transparent",
  transition: "height 240ms ease"
};
function useThrottled(value) {
  const [shown, setShown] = (0, import_react5.useState)(value);
  const lastFlush = (0, import_react5.useRef)(0);
  (0, import_react5.useEffect)(() => {
    const elapsed = Date.now() - lastFlush.current;
    if (elapsed >= FLUSH_MS) {
      lastFlush.current = Date.now();
      setShown(value);
      return;
    }
    const timer = setTimeout(() => {
      lastFlush.current = Date.now();
      setShown(value);
    }, FLUSH_MS - elapsed);
    return () => clearTimeout(timer);
  }, [value]);
  return shown;
}
function Preview({ argsRaw }) {
  const throttled = useThrottled(argsRaw);
  const fragment = extractStreamingFragment(throttled);
  const preview = fragment === void 0 ? "" : trimStreamingScripts(fragment);
  const hasContent = preview.trim().length > 0;
  const frameRef = (0, import_react5.useRef)(null);
  const [loaded, setLoaded] = (0, import_react5.useState)(false);
  const [contentHeight, setContentHeight] = (0, import_react5.useState)(0);
  (0, import_react5.useEffect)(() => {
    const onMessage = (event) => {
      const report = event.data;
      if (report?.type !== HEIGHT_MESSAGE_TYPE || report.token !== "streaming-preview") return;
      if (typeof report.height !== "number" || !Number.isFinite(report.height)) return;
      setContentHeight(Math.max(0, Math.ceil(report.height)));
    };
    addEventListener("message", onMessage);
    return () => removeEventListener("message", onMessage);
  }, []);
  const { doc, colorScheme } = (0, import_react5.useMemo)(() => {
    const theme = resolveTheme();
    return {
      doc: buildStreamShellDoc({ ...theme, reportToken: "streaming-preview", style: liveStyle() }),
      colorScheme: theme.colorScheme
    };
  }, []);
  (0, import_react5.useEffect)(() => {
    if (!loaded || !hasContent) return;
    frameRef.current?.contentWindow?.postMessage({
      type: STREAM_MESSAGE_TYPE,
      token: "streaming-preview",
      fragment: preview
    }, "*");
  }, [loaded, hasContent, preview]);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: wrapStyle, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: labelStyle, children: hasContent ? "Visualize \xB7 streaming preview" : "Visualize \xB7 composing\u2026" }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "iframe",
      {
        ref: frameRef,
        sandbox: "allow-scripts",
        referrerPolicy: "no-referrer",
        title: "Visualization streaming preview",
        srcDoc: doc,
        style: { ...frameStyle2, colorScheme, height: hasContent ? Math.min(contentHeight, PREVIEW_MAX_HEIGHT) : 0 },
        onLoad: () => setLoaded(true)
      }
    )
  ] });
}
var NO_SOURCE = { getSnapshot: () => void 0, subscribe: () => () => void 0 };
function latestStreamSource(timeline) {
  const turn = timeline?.turnOrder.at(-1);
  const location = turn === void 0 ? void 0 : timeline?.turns.get(turn);
  return typeof location?.data?.source === "function" ? location.data.source(STREAM_KEY) : void 0;
}
function TurnStream({ useChat }) {
  const source = useChat((snapshot) => latestStreamSource(snapshot?.timeline)) ?? NO_SOURCE;
  const stream = (0, import_react5.useSyncExternalStore)(source.subscribe, source.getSnapshot);
  if (stream === void 0) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Preview, { argsRaw: stream.argsRaw }, stream.callId);
}
function StreamingPreview({ session, useChat }) {
  if (typeof useChat === "function") return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(TurnStream, { useChat });
  const blocks = session?.partial?.blocks;
  if (blocks === void 0) return null;
  let argsRaw;
  for (const block of blocks) {
    if (block.kind === "tool-call" && block.name === VISUALIZE_TOOL_NAME) argsRaw = block.argsRaw;
  }
  if (argsRaw === void 0) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Preview, { argsRaw });
}

// src/client/folding.ts
function createVisualizeTailSource() {
  let registered = false;
  const listeners = /* @__PURE__ */ new Set();
  return {
    getSnapshot: () => registered,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setRegistered: (next) => {
      if (next === registered) return;
      registered = next;
      for (const listener of listeners) listener();
    }
  };
}

// src/client/TurnCards.tsx
var import_react6 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
var TURN_CARDS_KEY = "dsh-visualize";
var EMPTY_CARDS = [];
var EMPTY_TURN_CARDS = { byTurn: /* @__PURE__ */ new Map() };
var isRecord2 = (value) => typeof value === "object" && value !== null;
var isTurn = (value) => Number.isSafeInteger(value) && value >= 0;
var idOf2 = (value) => typeof value === "string" && value.length > 0 ? value : typeof value === "number" && Number.isSafeInteger(value) ? String(value) : void 0;
function dataOf(event) {
  return isRecord2(event.data) ? event.data : void 0;
}
function rootCallId(event) {
  const data = dataOf(event);
  if (data === void 0) return void 0;
  if (event.type === "tool/call") return idOf2(data.callId);
  if (String(event.type) === "tool/ptc-dispatch") return idOf2(data.parentCallId);
  if (event.type !== "tool/result" || !isRecord2(data.message) || !isRecord2(data.message.source)) return void 0;
  return idOf2(data.message.source.callId);
}
function cardFromEvent(event) {
  const data = dataOf(event);
  if (data === void 0) return void 0;
  let callId;
  if (String(event.type) === "tool/ptc-dispatch") {
    if (data.isError === true) return void 0;
    callId = idOf2(data.subCallId);
  } else if (event.type === "tool/result") {
    if (!isRecord2(data.message) || data.message.isError === true) return void 0;
    callId = rootCallId(event);
  } else return void 0;
  if (callId === void 0) return void 0;
  const meta = visualizeMetaFrom(data.meta);
  return meta === void 0 ? void 0 : { callId, seq: event.seq, meta };
}
function contextTurn(matches) {
  for (const type of ["tool/call", "tool/result"]) {
    for (const match of matches) {
      const data = dataOf(match.event);
      if (String(match.event.type) === type && isTurn(data?.turn)) return data.turn;
    }
  }
  for (const match of matches) {
    const data = dataOf(match.event);
    if (isTurn(data?.turn)) return data.turn;
    const meta = cardFromEvent(match.event)?.meta;
    if (isTurn(meta?.turn)) return meta.turn;
  }
  for (const match of matches) {
    if (match.location.kind === "turn" || match.location.kind === "step") return match.location.turn.turn;
  }
  return void 0;
}
function sameMeta(left, right) {
  return left === right || left.path === right.path && left.fragment === right.fragment && left.title === right.title && left.mode === right.mode && left.style === right.style && left.summary === right.summary;
}
function sameCard(left, right) {
  return left === right || left.callId === right.callId && left.seq === right.seq && sameMeta(left.meta, right.meta);
}
function recordCard(cards, card) {
  const index = cards.findIndex((existing2) => existing2.callId === card.callId);
  if (index === -1) return [...cards, card];
  const existing = cards[index];
  if (card.seq < existing.seq || sameCard(existing, card)) return cards;
  return cards.map((value, at) => at === index ? card : value);
}
function foldCard(cards, card) {
  const index = cards.findIndex((existing2) => existing2.callId === card.callId || existing2.meta.path === card.meta.path);
  if (index === -1) return [...cards, card];
  const existing = cards[index];
  if (card.seq < existing.seq || sameCard(existing, card)) return cards;
  return cards.map((value, at) => at === index ? card : value);
}
function reduceCard(context, match) {
  const turn = contextTurn(context.matches);
  const previous = context.state;
  const card = cardFromEvent(match.event);
  const cards = card === void 0 ? previous?.cards ?? EMPTY_CARDS : recordCard(previous?.cards ?? EMPTY_CARDS, card);
  return previous !== void 0 && previous.turn === turn && previous.cards === cards ? previous : { turn, cards };
}
var turnCardsDefinition = {
  kind: TURN_CARDS_KEY,
  target: TURN_CARDS_KEY,
  match: (event) => {
    if (event.type !== "tool/call" && event.type !== "tool/result" && event.type !== "tool/ptc-dispatch") return null;
    if (String(event.type) === "tool/ptc-dispatch" && cardFromEvent(event) === void 0) return null;
    const callId = rootCallId(event);
    return callId === void 0 ? null : { id: callId, role: "start" };
  },
  start: reduceCard,
  update: reduceCard,
  buildViewNode: (context) => context.state === void 0 ? null : {
    key: context.key,
    kind: TURN_CARDS_KEY,
    id: context.id,
    target: TURN_CARDS_KEY,
    data: context.state
  }
};
function sameCards(left, right) {
  return left !== void 0 && left.length === right.length && left.every((card, index) => sameCard(card, right[index]));
}
function createTurnCardsBuilder() {
  const nodes = /* @__PURE__ */ new Map();
  let snapshot = EMPTY_TURN_CARDS;
  const materialize = () => {
    const grouped = /* @__PURE__ */ new Map();
    for (const node of nodes.values()) {
      if (!isTurn(node.data.turn) || node.data.cards.length === 0) continue;
      const cards = grouped.get(node.data.turn) ?? [];
      cards.push(...node.data.cards);
      grouped.set(node.data.turn, cards);
    }
    const byTurn = /* @__PURE__ */ new Map();
    for (const [turn, cards] of grouped) {
      cards.sort((left, right) => left.seq - right.seq || left.callId.localeCompare(right.callId));
      const previous = snapshot.byTurn.get(turn);
      byTurn.set(turn, sameCards(previous, cards) ? previous : cards);
    }
    if (byTurn.size === snapshot.byTurn.size && [...byTurn].every(([turn, cards]) => snapshot.byTurn.get(turn) === cards)) return snapshot;
    snapshot = { byTurn };
    return snapshot;
  };
  return {
    empty: EMPTY_TURN_CARDS,
    replace: ({ nodes: next }) => {
      nodes.clear();
      for (const node of next) if (node.data.cards.length > 0) nodes.set(node.key, node);
      return materialize();
    },
    apply: ({ upserts }) => {
      let changed = false;
      for (const node of upserts) {
        const previous = nodes.get(node.key);
        if (node.data.cards.length === 0) {
          changed = nodes.delete(node.key) || changed;
          continue;
        }
        if (previous !== void 0 && previous.data.turn === node.data.turn && previous.data.cards === node.data.cards) continue;
        nodes.set(node.key, node);
        changed = true;
      }
      return changed ? materialize() : snapshot;
    }
  };
}
var turnCardsViewDefinition = {
  target: TURN_CARDS_KEY,
  create: createTurnCardsBuilder
};
function cardsBefore(turn, seq, snapshot) {
  if (turn === void 0) return EMPTY_CARDS;
  const cards = snapshot === void 0 ? turn.data?.get(TURN_CARDS_KEY)?.cards ?? EMPTY_CARDS : snapshot.byTurn.get(turn.turn) ?? EMPTY_CARDS;
  let visible = EMPTY_CARDS;
  for (const card of cards) if (card.seq < seq) visible = foldCard(visible, card);
  return visible;
}
function cardsForTurn(turn, snapshot) {
  return cardsBefore(turn, Infinity, snapshot);
}
var listStyle = { display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 12, margin: "8px 0 4px", minWidth: 0 };
var disclosureStyle = { minWidth: 0, border: "1px solid var(--border, #8884)", borderRadius: 8, padding: "8px 10px" };
function CardGroup({ card, primary, useLocale, prompt, stateKey }) {
  const [open, setOpen] = (0, import_react6.useState)(primary);
  const [visited, setVisited] = (0, import_react6.useState)(primary);
  const lang = useVisualizeLanguage(useLocale);
  (0, import_react6.useEffect)(() => {
    if (primary) {
      setOpen(true);
      setVisited(true);
    }
  }, [primary]);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("details", { style: primary ? { minWidth: 0 } : disclosureStyle, open: primary || open, onToggle: (event) => {
    const expanded = event.currentTarget.open;
    if (!primary) setOpen(expanded);
    if (expanded) setVisited(true);
  }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("summary", { style: primary ? { display: "none" } : { cursor: "pointer", fontSize: 12 }, children: card.meta.title || (lang === "en" ? "Visualization" : "\u53EF\u89C6\u5316") }),
    (primary || visited) && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: primary ? void 0 : { paddingTop: 8 }, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Frame, { meta: card.meta, callId: "turn-tail:" + card.callId, useLocale, prompt, stateKey }) })
  ] });
}
function TurnCards({
  turn,
  useVisualizeCards,
  useLocale,
  visualizePrompt,
  visualizeSession
}) {
  const snapshot = useVisualizeCards((value) => value ?? EMPTY_TURN_CARDS);
  const cards = (0, import_react6.useMemo)(() => cardsForTurn(turn, snapshot), [turn, snapshot]);
  if (cards.length === 0) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: listStyle, "data-visualize-tail": "true", children: cards.map((card, index) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    CardGroup,
    {
      card,
      primary: index === 0,
      useLocale,
      prompt: visualizePrompt,
      stateKey: cardStateKey(visualizeSession, card.meta.path, card.callId)
    },
    card.meta.path
  )) });
}

// src/client/VisualizeSection.tsx
var import_react7 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
var SECTION_CSS = `
.dshviz-option { position: relative; display: flex; flex-direction: column; min-width: 0; border: 1px solid rgba(128, 128, 128, 0.28); border-radius: 10px; overflow: hidden; cursor: pointer; transition: border-color 120ms ease, box-shadow 120ms ease; }
.dshviz-option:hover { border-color: rgba(128, 128, 128, 0.5); }
.dshviz-option[data-selected='true'] { border-color: #2f6fed; box-shadow: 0 0 0 1px #2f6fed; }
.dshviz-option:has(input:focus-visible) { outline: 2px solid #2f6fed; outline-offset: 2px; }
.dshviz-option[data-disabled='true'] { cursor: default; opacity: 0.6; }
.dshviz-radio { position: absolute; opacity: 0; width: 1px; height: 1px; margin: 0; pointer-events: none; }
.dshviz-textarea:focus-visible, .dshviz-select:focus-visible, .dshviz-button:focus-visible { outline: 2px solid #2f6fed; outline-offset: 1px; }
@media (prefers-reduced-motion: reduce) { .dshviz-option { transition: none; } }
`;
function useSectionCss() {
  (0, import_react7.useEffect)(() => {
    const id = "@nagi-ovo/dsh-visualize/settings.css";
    if (document.querySelector(`style[data-plugin-css="${id}"]`) !== null) return;
    const tag = document.createElement("style");
    tag.dataset.plugin = "@nagi-ovo/dsh-visualize";
    tag.dataset.pluginCss = id;
    tag.textContent = SECTION_CSS;
    document.head.append(tag);
  }, []);
}
var divider = "1px solid rgba(128, 128, 128, 0.22)";
var headingStyle = { fontSize: 15, lineHeight: 1.4, fontWeight: 500 };
var blurbStyle = { fontSize: 13, lineHeight: 1.5, opacity: 0.55, marginTop: 2 };
var gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  gap: 12,
  marginTop: 12
};
var PREVIEW_HEIGHT = 124;
var previewStyle = {
  display: "block",
  width: "100%",
  height: PREVIEW_HEIGHT,
  border: 0,
  background: "transparent",
  pointerEvents: "none"
};
var optionTextStyle = { padding: "8px 10px 10px", borderTop: divider };
var optionNameStyle = { display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 500 };
var tagStyle = {
  fontSize: 11,
  lineHeight: "16px",
  padding: "0 6px",
  borderRadius: 999,
  background: "rgba(128, 128, 128, 0.16)",
  fontWeight: 400
};
var noticeStyle2 = {
  marginTop: 12,
  padding: "10px 12px",
  borderRadius: 8,
  background: "rgba(128, 128, 128, 0.12)",
  fontSize: 13,
  lineHeight: 1.6
};
var codeStyle = {
  margin: "6px 0 0",
  padding: "8px 10px",
  borderRadius: 6,
  background: "rgba(128, 128, 128, 0.12)",
  fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
  fontSize: 12,
  lineHeight: 1.6,
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere"
};
var statusStyle = { fontSize: 13, lineHeight: 1.5, marginTop: 8, minHeight: 20 };
var buttonBase2 = {
  padding: "7px 14px",
  borderRadius: 8,
  fontSize: 13,
  fontFamily: "inherit",
  cursor: "pointer"
};
var primaryButtonStyle2 = { ...buttonBase2, border: "1px solid #2f6fed", background: "#2f6fed", color: "#fff" };
var quietButtonStyle = {
  ...buttonBase2,
  padding: "3px 10px",
  border: "1px solid rgba(128, 128, 128, 0.35)",
  background: "transparent",
  color: "inherit"
};
var textareaStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  minHeight: 120,
  marginTop: 8,
  padding: "8px 10px",
  border: "1px solid rgba(128, 128, 128, 0.35)",
  borderRadius: 8,
  background: "transparent",
  color: "inherit",
  fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
  fontSize: 13,
  lineHeight: 1.5,
  resize: "vertical"
};
var selectStyle = {
  minHeight: 30,
  maxWidth: "100%",
  padding: "0 8px",
  border: "1px solid rgba(128, 128, 128, 0.35)",
  borderRadius: 8,
  background: "transparent",
  color: "inherit",
  font: "inherit",
  fontSize: 13
};
var pathStyle2 = {
  fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
  fontSize: 12,
  opacity: 0.6,
  overflowWrap: "anywhere"
};
function previewFragment(t) {
  const escape = (text) => text.replace(/[&<>"]/gu, (char) => `&#${char.charCodeAt(0)};`);
  const line = "fill:none;stroke-linejoin:round;stroke-linecap:round;vector-effect:non-scaling-stroke";
  return `<div class="card" style="padding:10px 12px">
<div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
<h3 style="margin:0;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escape(t("previewTitle"))}</h3>
<span class="viz-badge">+18%</span>
</div>
<div class="text-small" style="margin:2px 0 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escape(t("previewNote"))}</div>
<svg viewBox="0 0 220 54" width="100%" height="54" preserveAspectRatio="none" aria-hidden="true">
<line x1="0" y1="18" x2="220" y2="18" style="stroke:var(--viz-grid);stroke-width:1;stroke-dasharray:var(--viz-grid-dash);vector-effect:non-scaling-stroke"/>
<line x1="0" y1="36" x2="220" y2="36" style="stroke:var(--viz-grid);stroke-width:1;stroke-dasharray:var(--viz-grid-dash);vector-effect:non-scaling-stroke"/>
<line x1="0" y1="53" x2="220" y2="53" style="stroke:var(--viz-axis);stroke-width:1;vector-effect:non-scaling-stroke"/>
<polyline points="0,47 31,45 63,46 94,42 126,43 157,40 189,41 220,37" style="${line};stroke:var(--viz-series-2);stroke-width:var(--viz-line-width)"/>
<polyline points="0,42 31,38 63,40 94,31 126,28 157,22 189,17 220,8" style="${line};stroke:var(--viz-series-1);stroke-width:var(--viz-line-width)"/>
</svg>
</div>`;
}
function StylePreview({ id, t }) {
  const themeTick = useThemeTick();
  const { doc, colorScheme } = (0, import_react7.useMemo)(() => {
    const { themeVars, colorScheme: colorScheme2 } = resolveTheme();
    const doc2 = buildFrameDoc({
      fragment: previewFragment(t),
      title: styleName(t, id),
      themeVars,
      colorScheme: colorScheme2,
      reportToken: `settings-preview:${id}`,
      style: id
    });
    return { doc: doc2, colorScheme: colorScheme2 };
  }, [id, t, themeTick]);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "iframe",
    {
      sandbox: FRAME_SANDBOX,
      referrerPolicy: "no-referrer",
      title: styleName(t, id),
      srcDoc: doc,
      tabIndex: -1,
      "aria-hidden": "true",
      scrolling: "no",
      style: { ...previewStyle, colorScheme }
    },
    colorScheme
  );
}
function pageStyle() {
  const config = globalThis[PAGE_CONFIG_GLOBAL];
  return typeof config?.style === "string" ? styleIdFrom(config.style) : void 0;
}
function setPageStyle(style) {
  const globals = globalThis;
  const previous = globals[PAGE_CONFIG_GLOBAL];
  globals[PAGE_CONFIG_GLOBAL] = { ...typeof previous === "object" && previous !== null ? previous : {}, style };
}
var UNAVAILABLE = { status: "unavailable", value: void 0, user: void 0, writable: false };
function useFormSnapshot(form) {
  return (0, import_react7.useSyncExternalStore)(
    form?.subscribe.bind(form) ?? noSubscribe,
    form === void 0 ? () => UNAVAILABLE : () => form.getSnapshot()
  );
}
function noSubscribe() {
  return () => {
  };
}
function userSetsStyle(user) {
  return typeof user === "object" && user !== null && Object.hasOwn(user, "style");
}
function StylePicker({ form, t }) {
  const snapshot = useFormSnapshot(form);
  const headingId = (0, import_react7.useId)();
  const name2 = (0, import_react7.useId)();
  const [pending, setPending] = (0, import_react7.useState)(void 0);
  const [notice, setNotice] = (0, import_react7.useState)(void 0);
  const accepted = snapshot.status === "ready" ? styleIdFrom(snapshot.value?.style) : void 0;
  (0, import_react7.useEffect)(() => {
    if (accepted !== void 0 && accepted !== pageStyle()) setPageStyle(accepted);
  }, [accepted]);
  const unavailable = form === void 0 || snapshot.status === "unavailable";
  const selected = pending ?? accepted ?? pageStyle() ?? DEFAULT_STYLE;
  const disabled = unavailable || snapshot.status !== "ready" || !snapshot.writable;
  const run = async (write, chosen) => {
    setPending(chosen ?? DEFAULT_STYLE);
    setNotice(void 0);
    try {
      const ok = await write();
      const held = chosen ?? styleIdFrom(form?.getSnapshot().value?.style);
      if (ok) setPageStyle(held);
      setNotice(ok ? { ok, text: t("saved", { style: styleName(t, held) }) } : { ok, text: t("saveFailed") });
    } catch {
      setNotice({ ok: false, text: t("saveFailed") });
    } finally {
      setPending(void 0);
    }
  };
  const choose = (id) => {
    if (form === void 0 || disabled || id === selected) return;
    void run(() => form.set("style", id), id);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { "aria-labelledby": headingId, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { id: headingId, style: headingStyle, children: t("styleHeading") }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: blurbStyle, children: t("styleIntro") }),
    unavailable && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: noticeStyle2, role: "note", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { fontWeight: 500 }, children: t("unavailableTitle") }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { children: t("unavailableBody", { path: "<DSH_HOME>/profiles/web/cordis.patch.yml" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("pre", { style: codeStyle, children: `- id: dsh-visualize
  name: "@nagi-ovo/dsh-visualize"
  config:
    style: ${selected}` })
    ] }),
    !unavailable && snapshot.status === "ready" && !snapshot.writable && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: noticeStyle2, role: "note", children: t("readOnly") }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { role: "radiogroup", "aria-labelledby": headingId, style: gridStyle, children: STYLE_IDS.map((id) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
      "label",
      {
        className: "dshviz-option",
        "data-style": id,
        "data-selected": id === selected,
        "data-disabled": disabled,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            "input",
            {
              className: "dshviz-radio",
              type: "radio",
              name: name2,
              value: id,
              checked: id === selected,
              disabled,
              onChange: () => choose(id)
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StylePreview, { id, t }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: optionTextStyle, children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: optionNameStyle, children: [
              styleName(t, id),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: { ...pathStyle2, opacity: 0.5, fontSize: 11 }, children: id }),
              id === DEFAULT_STYLE && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: tagStyle, children: t("defaultTag") })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { ...blurbStyle, marginTop: 0 }, children: t(`style.${id}.desc`) })
          ] })
        ]
      },
      id
    )) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { ...statusStyle, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { role: "status", style: { color: notice !== void 0 && !notice.ok ? "#c2382c" : "inherit", opacity: notice?.ok === false ? 1 : 0.7 }, children: pending !== void 0 ? t("saving") : notice?.text ?? "" }),
      form !== void 0 && !disabled && userSetsStyle(snapshot.user) && pending === void 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: { ...blurbStyle, marginTop: 0 }, children: t("overridden") }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "button",
          {
            type: "button",
            className: "dshviz-button",
            style: quietButtonStyle,
            onClick: () => void run(() => form.unset("style"), void 0),
            children: t("reset")
          }
        )
      ] })
    ] })
  ] });
}
function FileEditor({ file, max: max2, t, files, onSaved }) {
  const [draft, setDraft] = (0, import_react7.useState)(file.text);
  const [saving, setSaving] = (0, import_react7.useState)(false);
  const [notice, setNotice] = (0, import_react7.useState)(void 0);
  const textareaId = (0, import_react7.useId)();
  (0, import_react7.useEffect)(() => setDraft(file.text), [file.path, file.text]);
  const bytes = new TextEncoder().encode(draft).byteLength;
  const over = bytes - max2;
  const blocked = file.blocked !== void 0;
  const save = async () => {
    setSaving(true);
    setNotice(void 0);
    try {
      const result = await files.save({
        scope: file.scope,
        ...file.workspaceId === void 0 ? {} : { workspaceId: file.workspaceId },
        text: draft
      });
      if (result.ok) {
        onSaved(result.file);
        setNotice({ ok: true, text: result.file.exists ? t("fileSaved") : t("fileRemoved") });
      } else {
        setNotice({ ok: false, text: t("fileSaveFailed", { reason: result.reason }) });
      }
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 4 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("label", { htmlFor: textareaId, style: pathStyle2, children: file.path }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: tagStyle, children: file.exists ? t("fileExists") : t("fileMissing") })
    ] }),
    blocked && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: noticeStyle2, role: "note", children: t("fileBlocked") }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "textarea",
      {
        id: textareaId,
        className: "dshviz-textarea",
        style: textareaStyle,
        value: draft,
        readOnly: blocked,
        spellCheck: false,
        placeholder: t("placeholder"),
        "aria-invalid": over > 0 || void 0,
        onChange: (event) => setDraft(event.target.value)
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 8, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: { fontSize: 12, color: over > 0 ? "#c2382c" : "inherit", opacity: over > 0 ? 1 : 0.55 }, children: over > 0 ? t("tooLarge", { max: max2, over }) : t("bytes", { bytes, max: max2 }) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "button",
        {
          type: "button",
          className: "dshviz-button",
          style: { ...primaryButtonStyle2, opacity: blocked || saving || over > 0 || draft === file.text ? 0.5 : 1 },
          disabled: blocked || saving || over > 0 || draft === file.text,
          onClick: () => void save(),
          children: saving ? t("saving") : t("saveFile")
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { role: "status", style: { ...statusStyle, color: notice !== void 0 && !notice.ok ? "#c2382c" : "inherit", opacity: notice?.ok === false ? 1 : 0.7 }, children: notice?.text ?? "" })
  ] });
}
function StyleFiles({ files, t }) {
  const [view, setView] = (0, import_react7.useState)(void 0);
  const [workspaceId, setWorkspaceId] = (0, import_react7.useState)(void 0);
  const headingId = (0, import_react7.useId)();
  const selectId = (0, import_react7.useId)();
  (0, import_react7.useEffect)(() => {
    let live = true;
    files.load().then(
      (loaded) => {
        if (live) setView(loaded ?? null);
      },
      () => {
        if (live) setView(null);
      }
    );
    return () => {
      live = false;
    };
  }, [files]);
  const replace = (next) => setView((current) => current === null || current === void 0 ? current : { ...current, files: current.files.map((file) => file.path === next.path ? next : file) });
  const max2 = view?.maxBytes ?? 4096;
  const global = view?.files.find((file) => file.scope === "global");
  const workspaces = view?.files.filter((file) => file.scope === "workspace") ?? [];
  const workspace = workspaces.find((file) => file.workspaceId === workspaceId) ?? workspaces[0];
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { "aria-labelledby": headingId, style: { marginTop: 18, paddingTop: 18, borderTop: divider }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { id: headingId, style: headingStyle, children: t("filesHeading") }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: blurbStyle, children: t("filesIntro", { max: max2 }) }),
    view === void 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { ...blurbStyle, marginTop: 12 }, children: t("filesLoading") }),
    view === null && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: noticeStyle2, role: "note", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { children: t("filesUnavailable") }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("pre", { style: codeStyle, children: "<DSH_HOME>/visualize/style.md\n<workspace>/.dsh/visualize-style.md" })
    ] }),
    global !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { marginTop: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { fontSize: 14, fontWeight: 500 }, children: t("globalFile") }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(FileEditor, { file: global, max: max2, t, files, onSaved: replace })
    ] }),
    workspace !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { marginTop: 14, paddingTop: 14, borderTop: divider }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("label", { htmlFor: selectId, style: { fontSize: 14, fontWeight: 500 }, children: t("workspaceFile") }),
        workspaces.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "select",
          {
            id: selectId,
            className: "dshviz-select",
            style: selectStyle,
            value: workspace.workspaceId,
            onChange: (event) => setWorkspaceId(event.target.value),
            children: workspaces.map((file) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("option", { value: file.workspaceId, children: file.title ?? file.path }, file.workspaceId))
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { id: selectId, style: { fontSize: 13, opacity: 0.7 }, children: workspace.title ?? "" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(FileEditor, { file: workspace, max: max2, t, files, onSaved: replace }, workspace.path)
    ] })
  ] });
}
function VisualizeSection({ lang, form, files }) {
  useSectionCss();
  const t = (0, import_react7.useMemo)(() => translator(lang), [lang]);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", flexDirection: "column" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StylePicker, { form, t }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StyleFiles, { files, t })
  ] });
}

// src/client/settings.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
var ENTRY_ID = "dsh-visualize";
var SECTION_ID = "dsh-visualize";
function lookup(ctx, name2) {
  try {
    return ctx.get(name2);
  } catch {
    return void 0;
  }
}
function localeOf(ctx) {
  const locale = lookup(ctx, "locale");
  return typeof locale?.getSnapshot === "function" && typeof locale.subscribe === "function" ? locale : void 0;
}
function styleFormOf(ctx) {
  const forms = lookup(ctx, "configForms");
  if (typeof forms?.get !== "function") return void 0;
  const form = forms.get(ENTRY_ID);
  return typeof form?.getSnapshot === "function" && typeof form.subscribe === "function" && typeof form.set === "function" ? form : void 0;
}
function styleFilesClient(fetchImpl2 = fetch, base = () => document.baseURI) {
  const url = () => new URL(STYLE_FILES_PATH.slice(1), base()).href;
  return {
    async load() {
      const response = await fetchImpl2(url(), { credentials: "same-origin", headers: { accept: "application/json" } });
      if (!response.ok || !(response.headers.get("content-type") ?? "").includes("json")) return void 0;
      const view = await response.json();
      return Array.isArray(view.files) && typeof view.maxBytes === "number" ? view : void 0;
    },
    async save(request) {
      try {
        const response = await fetchImpl2(url(), {
          method: "POST",
          credentials: "same-origin",
          headers: { "content-type": "application/json", accept: "application/json" },
          body: JSON.stringify(request)
        });
        const body = await response.json().catch(() => ({}));
        if (response.ok) return { ok: true, file: body };
        const reason = typeof body.message === "string" ? body.message : typeof body.error === "string" ? body.error : `HTTP ${response.status}`;
        return { ok: false, reason };
      } catch (error) {
        return { ok: false, reason: error instanceof Error ? error.message : String(error) };
      }
    }
  };
}
function VisualizeSectionEntry({ useLocale, form, files }) {
  const lang = useLocale === void 0 ? documentLang() : useLocale((snapshot) => settingsLang(snapshot.active));
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(VisualizeSection, { lang, form, files });
}
function registerSettingsSection(ctx) {
  const slots = ctx.slots;
  const files = styleFilesClient();
  slots.inject("settings.section", () => {
    const locale = localeOf(ctx);
    const lang = () => locale === void 0 ? documentLang() : settingsLang(locale.getSnapshot().active);
    return slots.register(
      {
        name: "settings.section",
        id: SECTION_ID,
        order: 95,
        label: () => lang() === "en" ? "Visualize" : "\u53EF\u89C6\u5316",
        inject: () => ({
          ...locale === void 0 ? {} : { hooks: { locale } },
          form: styleFormOf(ctx),
          files
        })
      },
      VisualizeSectionEntry
    );
  });
}

// src/client/index.tsx
var name = "dsh-visualize";
var inject = ["slots"];
function lookup2(host, name2) {
  try {
    return host.get(name2);
  } catch {
    return void 0;
  }
}
function conversationEvents(host) {
  const service = lookup2(host, "uiConversation");
  return typeof service?.events?.register === "function" ? service.events : void 0;
}
function conversationRuntime(host) {
  const service = lookup2(host, "uiConversation");
  return typeof service?.events?.register === "function" && typeof service.views?.register === "function" && typeof service.binding === "function" ? service : void 0;
}
function localeOf2(host) {
  const locale = lookup2(host, "locale");
  return typeof locale?.getSnapshot === "function" && typeof locale.subscribe === "function" ? locale : void 0;
}
function turnCardsSource(host, sessionId) {
  try {
    const source = conversationRuntime(host)?.binding(sessionId).target?.(TURN_CARDS_KEY);
    return typeof source?.getSnapshot === "function" && typeof source.subscribe === "function" ? source : void 0;
  } catch {
    return void 0;
  }
}
function tailSourceFor(host, sessionId, registered) {
  return {
    getSnapshot: () => registered.getSnapshot() && turnCardsSource(host, sessionId) !== void 0,
    subscribe: (listener) => registered.subscribe(listener)
  };
}
var EMPTY_CARDS_SOURCE = {
  getSnapshot: () => EMPTY_TURN_CARDS,
  subscribe: () => () => void 0
};
function turnTailOptions(host) {
  const locale = localeOf2(host);
  return {
    name: "conversation.chat.turnTail",
    id: "dsh-visualize-cards",
    order: 100,
    // Intentionally no chain selector: older chain tails cannot read the
    // session-bound private View before mounting. Registration then falls back
    // without suppressing their toolview, rather than claiming unrelated turns.
    inject: (sessionId) => ({
      hooks: {
        visualizeCards: turnCardsSource(host, sessionId) ?? EMPTY_CARDS_SOURCE,
        ...locale === void 0 ? {} : { locale }
      },
      ...sessionInjection(promptSinkFor(host, sessionId), sessionId)
    })
  };
}
function apply(ctx) {
  const tail = createVisualizeTailSource();
  ctx.slots.inject("tool.call.toolview", () => {
    const locale = localeOf2(ctx);
    return ctx.slots.register({
      name: "tool.call.toolview",
      key: "visualize",
      inject: (sessionId) => ({
        hooks: {
          visualizeTail: tailSourceFor(ctx, sessionId, tail),
          ...locale === void 0 ? {} : { locale }
        },
        ...sessionInjection(promptSinkFor(ctx, sessionId), sessionId)
      })
    }, VisualizeCard);
  });
  ctx.inject(["uiConversation"], (scope) => {
    conversationEvents(scope)?.register(streamDefinition);
  });
  ctx.slots.inject("conversation.input.dock", () => {
    const locale = localeOf2(ctx);
    return ctx.slots.register({
      name: "conversation.input.dock",
      id: "visualize-stream",
      order: 30,
      inject: () => locale === void 0 ? {} : { hooks: { locale } }
    }, StreamingPreview);
  });
  ctx.slots.inject("conversation.chat.turnTail", () => {
    const runtime = conversationRuntime(ctx);
    if (runtime === void 0) return () => void 0;
    const disposers = [];
    try {
      disposers.push(runtime.events.register(turnCardsDefinition));
      disposers.push(runtime.views.register(turnCardsViewDefinition));
      disposers.push(ctx.slots.register(turnTailOptions(ctx), TurnCards));
      tail.setRegistered(true);
    } catch (error) {
      tail.setRegistered(false);
      for (const dispose of [...disposers].reverse()) dispose();
      console.warn("[dsh-visualize] Canonical tail unavailable; retaining tool cards.", error);
      return () => void 0;
    }
    let disposed = false;
    return () => {
      if (disposed) return;
      disposed = true;
      tail.setRegistered(false);
      for (const dispose of [...disposers].reverse()) dispose();
    };
  });
  ctx.inject(["sidebarRight"], (scope) => {
    const sidebar = scope.sidebarRight;
    if (typeof sidebar?.openTab !== "function") return;
    const dispose = registerOpenPageTarget((url) => {
      sidebar.openTab("browser", { params: { url } });
      return true;
    });
    scope.effect(() => dispose, "dsh-visualize: in-app open target");
  });
  registerSettingsSection(ctx);
}

return module.exports;}});
