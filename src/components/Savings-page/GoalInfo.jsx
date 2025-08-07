import { Show } from 'solid-js'
import { useMoney } from "../../contexts/MoneyContext";
import { useMainWrapperContext } from "../../contexts/MainWrapperContext";

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

    return (
        <>
        <Show when={showPopup() !== 'transfer' && isGoalVisible() && currentGoal()}>
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
            
                <PaymentPlanWrapper currentGoal={currentGoal}/>
                <div id='Goal-date-info'>
                    <span>Date started: {dateToStr(currentGoal().dateStart)}</span>
                    <span>{dateDifferenceRounded(currentGoal().dateStart, currentGoal().dateEnd)} to go</span>
                </div>

                <div id='Goal-notes-wrapper'>Notes:
                    <div id='Goal-notes'></div>
                </div>
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