import { openDB } from 'idb';

const DB_NAME = 'garud-offline-db';
const DB_VERSION = 1;
const STORE_NAME = 'offline-reports';

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const saveOfflineReport = async (report) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.add({
    ...report,
    synced: false,
    queuedAt: new Date().toISOString()
  });
  await tx.done;
};

export const getOfflineReports = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const clearOfflineReports = async () => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.clear();
  await tx.done;
};
