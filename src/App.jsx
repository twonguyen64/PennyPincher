import { useNavigate } from '@solidjs/router';
import { NavigationContext } from './contexts/NavigationContext';
import { MoneyProvider } from "./contexts/MoneyContext";
import { MainWrapperProvider, useMainWrapperContext } from "./contexts/MainWrapperContext";

import Home from './pages/Home';
import './styles/index.css';

export default function App(props) {
  const navigate = useNavigate();

  return (
    <NavigationContext.Provider value={{ navigate }}>
      <MoneyProvider>
          <MainWrapperProvider>
            <AppContentLayout>
              {props.children}
            </AppContentLayout>
          </MainWrapperProvider>
      </MoneyProvider>
    </NavigationContext.Provider>
  );
}

function AppContentLayout(props) {
  const { isSlideActive, setSlideActive } = useMainWrapperContext();
  const handleBack = () => {
    setSlideActive(false);
  };

  return (
    <main id='mainWrapper' classList={{ slide: isSlideActive() }}>
      <Home />
      <home>
        <div id='secondPageHeader'>
          <div id='backButton' onClick={handleBack}>🔚</div>
        </div>
        {props.children}
      </home>
    </main>
  );
}