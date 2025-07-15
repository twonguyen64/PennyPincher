import { createContext, useContext } from 'solid-js';

export const NavigationContext = createContext({
  navigate: null,
});

export function useNavigationContext() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
}