import { Show } from "solid-js";
import { useMainWrapperContext } from "../contexts/MainWrapperContext";

import AccountDisplay from "../components/AccountDisplay";
import TransactionList from "../components/Transaction-Page/TransactionList"

import PopupPaycheque from "../components/Transaction-Page/PopupPaycheque";
import PopupExpense from "../components/Transaction-Page/PopupExpense";
import PopupDelete from "../components/Transaction-Page/PopupDelete";
import { TRANSACTIONS_STORE } from "../utils/db";

export default function Transactions() {
    const { showPopup } = useMainWrapperContext();
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
            <TransactionList/>
        </>
    );
}