import EditModeCheckbox from './Checkbox'
export default function Transaction(props) {
    return (
        <div class={`Transaction ObjectContainer ${props.type}`} objectID={props.objectID}>
            <span class='Transaction-name-tag-wrapper'>
                <EditModeCheckbox/>
                <span class='Transaction-name-tag'>
                    <span>{props.name}</span>
                    {(props.tag && props.tag !== 'PAYCHEQUE') && 
                        <span class='tag'>{props.tag}</span>
                    }
                </span>
            </span>
            <span class='Transaction-income'>
                {props.income && (
                    <>
                        <span>＋ $</span>
                        <span>{props.income}</span>
                    </>
                )}
            </span>
            <span class='Transaction-expense'>
                {props.expense && (
                    <>
                        <span>– $</span>
                        <span>{props.expense}</span>
                    </>
                )}
            </span>
        </div>
    );
}