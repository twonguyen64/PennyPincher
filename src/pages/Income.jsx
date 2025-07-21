import AccountDisplay from "../components/AccountDisplay";
import PopupDepositIncome from "../components/Transaction-Page/PopupDepositIncome"
import PopupDepositSavings from "../components/Transaction-Page/PopupDepositSavings"
import TransactionList from "../components/Transaction-Page/TransactionList"
import { useMoney } from "../contexts/MoneyContext";

export default function Income() {
    const { totalIncome, totalSavings } = useMoney();
    return (
        <>
            <AccountDisplay colorFor='income' name="Total Income" balance={totalIncome()}/>
            <AccountDisplay colorFor='savings' name="Total Savings Contributed" balance={totalSavings()}/>
            <PopupDepositIncome/>
            <PopupDepositSavings/>
            <TransactionList type='income'/>
        </>
    );
}