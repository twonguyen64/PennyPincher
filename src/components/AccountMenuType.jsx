import addIcon from '../assets/add.png'
import transferIcon from '../assets/transfer.png'
import withdrawIcon from '../assets/withdraw.png'
import { useNavigationContext } from '../contexts/NavigationContext'
import { useMainWrapperContext } from '../contexts/MainWrapperContext'

function AccountMenuType(props) {
    const { setSecondPage } = useMainWrapperContext();
    const { setSlideActive, setShowPopup } = useMainWrapperContext();
    
    const goToPagePlusPopup = (popupType, page) => {
        setSlideActive(true);
        setShowPopup(popupType);
        setSecondPage(page);
        
    }

    switch(props.type) {
        case 'income':
            return (
                <div class="account-menu-lower-wrapper">
                    <div class="account-menu-add-button" 
                        onClick={() => goToPagePlusPopup('depositSavings', 'income')}>
                        <img src={transferIcon} alt="+"/>
                        <span>Deposit allowance into savings</span>
                    </div>
                    <div class="account-menu-add-button" 
                        onClick={() => goToPagePlusPopup('depositIncome', 'income')}>
                        <img src={addIcon} alt="+"/>
                        <span>Add income</span>
                    </div>
                </div>
            );
        case 'expense':
            return (
                <div class="account-menu-lower-wrapper">
                    <div class="account-menu-add-button" 
                        onClick={() => goToPagePlusPopup('withdrawSavings', 'expense')}>
                        <img src={withdrawIcon} alt="-"/>
                        <span>Withdraw amount from savings</span>
                    </div>
                    <div class="account-menu-add-button" 
                        onClick={() => goToPagePlusPopup('withdrawExpense', 'expense')}>
                        <img src={addIcon} alt="+"/>
                        <span>Add expense</span>
                    </div>    
                </div>
            );
    }
}
export default AccountMenuType