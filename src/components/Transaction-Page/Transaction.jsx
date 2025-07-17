import TransactionCheckbox from './TransactionCheckbox'

export default function Transaction(props) {
    let sign;
    switch(props.type) {
        case 'income':
            sign = ''
            break;
        case 'expense':
            sign = '–'
            break;
    }

    if (props.savings == 0 || isNaN(props.savings)) {
        return (
            <div class='Transaction'>
                <span class='Transaction-name'>
                    <TransactionCheckbox index={props.index}/>
                    <span>{props.name}</span>
                </span>
                <span class='Transaction-amount'>
                    <span>{sign} ${props.amount}</span>
                </span>
                <span class='Transaction-savings'></span>
            </div>
        );
    }
    else if (props.amount == 0 || isNaN(props.amount)) {
        return (
            <div class='Transaction'>
                <span class='Transaction-name'>
                    <TransactionCheckbox index={props.index}/>
                    <span>{props.name}</span>
                </span>
                <span class='Transaction-amount'></span>
                <span class='Transaction-savings'>
                    <span>↪</span> 
                    <span class='Transaction-savings-value'>{sign} ${props.savings}</span>
                </span>
            </div>
        );
    }
    else return (
        <div class='Transaction'>
            <span class='Transaction-name'>
                <TransactionCheckbox index={props.index}/>
                <span>{props.name}</span>
            </span>
            <span class='Transaction-amount'>{sign} ${props.amount}</span>
            <span class='Transaction-savings'> 
                <span>↪</span> 
                <span class='Transaction-savings-value'>{sign} ${props.savings}</span>
            </span>
        </div>
    );
}