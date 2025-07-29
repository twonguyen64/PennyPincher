import { createMemo } from "solid-js";

export default function AccountDisplay(props) {
    const signMemo = createMemo(() => {
        let balance = props.balance;
        let sign = '';
        if (balance < 0) sign = '–'
        return sign;
    });

    return (
        <div class={"account-display " + props.colorFor}>
            <div class="account-name">{props.name}</div>
            <div class="account-balance"><span class="currencysign">{signMemo()} $</span>{Math.abs(props.balance)}</div>
        </div>
    )
}