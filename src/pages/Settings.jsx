import { createSignal } from "solid-js";
import { useMoney } from "../contexts/MoneyContext";
import DateInput from "../components/Settings-page/DateInput";
import Download from "../components/Settings-page/Download";

export default function Settings() {
    const { payFreq } = useMoney();
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
                <div class='Settings-field'>
                    <span class='Settings-field-label'>
                        <span class='Settings-field-label-subtext'>
                            The data in this app is tied to your browser. 
                            If your browser's data is cleared, your account will be deleted too.
                            <br></br><br></br>
                            It's recommended that you keep a backup copy of your data as a precaution.
                        </span>
                    </span>
                    <span class='Settings-field-input'>
                        <Download/>
                    </span>
                </div>
                <div class='Settings-field'></div>
            </div>
        </div>
    )
}