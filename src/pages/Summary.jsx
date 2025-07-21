import AccountDisplay from "../components/AccountDisplay";
import AccountMenu from "../components/AccountMenu";
import { useMoney } from "../contexts/MoneyContext";


export default function Summary() {
    const { allowance, savings } = useMoney();
    return (
        <>
            <div id="Home-header">
                Your account:
            </div>
            <AccountDisplay colorFor='savings' name="Savings" balance={savings()}/>
            <AccountDisplay colorFor='allowance' name="Allowance" balance={allowance()}/>
            <div id="account-menu-wrapper"> 
                <AccountMenu type="income" />
                <AccountMenu type="expense" />
            </div>
        </>
    );
}