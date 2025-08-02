import { createEffect, Show } from 'solid-js'
import { useMoney } from "../../contexts/MoneyContext";
import { useMainWrapperContext } from "../../contexts/MainWrapperContext";

import AccountDisplay from '../AccountDisplay';
import AnimatedArrows from '../AnimatedArrows';
import '../../styles/animations.css'
import TransferMenu from '../TransferMenu';
import AddButton from '../AddButton';

import editIcon from '../../assets/edit-borderless.svg'
import uploadIcon from '../../assets/upload.svg'
import { dateToStr, dateDifferenceRounded } from '../../utils/util-functions';
import PaymentPlanWrapper from './PaymentPlanWrapper';

export default function GoalInfo(props) {
    const { isGoalVisible, currentGoal } = props
    const { showPopup, setShowPopup, setEditMode } = useMainWrapperContext();
    const { savings } = useMoney();

    return (
        <>
        <Show when={showPopup() === 'transfer'}>
            <AnimatedArrows/>
        </Show>
        <AccountDisplay colorFor='savings' name="Savings" balance={savings()}/>

        <Show when={showPopup() !== 'transfer' && isGoalVisible()}>
            <div id='GoalInfo'>
                <div class="AddButton-wrapper">
                    <AddButton
                        icon={editIcon} text={'Edit goal'} 
                        onClick={() => {setEditMode(true); setShowPopup('goal');}}
                    />
                    <AddButton
                        icon={uploadIcon} text={'Contribute money to goal'} 
                        onClick={() => setShowPopup('transfer')}
                    />
                </div>
                <div class='Goal-date-info'>
                    <div>{currentGoal().name}</div>
                    <div>Date started: {dateToStr(currentGoal().dateStart)}</div>
                    <div>{dateDifferenceRounded(currentGoal().dateStart, currentGoal().dateEnd)} to go</div>
                </div>
                    <PaymentPlanWrapper currentGoal={currentGoal}/>

            </div>
        </Show>

        <Show when={showPopup() === 'transfer'}>
            <Show when={currentGoal()} keyed>
                <TransferMenu account='Goal' goalID={currentGoal().id}/>
            </Show>
        </Show>
        </>
        
    );
}