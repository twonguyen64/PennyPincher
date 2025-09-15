import homebuttonIcon from '../assets/home-button.svg'
import savingsIcon from '../assets/savings.svg'
import budgetsheetIcon from '../assets/budget-sheet.svg'
import settingsIcon from '../assets/settings.svg'
import { useNavigationContext } from '../contexts/NavigationContext'
export default function Footer() {
    const { navigate } = useNavigationContext();

    const routeTo = (route) => {
        if (navigate) navigate(route);
    }
    return (
        <div id='footer'>
            <div class='footerButton' onClick={() => routeTo('/')}>
                <img src={homebuttonIcon}/>
                <div>Home</div>
            </div>
            <div class='footerButton' onClick={() => routeTo('/savings')}>
                <img src={savingsIcon}/>
                <div>Savings</div>
            </div>
            <div class='footerButton' onClick={() => routeTo('/budget')}>
                <img src={budgetsheetIcon}/>
                <div>Budget Sheet</div>
            </div>
            <div class='footerButton' onClick={() => routeTo('/settings')}>
                <img src={settingsIcon}/>
                <div>Settings</div>
            </div>
        </div>
    );
}