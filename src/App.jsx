import { useNavigate } from '@solidjs/router';
import { NavigationContext } from './contexts/NavigationContext';
import { MoneyProvider } from "./contexts/MoneyContext";
import { MainWrapperProvider } from "./contexts/MainWrapperContext";

import Footer from './Footer';
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
  return (
    <main>
      {props.children}
      <Footer/>
    </main>
  );
}