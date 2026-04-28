// firestore-adapter.js
// Maps V8 Compat API calls to V9 Modular API so that we can pass the databaseId.
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

class DocRef {
  constructor(ref) { this.ref = ref; this.id = ref.id; }
  async set(data) { return setDoc(this.ref, data); }
  async update(data) { return updateDoc(this.ref, data); }
  async delete() { return deleteDoc(this.ref); }
  async get() { 
      const snap = await getDoc(this.ref);
      return { id: snap.id, exists: snap.exists(), data: () => snap.data() };
  }
}

class QueryWrapper {
  constructor(q) { this.q = q; }
  where(field, op, val) { return new QueryWrapper(query(this.q, where(field, op, val))); }
  orderBy(field, dir="asc") { return new QueryWrapper(query(this.q, orderBy(field, dir))); }
  async get() {
    try {
        const snap = await getDocs(this.q);
        const docs = snap.docs.map(d => ({ id: d.id, exists: true, data: () => d.data() }));
        return { empty: snap.empty, size: docs.length, docs, forEach: cb => docs.forEach(cb) };
    } catch(e) { throw e; }
  }
}

class CollectionRef extends QueryWrapper {
  constructor(dbInst, path) {
    const ref = collection(dbInst, path);
    super(ref);
    this.ref = ref;
  }
  doc(id) { return new DocRef(id ? doc(this.ref, id) : doc(this.ref)); }
  async add(data) { 
      const d = await addDoc(this.ref, data); 
      return new DocRef(d);
  }
}

export function initFirestoreAdapter(app, databaseId) {
  const modDb = getFirestore(app._delegate || app, databaseId);
  const dbInterface = {
    collection: (path) => new CollectionRef(modDb, path)
  };
  
  if (!window.firebase) window.firebase = {};
  
  // Hijack firebase.firestore()
  window.firebase.firestore = () => dbInterface;
  window.firebase.firestore.FieldValue = {
    serverTimestamp: () => serverTimestamp()
  };
  
  return dbInterface;
}
