import { createContext, useContext, createSignal, onMount } from 'solid-js';
import { 
  openDatabase, saveData, loadData,
  SETTINGS_STORE,
  } from '../utils/db.jsx';

export const MainWrapperContext = createContext();


const KEY_SAVINGS_TYPE = 'savingsType';

export function MainWrapperProvider(props) {

  const [currentScrollPageID, setCurrentScrollPageID] = createSignal(null);
  const [showPopup, setShowPopup] = createSignal('');
  const [editMode, setEditMode] = createSignal(false);
  const [checkboxCount, setCheckboxCount] = createSignal(0);
  const [selectedTag, setSelectedTag] = createSignal('');
  const [payFreq, setPayFreq] = createSignal(14)

  /** Either a amount ('contribution') OR a perctange of the total deposit ('percentage') */
  const [savingsType, _setSavingsType] = createSignal('contribution');

  let db;
  onMount(async () => {
    try {
      db = await openDatabase();
      
      const storedSavingsType = await loadData(db, SETTINGS_STORE, KEY_SAVINGS_TYPE);
      if (storedSavingsType !== undefined && storedSavingsType !== null) {
        _setSavingsType(storedSavingsType);
      }

    } catch (error) {
      console.error("Failed to initialize IndexedDB for MainWrapperContext:", error);
    }
  });

  const setSavingsType = (value) => {
    _setSavingsType(value);
    if (db) {
      saveData(db, SETTINGS_STORE, { key: KEY_SAVINGS_TYPE, value: value }).catch(console.error);
    }
  };

  const value = {
    currentScrollPageID, setCurrentScrollPageID,
    showPopup, setShowPopup,
    editMode, setEditMode,
    checkboxCount, setCheckboxCount,
    selectedTag, setSelectedTag,
    
    savingsType, setSavingsType,
    payFreq, setPayFreq,
  };

  return (
    <MainWrapperContext.Provider value={value}>
      {props.children}
    </MainWrapperContext.Provider>
  );
}

export function useMainWrapperContext() {
  const context = useContext(MainWrapperContext);
  if (!context) {
    throw new Error('useMainWrapperContext must be used within a MainWrapperProvider');
  }
  return context;
}