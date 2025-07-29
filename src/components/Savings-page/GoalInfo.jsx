import { Show } from 'solid-js'
import { useMainWrapperContext } from "../../contexts/MainWrapperContext";
import { useMoney } from "../../contexts/MoneyContext";


import AccountDisplay from '../AccountDisplay';
import AnimatedArrows from '../AnimatedArrows';
import '../../styles/animations.css'
import TransferMenu from '../TransferMenu';
import AddButton from '../AddButton';

import editIcon from '../../assets/edit-borderless.svg'
import uploadIcon from '../../assets/upload.svg'
import { dateToStr } from '../../utils/util-functions';

export default function GoalInfo(props) {
    const { showPopup, setShowPopup, setEditMode } = useMainWrapperContext();
    const { savings } = useMoney();
    return (
        <>
        <Show when={showPopup() === 'transfer'}>
            <AnimatedArrows/>
        </Show>
        <AccountDisplay colorFor='savings' name="Savings" balance={savings()}/>

        <Show when={showPopup() === '' && props.isGoalVisible()}>
            <div class='account-menu'>
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
                    <div>Date started: {dateToStr(props.currentGoal().dateStart)}</div>
                    <div></div>
                </div>
            </div>
            </Show>
        <Show when={showPopup() === 'transfer'}>
            <Show when={props.currentGoal()} keyed>
                <TransferMenu account='Goal' goalID={props.currentGoal().id}/>
            </Show>
        </Show>
        </>
        
    );
}