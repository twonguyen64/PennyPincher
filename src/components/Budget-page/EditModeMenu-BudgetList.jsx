import { Show, onMount, onCleanup } from 'solid-js'
import { useMainWrapperContext } from '../../contexts/MainWrapperContext'

import closeImg from '../../assets/close-button.png'

export default function EditModeMenu() {
    const { 
        setShowPopup, setEditMode, 
        checkboxCount, setCheckboxCount
    } = useMainWrapperContext()
    
    const listRef = document.getElementById('BudgetList')
    
    const checkboxBehaviour = (e) => {
        if (!e.target.classList.contains('ObjectContainer')) return
        const checkbox = e.target.querySelector('.editModeCheckbox')
        if (!checkbox) return
        checkbox.checked = (checkbox.checked) ? false : true
        const checkedBoxes = listRef.querySelectorAll('.editModeCheckbox:checked');
        const count = checkedBoxes.length || 0;
        setCheckboxCount(count);
    }

    onMount(() => {
        if (listRef) {
            listRef.addEventListener('click', checkboxBehaviour);
        }
    });
    onCleanup(() => {
        if (listRef) {
        listRef.removeEventListener('click', checkboxBehaviour);
        }
    });
    
    return (
        <>
            <img class='close-button' src={closeImg} alt="X" onClick={() => setEditMode(false)}/>
            <Show when={checkboxCount() === 1}>
                <span class='BudgetListEdit-button' onClick={() => setShowPopup('edit')}>
                    Edit
                </span>
            </Show>
            <Show when={checkboxCount() > 0}>
                <span class='BudgetListEdit-button' onClick={() => setShowPopup('delete')}>
                    Delete selected
                </span>
            </Show>
        </>
    )
}