import { Switch, Match } from "solid-js";
import { useMainWrapperContext } from "../contexts/MainWrapperContext";
import { useMoney } from "../contexts/MoneyContext";

import AccountDisplay from "../components/AccountDisplay";
import AccountMenu from "../components/AccountMenu";
import TransferMenu from "../components/TransferMenu";
import transferImg from '../assets/transfer.svg'
import AnimatedArrows from "../components/AnimatedArrows";
import AddButton from "../components/AddButton";

export default function Summary() {
    const { showPopup, setShowPopup } = useMainWrapperContext();
    const { allowance, savings } = useMoney();
    return (
        <>
            <div class="page-header">Your account</div>
            <AccountDisplay colorFor='savings' name="Savings" balance={savings()}/>
            <div style={'width: 100%'}>
                <Show when={showPopup() === 'transfer'}>
                    <AnimatedArrows/>
                </Show>
                <AccountDisplay colorFor='allowance' name="Allowance" balance={allowance()}/>
            </div>
            <div id="summary-main-wrapper" class="main-wrapper">
                <Switch fallback={
                    <>
                        <AccountMenu/>
                        <div class="AddButton-wrapper">
                            <AddButton 
                                icon={transferImg} 
                                text={'Transfer money between accounts'} 
                                onClick={() => setShowPopup('transfer')}
                            />
                        </div>
                    </>
                }>
                    <Match when={showPopup() === 'transfer'}>
                        <TransferMenu account={'Allowance'}/>
                    </Match>
                </Switch>
            </div>
        </>
    );
}