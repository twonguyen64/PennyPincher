import { useMainWrapperContext } from "../contexts/MainWrapperContext";
import Summary from './Summary';
import TransactionList from "../components/Transaction-Page/TransactionList";

import PopupPaycheque from "../components/Transaction-Page/PopupPaycheque";
import PopupExpense from "../components/Transaction-Page/PopupExpense";
import PopupDelete from "../components/Transaction-Page/PopupDelete";
import { TRANSACTIONS_STORE } from "../utils/db";

import gobackIcon from '../assets/goback.svg';
import { usePageColumnScrolling } from "../utils/PageColumnScrolling";
import { createEffect } from "solid-js";

export default function MainHome() {
    let scrollerRef
    const { showPopup } = useMainWrapperContext();
    const { pageIndex, pageIndexSetter } = useMainWrapperContext();
    const { slideToLeft, snapScrollEnd } = usePageColumnScrolling(
        () => scrollerRef, () => pageIndex().home, pageIndexSetter.home
    );


    return (
        <>
        <Show when={showPopup() === 'paycheque'}>
            <PopupPaycheque/>
        </Show>
        <Show when={showPopup() === 'expense'}>
            <PopupExpense/>
        </Show>
        <Show when={showPopup() === 'delete'}>
            <PopupDelete store={TRANSACTIONS_STORE}/>
        </Show>
        <div 
            id='Homepage'
            ref={scrollerRef}
            class="page-multi swipe-scroll" 
            ontouchstart=""
            onScrollEnd={snapScrollEnd}
        >
            <div class="page-single">
                <Summary/>
            </div>
            <div class="page-single">
                <img id='backButton' src={gobackIcon} onClick={() => slideToLeft()}/>
                <TransactionList/>
            </div>
        </div>
        </>
    )
}