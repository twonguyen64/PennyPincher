function AccountDisplay(props) {
    let sign;
    switch (props.type) {
        case 'income':
            sign = ''
            break;
        case 'expense':
            sign = '–'
            break
    }

    return (
        <div class="account-display"
        style={{
            "background-color": props.backgroundColor || "#cceeff",
        }}
        >
            <div class="account-name">{props.name}</div>
            <div class="account-balance">{sign}<span class="currencysign"> $</span>{props.balance}</div>
        </div>
    )
}
export default AccountDisplay