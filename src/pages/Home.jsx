import AccountDisplay from "../components/AccountDisplay";
import AccountMenu from "../components/AccountMenu";
import { useMoney } from "../contexts/MoneyContext";


export default function Home() {
    const { allowance, savings } = useMoney();
    return (
        <home>
            <AccountDisplay name="Savings" balance={savings()} backgroundColor={'rgb(236, 219, 222)'}/>
            <AccountDisplay name="Allowance" balance={allowance()} backgroundColor={'rgb(236, 219, 222)'}/>

            <AccountMenu type="income" />
            <AccountMenu type="expenses" />
        </home>
    );
}