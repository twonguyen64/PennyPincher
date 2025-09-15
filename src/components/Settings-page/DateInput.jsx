import { createSignal } from "solid-js";
import { useMoney } from "../../contexts/MoneyContext";

export default function DateInput(props) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const {payDate} = useMoney();
    
    function initalizeDate() {
        if (payDate()) {
            const date = payDate().split('-')
            return {
                year: date[0],
                month: date[1],
                day: date[2]
            }
        }
         return {
            year: '',
            month: '',
            day: ''
        };
    }
    
    const [paychequeDate] = createSignal(initalizeDate());
    return (
        <div class="DateInput">
            <input 
                ref={props.dayRef}
                type="number" 
                class="DateInput-day"
                value={paychequeDate().day || 1}
            />
            <select value={parseInt(paychequeDate().month)}>
                {months.map((month, index) => (
                    <option key={index} value={index + 1}>{month}</option>
                ))}
            </select>
            <select value={parseInt(paychequeDate().year)}>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
            </select>
        </div>
    )
}