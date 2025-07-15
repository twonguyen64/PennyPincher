import AccountDisplay from "../components/AccountDisplay";
import TransactionInput from "../components/TransactionExpenseInput"
import TransactionList from "../components/TransactionList"
import { useMoney } from "../contexts/MoneyContext";

export default function Expenses() {
    const { totalExpenses } = useMoney();
    return (
        <div id="secondPage">
            <AccountDisplay name="Expenses" balance={totalExpenses()} backgroundColor={'rgba(219, 231, 236, 1)'}/>
            <TransactionInput type='expense'/>
            <TransactionList type='expense'/>
        </div>
    );
}