export const DB_NAME = "PennyPincherDB";
const DB_VERSION = 1;

export const ACCOUNT_STORE = "account";
export const TRANSACTIONS_STORE = "transactions";
export const BUDGET_STORE = "budgetExpenses";
export const GOALS_STORE = "savingsGoals"
export const TAGS_STORE = "tags";
export const SETTINGS_STORE = "settings";

export async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(ACCOUNT_STORE)) {
        db.createObjectStore(ACCOUNT_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(TRANSACTIONS_STORE)) {
        db.createObjectStore(TRANSACTIONS_STORE, { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(BUDGET_STORE)) {
        db.createObjectStore(BUDGET_STORE, { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(GOALS_STORE)) {
        db.createObjectStore(GOALS_STORE, { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE, { keyPath: "key" });
      }
      if (!db.objectStoreNames.contains(TAGS_STORE)) {
        db.createObjectStore(TAGS_STORE, { keyPath: null });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.errorCode);
      reject(event.target.error);
    };
  });
}

export async function addData(db, storeName, data) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(data);

    request.onsuccess = (event) => {
      const newKey = event.target.result;
      const newObject = { ...data, id: newKey };
      resolve(newObject);
    };

    request.onerror = (event) => {
      reject("Error adding data: " + event.target.errorCode);
    };
  });
}
export async function deleteData(db, storeName, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = () => resolve();

    request.onerror = (event) => {
      reject("Error deleting data: " + event.target.errorCode);
    };
  });
}
export async function updateData(db, storeName, data) {
    return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    const request = store.put(data);

    request.onsuccess = () => resolve(data);

    request.onerror = (event) => {
        console.error(`Error updating data in store '${storeName}':`, event.target.error);
        reject("Error updating data: " + event.target.errorCode);
    };
    transaction.oncomplete = () => {
        // Completed successfully.
    };
    transaction.onerror = (event) => {
      console.error(`Transaction error for store '${storeName}':`, event.target.error);
    };
  });
}

export function addDataKey(db, storeName, key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(key, key);

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = () => reject('Error adding string');
  });
}
export function deleteDataKey(db, storeName, key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);

    request.onsuccess = () => resolve()
    request.onerror = () => reject('Error deleting string')
  });
}


export async function saveData(db, storeName, data) {
  return new Promise((resolve, reject) => {
    if (!db) {
      console.warn("IndexedDB not initialized. Skipping save.");
      resolve();
      return;
    }
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);

    if (storeName === TAGS_STORE) {
      store.clear();
      data.forEach(item => {
        store.add(item);
      });
    } 
    //For key value pair objects:
    else if (storeName === SETTINGS_STORE) {
        store.put(data);
    } else {
        console.warn(`Unknown storeName: ${storeName}. Data not saved.`);
        resolve();
        return;
    }

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = (event) => {
      console.error(`Error saving data to ${storeName}:`, event.target.error);
      reject(event.target.error);
    };
  });
}

export async function loadData(db, storeName, key) {
  return new Promise((resolve, reject) => {
    if (!db) {
      console.warn("IndexedDB not initialized. Returning empty array.");
      resolve([]);
      return;
    }
    const transaction = db.transaction([storeName], "readonly");
    const store = transaction.objectStore(storeName);
    let request;
    if (storeName === SETTINGS_STORE) {
      if (key === null) {
          // Load all settings if no key is provided
          request = store.getAll();
          request.onsuccess = (event) => {
              resolve(event.target.result);
          };
      } else {
          // Load a specific setting via its key
          request = store.get(key);
          request.onsuccess = (event) => {
              resolve(event.target.result ? event.target.result.value : undefined);
          };
      }
    } 
    else {
      request = store.getAll();
      request.onsuccess = (event) => {
          resolve(event.target.result);
      };
    }

    request.onerror = (event) => {
      console.error(`Error loading data from ${storeName}:`, event.target.error);
      reject(event.target.error);
    };
  });
}

/**
 * Adds or updates a record in a specific IndexedDB object store.
 * @param {string} storeName The name of the object store.
 * @param {Object} data The data object to store. Must contain the keyPath property (e.g., 'id').
 * @returns {Promise<any>} A promise that resolves with the key of the added/updated record.
 */
export function putData(db, storeName, data) {
  return new Promise(async (resolve, reject) => {
    if (!db) {
      reject(new Error('Database is not initialized.'));
      return;
    }
    try {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Retrieves a record from a specific IndexedDB object store by its key.
 * @param {string} storeName The name of the object store.
 * @param {IDBValidKey} key The key (e.g., 'id') of the record to retrieve.
 * @returns {Promise<Object | undefined>} A promise that resolves with the retrieved record or undefined if not found.
 */
export function getData(db, storeName, key) {
  return new Promise(async (resolve, reject) => {
    try {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    } catch (error) {
      reject(error);
    }
  });
}

//Dexie import export functionality

import Dexie from "dexie";


const dexieDB = new Dexie(DB_NAME);
dexieDB.version(DB_VERSION).stores({
  account: 'id',
  transactions: '++id',
  budgetExpenses: '++id',
  savingsGoals: '++id',
  settings: 'key',
  tags: '',
});


import { exportDB } from "dexie-export-import";

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.style.display = 'none';
  document.body.appendChild(link);

  link.href = url;
  link.download = filename;
  link.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
}

export async function exportDatabase() {
  let db = null;
  try {
    db = new Dexie("PennyPincherDB"); 
    await db.open(); 
    
    const blob = await exportDB(db);
    downloadBlob(blob, "PennyPincherData.json");
    console.log("Database exported!");
  } catch (error) {
    console.error("Failed to export database:", error);
  } finally {
    if (db) {
      db.close();
    }
  }
}

dexieDB.on('versionchange', () => {
  console.warn('Database is being upgraded. Closing this connection to the database.');
  dexieDB.close();
});
