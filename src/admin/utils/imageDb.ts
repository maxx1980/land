const DB_NAME = 'site-gallery';
const STORE_NAME = 'images';
const DB_VERSION = 1;

export interface GalleryImage {
  id: string;
  name: string;
  dataUrl: string;
  width: number;
  height: number;
  size: number;
  createdAt: number;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(mode: IDBTransactionMode): Promise<IDBObjectStore> {
  return openDb().then((db) => db.transaction(STORE_NAME, mode).objectStore(STORE_NAME));
}

function wrap<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllImages(): Promise<GalleryImage[]> {
  const store = await tx('readonly');
  const items = await wrap<GalleryImage[]>(store.getAll());
  return items.sort((a, b) => b.createdAt - a.createdAt);
}

export async function addImage(image: GalleryImage): Promise<void> {
  const store = await tx('readwrite');
  await wrap(store.put(image));
}

export async function removeImage(id: string): Promise<void> {
  const store = await tx('readwrite');
  await wrap(store.delete(id));
}

export async function clearAllImages(): Promise<void> {
  const store = await tx('readwrite');
  await wrap(store.clear());
}
