import { For, Show, createSignal } from 'solid-js'
import GoalSorter from './GoalSorter';
import SavingsGoal from "./SavingsGoal";

import AccountDisplay from '../AccountDisplay';
import AnimatedArrows from '../AnimatedArrows';
import AddButton from '../AddButton';
import addIcon from '../../assets/add.svg'
import swapIcon from '../..//assets/swap.svg'

import { useMoney } from "../../contexts/MoneyContext";
import { useMainWrapperContext } from '../../contexts/MainWrapperContext'
import { getCenterElementOfScroller, getObjectFromElement } from '../../utils/util-functions'
import { GOALS_STORE } from '../../utils/db';

export default function GoalScroller(props) {
    const { showPopup, setShowPopup } = useMainWrapperContext();
    const { savings, goals, setGoals, editTransaction } = useMoney();

    const {
        currentGoal,
        setCurrentGoal,
        isGoalVisible,
        setIsGoalVisible
    } = props

    const [scrollerState, setScrollerState] = createSignal('display')

    let scrollerRef, addGoalRef;
    /**
     * Sets the current goal when scrolling to a new goal.
     * Also prevents scrolling if the user scrolls to the 'Add goal button' in transfer mode
     */
    const scrollEnd = () => {
        if (goals().length < 1) return
        else if (scrollerState() !== 'display') return

        let middleElement = getCenterElementOfScroller(scrollerRef)
        //Case: middle element is the "Add goal" button
        if (middleElement === addGoalRef) {
            if (showPopup() === 'transfer') {
                //Prevent scrolling
                middleElement = addGoalRef.previousElementSibling
                middleElement.scrollIntoView({behavior: 'smooth',inline: 'center'});
            } 
            else {
                setIsGoalVisible(false)
            }
        }
        //Otherwise, middle element is a goal.
        else {
            const objectID = parseInt(middleElement.getAttribute('objectid'))
            if (objectID == currentGoal().id && isGoalVisible()) return
            //Save current goal object to signal if scrolled to a new goal
            const goal = getObjectFromElement(middleElement, goals())
            setCurrentGoal(goal)
            setIsGoalVisible(true)
        }
    };

    const toggleScrollerState = () => {
        const page = document.getElementById('Savingspage-main')
        switch (scrollerState()) {
            case 'display':
                setScrollerState('to-sorter');
                page.classList.add('no-touch-events')
                break;
            case 'sorter':
                setScrollerState('to-display');
                page.classList.remove('no-touch-events')
                break;
        }
    }
    function handleTransitionEnd(e) {
        if (e.propertyName !== 'max-height') return;
        switch (scrollerState()) {
            case 'to-sorter':
                setScrollerState('sorter');
                break;
            case 'to-display':
                setScrollerState('display');
                break;
        }
    }
    const saveSortedGoals = () => {
        const oldGoals = goals()
        let newIndex = 0
        const sorter = document.getElementById('Goal-sorter')
        for (const element of sorter.children) {
            if (!element.classList.contains('ObjectContainer')) continue
            
            const goal = getObjectFromElement(element, oldGoals)
            //Only if the index is different from before..
            //..then change it and update it
            if (goal.index !== newIndex) {
                goal.index = newIndex
                editTransaction(goal, GOALS_STORE)
            }
            newIndex++
        }
        //Resort the signal array based on the new indices
        setGoals([...goals()].sort((a, b) => a.index - b.index));
        //Close the sorter
        toggleScrollerState();
    }
    
    return (
        <div 
        id='Goal-scroller-wrapper'
        class={`${scrollerState()}`} 
        on:transitionend={handleTransitionEnd}
        >   
            <div id='Goal-scroller-header'>
                <Show when={goals().length > 1}>
                    <Show when={scrollerState() === 'sorter'}>
                        <span class='Goal-scroller-header-button' onTouchEnd={saveSortedGoals}>
                            Save changes
                        </span>
                        <span class='Goal-scroller-header-button' onTouchEnd={toggleScrollerState}>
                            Cancel
                        </span>
                    </Show>
                    <Show when={scrollerState() === 'display'}>
                        <span id='Goal-sort-button' onTouchEnd={toggleScrollerState}>
                            <img src={swapIcon}/>
                            Reorder goals
                        </span>
                    </Show>
                </Show>
            </div>
            
            <div 
            id='Goal-scroller-inner-wrapper'
            class={`hidden-scrollbar ${scrollerState()}`} 
            ontransitionend={handleTransitionEnd}
            >
            <Show when={scrollerState() === 'sorter' || scrollerState() === 'to-display'}>
                <GoalSorter goals={goals()}/>
            </Show>

            <Show when={scrollerState() === 'display' || scrollerState() === 'to-sorter'}>
                <div id="Goal-scroller" ref={scrollerRef} onScrollEnd={scrollEnd}>
                    <span class="Goal-buffer"></span>
                    <For each={goals()}>
                        {(goal) => (
                            <SavingsGoal
                            objectID={goal.id}
                            name={goal.name}
                            target={goal.target}
                            balance={goal.balance}
                            />
                        )}
                    </For>
                    <AddButton ref={addGoalRef}
                        icon={addIcon} text={'Add goal'} 
                        onClick={() => setShowPopup('goal')}
                    />
                    <span class="Goal-buffer"></span>
                </div>
            </Show>
            </div>
            
            <Show when={showPopup() === 'transfer'}>
                <AnimatedArrows/>
            </Show>
            <AccountDisplay colorFor='savings' name="Savings" balance={savings()}/>
        </div>
    )
}
