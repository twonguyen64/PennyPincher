import { createSignal } from "solid-js";
import DateInput from "../utils/DateInput"
import { useMoney } from "../contexts/MoneyContext";

export default function Settings() {
    const { payFreq } = useMoney();
    let dayRef, monthRef, yearRef;
    const [payDate, setPayDate] = createSignal(null)

    return (
        <div class='page-single' id="Settings-page" ontouchstart="">
            <div id='Settings-header'>
                Settings
                <span id='Settings-header-buttons'>
                    <span>Undo</span>
                    <span>Save</span>
                </span>
            </div>
            <div id='Settings-wrapper'>
                <div class='Settings-field'>
                    <span class='Settings-field-label'>
                        Date of next paycheque
                        <span class='Settings-field-label-subtext'>
                            Will update automatically based on your pay frequency.
                        </span>
                    </span>
                    <span class='Settings-field-input'>

                        <DateInput
                            payDate={payDate}
                            setPayDate={setPayDate}
                        />
                        <span style={'font-size: 0.9rem; font-weight: bold; text-align: right'}>
                            {`( ${payFreq().string} )`}
                        </span>
                    </span>
                </div>
                <div class='Settings-field'></div>
                <div class='Settings-field'></div>
            </div>
        </div>
    )
}