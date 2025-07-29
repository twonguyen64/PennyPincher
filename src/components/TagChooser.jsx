import addImg from '../assets/add.svg'
import { Show, For, createSignal, createEffect } from 'solid-js';
import { useMoney } from '../contexts/MoneyContext';
import { useMainWrapperContext } from '../contexts/MainWrapperContext';

export default function TagChooser(props) {
    const { transactionTags, addTransactionTag } = useMoney();
    const  { setSelectedTag } = useMainWrapperContext();
    const [showAddTagMenu, setShowAddTagMenu] = createSignal(false)
    let TagChooserWrapper, TagChooserInput, addTag, tagInput;
    

    createEffect(() => {
        if (TagChooserInput) {
            if (showAddTagMenu()) TagChooserInput.classList.add('active')
            else TagChooserInput.classList.remove('active')
        }
    })

    const addNewTag = () => {
        if (tagInput.value == '') return
        addTransactionTag(tagInput.value)
        //Reset menu
        tagInput.value = ''
        setShowAddTagMenu(false)
    }
    const selectTag = (e) => {
        const oldSelectedTag = TagChooserWrapper.querySelector('.selected')
        if (e.target.classList.contains('tag')) {
            if (oldSelectedTag) {
                oldSelectedTag.classList.remove('selected')
                if (oldSelectedTag != e.target) {
                    e.target.classList.add('selected')
                    setTagSignal(e.target.textContent)
                }
                else setTagSignal('')
            }
            else {
                e.target.classList.add('selected')
                setTagSignal(e.target.textContent)
            }

        }
    }
    const setTagSignal = (tag) => {
        if (!props.hasAddFunctionality) setSelectedTag(tag)
    }

    return (
        <div class="TagChooser-wrapper" ref={TagChooserWrapper}> 
            <div class="TagChooser" ref={props.ref} onClick={selectTag}>
                <For each={transactionTags()}>
                    {(tag) => {
                        return (
                            <span class='tag'>{tag}</span>
                        );
                    }}
                </For>
                <Show when={props.hasAddFunctionality}>
                    <div class='addTag' ref={addTag} onClick={() => setShowAddTagMenu(true)}>
                        <img src={addImg}></img>
                        <div>Add tag</div>
                    </div>
                </Show>
            </div>
            <Show when={props.hasAddFunctionality}>
                <div class='TagChooser-input' ref={TagChooserInput}>
                    <input type='text' placeholder='New tag name' ref={tagInput}/>
                    <button type="button" onClick={() => setShowAddTagMenu(false)}>Cancel</button>
                    <button type="button" onClick={addNewTag}>Add Tag</button>
                </div>
            </Show>
        </div>
    );
}