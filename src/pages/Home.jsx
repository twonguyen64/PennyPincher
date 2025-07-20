import {Switch, Match} from 'solid-js';
import { useMainWrapperContext } from "../contexts/MainWrapperContext";

import Summary from './Summary';
import Income from './Income';
import Expenses from './Expenses';
import gobackIcon from '../assets/goback.png';

export default function MainHome() {
    const { isSlideActive, setSlideActive, setEditMode, secondPage } = useMainWrapperContext();
        const slideBack = () => {
        setSlideActive(false);
        setEditMode(false)
    };

    return (
        <div id='homepage' classList={{ slide: isSlideActive() }} ontouchstart="">
            <div id='header'>
                <img id='backButton' src={gobackIcon} onClick={slideBack}/>
            </div>
            <Summary />
            <home>
                <Switch fallback={<Income/>}>
                <Match when={secondPage() === 'expenses'}>
                    <Expenses/>
                </Match>
                </Switch>
            </home>
        </div>
    )
}