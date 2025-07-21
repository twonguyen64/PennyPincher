import { dateToStr } from "../../helperFunctions";

export default function TransactionDate(props) {
    return (
        <div class='Transaction-List-date'>
            <span>{dateToStr(props.date)}</span>
        </div>
    )
}