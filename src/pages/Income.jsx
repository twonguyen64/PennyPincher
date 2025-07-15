import AccountDisplay from "../components/AccountDisplay";
import TransactionInput from "../components/TransactionIncomeInput"
import TransactionList from "../components/TransactionList"
import { useMoney } from "../contexts/MoneyContext";

export default function Income() {
    const { totalIncome } = useMoney();
    return (
        <div id="secondPage">
            <AccountDisplay name="Total Income" balance={totalIncome()} backgroundColor={'rgba(219, 236, 225, 1)'}/>
            <TransactionInput type='income'/>
            <TransactionList type='income'/>
        </div>
    );
}