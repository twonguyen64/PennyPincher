
import { createEffect, createSignal, onMount } from 'solid-js'
import { useMainWrapperContext } from '../../contexts/MainWrapperContext'
import { useMoney } from '../../contexts/MoneyContext'
import { GOALS_STORE } from '../../utils/db'

import linkIcon from '../../assets/link.svg'
import editIcon from '../../assets/edit.svg'
import DOMPurify from '../../utils/dompurify/purify.module'

export default function GoalNotes(props) {
    const { setShowPopup } = useMainWrapperContext();
    const { editTransaction } = useMoney();
    const [editNotesMode, setEditNotesMode] = createSignal(false)
    let notesRef
    let prevEntry = null
    let didUserWantToSave = false

    createEffect(() => {
        const notes = props.currentGoal().notes
        if (notes) notesRef.innerHTML = notes
        else notesRef.innerHTML = null
    })
    
    createEffect(() => {
        if (editNotesMode()) {
            notesRef.setAttribute('contenteditable', 'true')
            prevEntry = notesRef.innerHTML
        }
        else {
            notesRef.setAttribute('contenteditable', 'false')
            const contentStayedTheSame = (prevEntry === notesRef.innerHTML)
            if (contentStayedTheSame) return
            
            if (didUserWantToSave) {
                const dirtyHTML = notesRef.innerHTML;
                const cleanHTML = DOMPurify.sanitize(dirtyHTML, {
                    ALLOWED_TAGS: ['div', 'a']
                });
                notesRef.innerHTML = cleanHTML;
                //Save to goal
                const editedGoal = {
                    ...props.currentGoal(),
                    notes: cleanHTML
                }
                editTransaction(editedGoal, GOALS_STORE)
            }
            else notesRef.innerHTML = prevEntry
        }
    });

    return (
        <div id='Goal-notes-wrapper'>
            Notes
            <div 
            id='Goal-notes'
            ref={notesRef}
            contenteditable="false">
            <a contenteditable="false"
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1">
            OVER HERE 
            </a>
            </div>

            <div id='Goal-notes-footer'>
                <Show when={!editNotesMode()}>
                    <span class='borderless-button' onClick={() => setEditNotesMode(true)}>
                        <img src={editIcon}/>
                        Edit notes
                    </span>
                </Show>
                <Show when={editNotesMode()}>
                    <span 
                    class='Goal-scroller-header-button'
                    style={'margin-right: auto;'}
                     onClick={() => setShowPopup('link')}>
                        Add Link <img src={linkIcon}/>
                    </span>

                    <span 
                    class='Goal-scroller-header-button'
                     onClick={() => {
                        didUserWantToSave = true
                        setEditNotesMode(false)
                    }}>
                        Save changes
                    </span>
                    <span 
                    class='Goal-scroller-header-button'
                    onClick={() => {
                        didUserWantToSave = false
                        setEditNotesMode(false)
                    }}> 
                        Cancel
                    </span>
                </Show>
            </div>
        </div>
    )
}