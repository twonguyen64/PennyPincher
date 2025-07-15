import addImg from '../assets/add.png'
import { useNavigationContext } from '../contexts/NavigationContext'
import { useMainWrapperContext } from '../contexts/MainWrapperContext'

function AccountMenuType(props) {
    const { navigate } = useNavigationContext();
    const { setSlideActive, setShowPopup } = useMainWrapperContext();
    
    const goToPage = () => {
        if (navigate) {
            navigate('/' + props.type);
            setSlideActive(true);
            setShowPopup(false);
        }
    };
    const goToPagePlusKeyboardPopup = () => {
        if (navigate) {
            navigate('/' + props.type);
            setSlideActive(true);
            setShowPopup(true);
        }
    }

    if (props.type === 'income') {
        return (
        <div class="account-menu-lower-wrapper">
            <div class="account-menu-add-button" onClick={goToPagePlusKeyboardPopup}>
                <img src={addImg} alt="+"/>
                <span>Add income</span>
            </div>
        </div>
    );
    }

    else if (props.type === 'expenses') {
        return (
            <div class="account-menu-lower-wrapper">
                <div class="account-menu-add-button" onClick={goToPage}>
                    <img src={addImg} alt="+"/>
                    <span>Add recurring expense</span>
                </div>
                <div class="account-menu-add-button" onClick={goToPage}>
                    <img src={addImg} alt="+"/>
                    <span>Add single expense</span>
                </div>    
            </div>
        )
    }
}
export default AccountMenuType