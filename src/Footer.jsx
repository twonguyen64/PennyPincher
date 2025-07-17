import homebuttonIcon from './assets/home-button.png'
import budgetsheetIcon from './assets/budget-sheet.svg'
export default function Footer() {
    return (
        <div id='footer'>
            <div class='footerButton'>
                <img src={homebuttonIcon}/>
                <div>Home</div>
            </div>
            <div class='footerButton'>
                <img src={budgetsheetIcon}/>
                <div>Budget Sheet</div>
            </div>
        </div>
    );
}