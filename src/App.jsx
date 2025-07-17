import { useNavigate } from '@solidjs/router';
import { NavigationContext } from './contexts/NavigationContext';
import { MoneyProvider } from "./contexts/MoneyContext";
import { MainWrapperProvider, useMainWrapperContext } from "./contexts/MainWrapperContext";

import Footer from './Footer';
import Home from './pages/Home';
import gobackIcon from './assets/goback.png';
import './styles/index.css';
import './styles/home-page.css';
import './styles/transaction-page.css';
import './styles/popups.css';

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
    <main>
      <div id='mainWrapper' classList={{ slide: isSlideActive() }} ontouchstart="">
        <Home />
        <home>
          <div id='secondPageHeader'>
              <img id='backButton' src={gobackIcon} onClick={handleBack}/>
          </div>
          {props.children}
        </home>
      </div>
      <Footer/>
    </main>
  );
}