/**
 * FormPath JS v3.2 - Core Implementation
 */
class FormPath {
    constructor(options = {}) {
        this.dbName = 'FormPathDB_Ultimate';
        this.storeName = 'formData';
        this.onChange = options.onChange || (() => {});
        this.db = null;
        this._init();
    }

    async _init() {
        this.db = await this._setupDB();
        await this.hydrateAll();
        this._scanForms();

        // Monitor for dynamic DOM changes (like adding task rows)
        const observer = new MutationObserver(() => this._scanForms());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    _setupDB() {
        return new Promise((resolve) => {
            const request = indexedDB.open(this.dbName, 1);
            request.onupgradeneeded = (e) => e.target.result.createObjectStore(this.storeName);
            request.onsuccess = (e) => resolve(e.target.result);
        });
    }

    _scanForms() {
        document.querySelectorAll('form').forEach((form) => {
            if (form.dataset.observed) return;
            form.dataset.observed = 'true';

            const updateHandler = () => this._handleInput(form);
            form.addEventListener('input', updateHandler);
            form.addEventListener('change', updateHandler);

            // Initial scan of existing data
            this._handleInput(form);
        });
    }

    async _handleInput(form) {
        if (!form.id) return;
        const formData = new FormData(form);
        const result = {};

        for (const [key, value] of formData.entries()) {
            this._setDeepValue(result, key, value);
        }

        form.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
            this._setDeepValue(result, cb.name, cb.checked);
        });

        await this._saveToDB(form.id, result);
        this._refresh();
    }

    async hydrateAll() {
        const data = await this.getAllData();
        for (const formId in data) {
            this.setData(formId, data[formId]);
        }
    }

    setData(formId, data) {
        const form = document.getElementById(formId);
        if (!form) return;

        const flatten = (obj, prefix = '') => {
            let items = {};
            for (const key in obj) {
                const newKey = prefix ? `${prefix}.${key}` : key;
                if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                    Object.assign(items, flatten(obj[key], newKey));
                } else {
                    items[newKey] = obj[key];
                }
            }
            return items;
        };

        const flatData = flatten(data);
        for (const path in flatData) {
            const input = form.querySelector(`[name="${path}"]`);
            if (input) {
                if (input.type === 'checkbox') input.checked = !!flatData[path];
                else input.value = flatData[path];
            }
        }
    }

    validate(formId, schema) {
        return new Promise(async (resolve) => {
            const data = (await this.getAllData())[formId] || {};
            const errors = [];

            for (const path in schema) {
                const val = path.split('.').reduce((o, i) => (o ? o[i] : null), data);
                const rules = schema[path];

                if (rules.required && !val) errors.push({ path, msg: 'Required' });
                if (rules.email && val && !/^\S+@\S+\.\S+$/.test(val)) errors.push({ path, msg: 'Invalid Email' });
                if (rules.min && Number(val) < rules.min) errors.push({ path, msg: `Min ${rules.min}` });
            }
            resolve({ isValid: errors.length === 0, errors });
        });
    }

    _setDeepValue(obj, path, value) {
        const segments = path.split('.');
        let current = obj;
        segments.forEach((segment, i) => {
            const isLast = i === segments.length - 1;
            const arrayMatch = segment.match(/^(.+)\[(\d+)\]$/);
            if (arrayMatch) {
                const [, field, index] = arrayMatch;
                if (!current[field]) current[field] = [];
                if (isLast) current[field][index] = value;
                else {
                    if (!current[field][index]) current[field][index] = {};
                    current = current[field][index];
                }
            } else {
                if (isLast) current[segment] = value;
                else {
                    if (!current[segment]) current[segment] = {};
                    current = current[segment];
                }
            }
        });
    }

    _saveToDB(id, data) {
        return new Promise((resolve) => {
            const tx = this.db.transaction(this.storeName, 'readwrite');
            tx.objectStore(this.storeName).put(data, id);
            tx.oncomplete = () => resolve();
        });
    }

    async getAllData() {
        if (!this.db) return {};
        return new Promise((resolve) => {
            const tx = this.db.transaction(this.storeName, 'readonly');
            const store = tx.objectStore(this.storeName);
            const req = store.getAll();
            const keysReq = store.getAllKeys();
            tx.oncomplete = () => {
                const res = {};
                keysReq.result.forEach((k, i) => {
                    res[k] = req.result[i];
                });
                resolve(res);
            };
        });
    }

    async clearData(ids = null) {
        return new Promise((resolve) => {
            const tx = this.db.transaction(this.storeName, 'readwrite');
            const store = tx.objectStore(this.storeName);
            if (ids) ids.forEach((id) => store.delete(id));
            else store.clear();
            tx.oncomplete = () => {
                this._refresh();
                resolve();
            };
        });
    }

    _refresh() {
        this.getAllData().then(this.onChange);
    }
}

if (typeof window !== 'undefined') {
    window.FormPath = FormPath;
}

export default FormPath;
