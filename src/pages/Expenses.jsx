import AccountDisplay from "../components/AccountDisplay";
import PopupWithdrawExpense from "../components/Transaction-Page/PopupWithdrawExpense"
import PopupWithdrawSavings from "../components/Transaction-Page/PopupWithdrawSavings"
import TransactionList from "../components/Transaction-Page/TransactionList"
import { useMoney } from "../contexts/MoneyContext";

export default function Expenses() {
    const { totalExpenses } = useMoney();
    return (
        <>
            <AccountDisplay colorFor='expense' name="Total Expenses" balance={totalExpenses()}/>
            <PopupWithdrawExpense/>
            <PopupWithdrawSavings/>
            <TransactionList type='expense'/>
        </>
    );
}