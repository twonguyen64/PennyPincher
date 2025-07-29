import { useMainWrapperContext } from "../../contexts/MainWrapperContext";

export default function EditModeCheckbox() {
    const { editMode } = useMainWrapperContext()
    return (
        <Show when={editMode()}>
            <input 
                class="editModeCheckbox"
                type="checkbox" 
                style={'display: inline'}
            />
        </Show>
    );
}