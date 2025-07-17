import { createContext, useContext, createSignal } from 'solid-js';

export const MainWrapperContext = createContext();

export function MainWrapperProvider(props) {
  const [isSlideActive, setIsSlideActive] = createSignal(false);
  const [showPopup, setShowPopup] = createSignal('');
  const [editMode, setEditMode] = createSignal(false);

  const value = {
    isSlideActive,
    setSlideActive: setIsSlideActive,
    
    showPopup, setShowPopup,
    editMode, setEditMode,
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