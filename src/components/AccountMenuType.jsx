import addIcon from '../assets/add.png'
import transferIcon from '../assets/transfer.png'
import withdrawIcon from '../assets/withdraw.png'
import { useNavigationContext } from '../contexts/NavigationContext'
import { useMainWrapperContext } from '../contexts/MainWrapperContext'

function AccountMenuType(props) {
    const { navigate } = useNavigationContext();
    const { setSlideActive, setShowPopup } = useMainWrapperContext();
    
    const goToPagePlusKeyboardPopup = (popupType, route) => {
        if (navigate) {
            navigate(route);
            setSlideActive(true);
            setShowPopup(popupType);
        }
    }

    switch(props.type) {
        case 'income':
            return (
                <div class="account-menu-lower-wrapper">
                    <div class="account-menu-add-button" 
                        onClick={() => goToPagePlusKeyboardPopup('depositSavings', '/income')}>
                        <img src={transferIcon} alt="+"/>
                        <span>Deposit allowance into savings</span>
                    </div>
                    <div class="account-menu-add-button" 
                        onClick={() => goToPagePlusKeyboardPopup('depositIncome', '/income')}>
                        <img src={addIcon} alt="+"/>
                        <span>Add income</span>
                    </div>
                </div>
            );
        case 'expense':
            return (
                <div class="account-menu-lower-wrapper">
                    <div class="account-menu-add-button" 
                        onClick={() => goToPagePlusKeyboardPopup('withdrawSavings', '/expenses')}>
                        <img src={withdrawIcon} alt="-"/>
                        <span>Withdraw amount from savings</span>
                    </div>
                    <div class="account-menu-add-button" 
                        onClick={() => goToPagePlusKeyboardPopup('withdrawExpense', '/expenses')}>
                        <img src={addIcon} alt="+"/>
                        <span>Add expense</span>
                    </div>    
                </div>
            );
    }
}
export default AccountMenuType