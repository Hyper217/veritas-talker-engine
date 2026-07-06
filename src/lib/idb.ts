const DB_NAME = 'veritas_talker';
const DB_VERSION = 1;
const PRODUCTS_STORE = 'products';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PRODUCTS_STORE)) {
        db.createObjectStore(PRODUCTS_STORE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open catalog database'));
  });

  return dbPromise;
}

function runTransaction<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(PRODUCTS_STORE, mode);
        const store = tx.objectStore(PRODUCTS_STORE);
        const request = run(store);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error('Catalog database operation failed'));
        tx.onerror = () => reject(tx.error ?? new Error('Catalog database transaction failed'));
      }),
  );
}

export async function idbGetAllProducts<T extends { id: string }>(): Promise<T[]> {
  return runTransaction('readonly', (store) => store.getAll());
}

export async function idbPutProduct<T extends { id: string }>(product: T): Promise<void> {
  await runTransaction('readwrite', (store) => store.put(product));
}

export async function idbDeleteProduct(id: string): Promise<void> {
  await runTransaction('readwrite', (store) => store.delete(id));
}

export async function idbReplaceAllProducts<T extends { id: string }>(products: T[]): Promise<void> {
  const db = await openDb();

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(PRODUCTS_STORE, 'readwrite');
    const store = tx.objectStore(PRODUCTS_STORE);
    store.clear();

    for (const product of products) {
      store.put(product);
    }

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Failed to replace catalog'));
  });
}

export async function idbCountProducts(): Promise<number> {
  return runTransaction('readonly', (store) => store.count());
}
