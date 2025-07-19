import {Switch, Match} from 'solid-js';
import { MainWrapperProvider, useMainWrapperContext } from "./contexts/MainWrapperContext";

import Home from './pages/Home';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import gobackIcon from './assets/goback.png';

export default function MainHome() {
    const { isSlideActive, setSlideActive, secondPage } = useMainWrapperContext();
        const handleBack = () => {
        setSlideActive(false);
    };

    return (
        <div id='mainWrapper' classList={{ slide: isSlideActive() }} ontouchstart="">
            <Home />
            <home>
                <div id='secondPageHeader'>
                    <img id='backButton' src={gobackIcon} onClick={handleBack}/>
                </div>
                <Switch fallback={<Income/>}>
                <Match when={secondPage() === 'expenses'}>
                    <Expenses/>
                </Match>
                </Switch>
            </home>
        </div>
    )
}