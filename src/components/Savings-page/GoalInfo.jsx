import { Show } from 'solid-js'
import { useMoney } from "../../contexts/MoneyContext";
import { useMainWrapperContext } from "../../contexts/MainWrapperContext";
import { usePageColumnScrolling } from "../../utils/PageColumnScrolling"

import AccountDisplay from '../AccountDisplay';
import AnimatedArrows from '../AnimatedArrows';
import '../../styles/animations.css'
import TransferMenu from '../TransferMenu';
import AddButton from '../AddButton';

import editIcon from '../../assets/edit-borderless.svg'
import uploadIcon from '../../assets/upload.svg'
import { dateToStr, dateDifferenceRounded } from '../../utils/util-functions';
import PaymentPlan from './PaymentPlan';

export default function GoalInfo(props) {
    const { showPopup, setShowPopup, setEditMode } = useMainWrapperContext();
    const { savings } = useMoney();
    const { isGoalVisible, currentGoal } = props
    
    const { pageIndex, pageIndexSetter } = useMainWrapperContext();
    const { slideToRight } = usePageColumnScrolling(
        () => document.getElementById('Savingspage'), 
        () => pageIndex().savings, 
        pageIndexSetter.savings
    );

    return (
        <>
        <Show when={showPopup() === 'transfer'}>
            <AnimatedArrows/>
        </Show>
        <AccountDisplay colorFor='savings' name="Savings" balance={savings()}/>

        <Show when={showPopup() === '' && isGoalVisible()}>
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
                    <div>{currentGoal().name}</div>
                    <div>Date started: {dateToStr(currentGoal().dateStart)}</div>
                    <div>{dateDifferenceRounded(currentGoal().dateStart, currentGoal().dateEnd)} to go</div>
                </div>

                <Show when={currentGoal()} keyed>
                    <PaymentPlan goal={currentGoal()}/>
                </Show>

                <Show when={currentGoal()}>
                    <div class="PaymentPlan-viewSummary-wrapper">
                        <div onClick={slideToRight}>
                            <span>IMG HERE</span>
                            <span>View all plans</span>
                        </div>
                    </div>
                </Show>

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