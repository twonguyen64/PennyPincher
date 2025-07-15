import { useMainWrapperContext } from "../contexts/MainWrapperContext";

export default function TransactionCheckbox(props) {
    const { showSelectMultiple } = useMainWrapperContext()
    return (
        <Show when={showSelectMultiple()}>
            <input type="checkbox" data-key={props.key} style={'display: inline'}/>
            <span>{props.key}</span>
        </Show>
    );
}