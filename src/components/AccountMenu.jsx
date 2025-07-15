import editImg from '../assets/edit-three-dots.png'
import AccountMenuType from './AccountMenuType'

import { useNavigationContext } from '../contexts/NavigationContext'
import { useMainWrapperContext } from '../contexts/MainWrapperContext'

function AccountMenu(props) {
    const { navigate } = useNavigationContext();
    const { setSlideActive } = useMainWrapperContext();
    
    const goToPage = () => {
        if (navigate) {
            navigate('/' + props.type);
            setSlideActive(true);
        }
    };

    return (
        <div class="account-menu">
            <div class="account-menu-upper-wrapper">
                <div class='edit-button' onClick={goToPage}>
                    <img src={editImg} alt=""/>
                    Edit {props.name}
                    </div>
            </div>
            <AccountMenuType type={props.type}/>
        </div>
    )
}
export default AccountMenu