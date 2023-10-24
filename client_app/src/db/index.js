const db = {
  delete(key) {
    localStorage.removeItem(key);
  },
  get(key) {
    const val = localStorage.getItem(key);
    if (!val) return null;

    return JSON.parse(val);
  },
  save(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }
};

export default db;
