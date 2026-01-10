class u {
  constructor(e = {}) {
    this.dbName = "FormPathDB_Ultimate", this.storeName = "formData", this.onChange = e.onChange || (() => {
    }), this.db = null, this._init();
  }
  async _init() {
    this.db = await this._setupDB(), await this.hydrateAll(), this._scanForms(), new MutationObserver(() => this._scanForms()).observe(document.body, { childList: !0, subtree: !0 });
  }
  _setupDB() {
    return new Promise((e) => {
      const n = indexedDB.open(this.dbName, 1);
      n.onupgradeneeded = (a) => a.target.result.createObjectStore(this.storeName), n.onsuccess = (a) => e(a.target.result);
    });
  }
  _scanForms() {
    document.querySelectorAll("form").forEach((e) => {
      if (e.dataset.observed) return;
      e.dataset.observed = "true";
      const n = () => this._handleInput(e);
      e.addEventListener("input", n), e.addEventListener("change", n), this._handleInput(e);
    });
  }
  async _handleInput(e) {
    if (!e.id) return;
    const n = new FormData(e), a = {};
    for (const [r, t] of n.entries())
      this._setDeepValue(a, r, t);
    e.querySelectorAll('input[type="checkbox"]').forEach((r) => {
      this._setDeepValue(a, r.name, r.checked);
    }), await this._saveToDB(e.id, a), this._refresh();
  }
  async hydrateAll() {
    const e = await this.getAllData();
    for (const n in e)
      this.setData(n, e[n]);
  }
  setData(e, n) {
    const a = document.getElementById(e);
    if (!a) return;
    const r = (s, i = "") => {
      let o = {};
      for (const c in s) {
        const l = i ? `${i}.${c}` : c;
        typeof s[c] == "object" && s[c] !== null && !Array.isArray(s[c]) ? Object.assign(o, r(s[c], l)) : o[l] = s[c];
      }
      return o;
    }, t = r(n);
    for (const s in t) {
      const i = a.querySelector(`[name="${s}"]`);
      i && (i.type === "checkbox" ? i.checked = !!t[s] : i.value = t[s]);
    }
  }
  validate(e, n) {
    return new Promise(async (a) => {
      const r = (await this.getAllData())[e] || {}, t = [];
      for (const s in n) {
        const i = s.split(".").reduce((c, l) => c ? c[l] : null, r), o = n[s];
        o.required && !i && t.push({ path: s, msg: "Required" }), o.email && i && !/^\S+@\S+\.\S+$/.test(i) && t.push({ path: s, msg: "Invalid Email" }), o.min && Number(i) < o.min && t.push({ path: s, msg: `Min ${o.min}` });
      }
      a({ isValid: t.length === 0, errors: t });
    });
  }
  _setDeepValue(e, n, a) {
    const r = n.split(".");
    let t = e;
    r.forEach((s, i) => {
      const o = i === r.length - 1, c = s.match(/^(.+)\[(\d+)\]$/);
      if (c) {
        const [, l, h] = c;
        t[l] || (t[l] = []), o ? t[l][h] = a : (t[l][h] || (t[l][h] = {}), t = t[l][h]);
      } else
        o ? t[s] = a : (t[s] || (t[s] = {}), t = t[s]);
    });
  }
  _saveToDB(e, n) {
    return new Promise((a) => {
      const r = this.db.transaction(this.storeName, "readwrite");
      r.objectStore(this.storeName).put(n, e), r.oncomplete = () => a();
    });
  }
  async getAllData() {
    return this.db ? new Promise((e) => {
      const n = this.db.transaction(this.storeName, "readonly"), a = n.objectStore(this.storeName), r = a.getAll(), t = a.getAllKeys();
      n.oncomplete = () => {
        const s = {};
        t.result.forEach((i, o) => {
          s[i] = r.result[o];
        }), e(s);
      };
    }) : {};
  }
  async clearData(e = null) {
    return new Promise((n) => {
      const a = this.db.transaction(this.storeName, "readwrite"), r = a.objectStore(this.storeName);
      e ? e.forEach((t) => r.delete(t)) : r.clear(), a.oncomplete = () => {
        this._refresh(), n();
      };
    });
  }
  _refresh() {
    this.getAllData().then(this.onChange);
  }
}
typeof window < "u" && (window.FormPath = u);
export {
  u as default
};
