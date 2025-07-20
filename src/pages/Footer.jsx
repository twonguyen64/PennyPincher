import homebuttonIcon from '../assets/home-button.png'
import budgetsheetIcon from '../assets/budget-sheet.svg'
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
            <div class='footerButton' onClick={() => routeTo('/budget')}>
                <img src={budgetsheetIcon}/>
                <div>Budget Sheet</div>
            </div>
        </div>
    );
}