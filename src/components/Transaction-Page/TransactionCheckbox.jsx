import { useMainWrapperContext } from "../../contexts/MainWrapperContext";

export default function TransactionCheckbox(props) {
    const { editMode } = useMainWrapperContext()
    return (
        <Show when={editMode()}>
            <input 
                type="checkbox" 
                index={props.index} 
                style={'display: inline'}
            />
        </Show>
    );
}