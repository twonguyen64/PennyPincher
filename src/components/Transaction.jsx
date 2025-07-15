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
                <TransactionCheckbox key={props.key} />
                <span class='Transaction-name'>{props.name}</span>
                <span class='Transaction-amount'>
                <span>{sign} ${props.amount}</span>
            </span>
        </div>
        );
    }
    else return (
        <div class='Transaction'>
            <TransactionCheckbox/>
            <span class='Transaction-name'>{props.name}</span>
            <span class='Transaction-amount'>
                <span style={'opacity: 0.4;'}>{sign} ${props.savings}</span>
                <span>&nbsp&nbsp&nbsp&nbsp&nbsp</span>
                <span style={'opacity: 0.4; display: inline-block; transform: rotateY(180deg);'}>➜</span>
                <span>&nbsp&nbsp&nbsp&nbsp&nbsp</span>
                <span>{sign} ${props.amount}</span>
            </span>
        </div>
    );
}