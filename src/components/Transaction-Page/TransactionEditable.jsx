export default function TransactionEditable(props) {
    let sign;
    let savingsType;
    switch(props.type) {
        case 'income':
            sign = ''
            savingsType = 'Savings deposit'
            break;
        case 'expense':
            sign = '–'
            savingsType = 'Savings withdrawl'
            break;
    }

    if (props.savings == 0 || isNaN(props.savings)) {
        return (
            <div class='Transaction' id="Editable-Transaction">
            <span class='Transaction-name'>
                <input id="Editable-Transaction-name" type="text" value={props.name}/>
            </span>
            <span class='Transaction-amount'>{sign} $<input id="Editable-Transaction-amount" type="number" value={props.amount}/></span>
            <span class='Transaction-savings'><input id="Editable-Transaction-savings" class='hidden' type='number' value={0}/></span>
        </div>
        );
    }
    else if (props.amount == 0 || isNaN(props.amount)) {
        return (
           <div class='Transaction' id="Editable-Transaction">
            <span class='Transaction-name'>
                <input id="Editable-Transaction-name" type="text" value={props.name}/>
            </span>
            <span class='Transaction-amount'><input id="Editable-Transaction-amount" class='hidden' type='number' value={0}/></span>
            <span class='Transaction-savings'> 
                <span>↪</span> 
                <span class='Transaction-savings-value'>{sign} $<input id="Editable-Transaction-savings" type="number" value={props.savings}/></span>
            </span>
        </div>
        );
    }
    else return (
        <div class='Transaction' id="Editable-Transaction">
            <span class='Transaction-name'>
                <input id="Editable-Transaction-name" type="text" value={props.name}/>
            </span>
            <span class='Transaction-amount'>{sign} $<input id="Editable-Transaction-amount" type="number" value={props.amount}/></span>
            <span class='Transaction-savings'> 
                <span>↪</span> 
                <span class='Transaction-savings-value'>{sign} $<input id="Editable-Transaction-savings" type="number" value={props.savings}/></span>
            </span>
        </div>
    );
}