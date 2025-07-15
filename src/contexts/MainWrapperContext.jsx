import { createContext, useContext, createSignal } from 'solid-js';

export const MainWrapperContext = createContext();

export function MainWrapperProvider(props) {
  const [isSlideActive, setIsSlideActive] = createSignal(false);
  const [showPopup, setShowPopup] = createSignal(false);
  const [showSelectMultiple, setShowSelectMultiple] = createSignal(false);
  const [showMergePopup, setShowMergePopup] = createSignal(false);

  const value = {
    isSlideActive,
    setSlideActive: setIsSlideActive,
    
    showPopup, setShowPopup,

    showSelectMultiple, setShowSelectMultiple,

    showMergePopup, setShowMergePopup,
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