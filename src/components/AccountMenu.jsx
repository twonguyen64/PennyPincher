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
    let heading
    switch (props.type) {
        case 'income':
            heading = 'Money going in'
            break;
        case 'expense':
            heading = 'Money going out';
            break;
    }
    return (
        <div class="account-menu">
            <div class="account-menu-upper-wrapper">
                <span style={'font-weight: bold'}>{heading}</span>
                <div class='edit-button' onClick={goToPage}>
                    <img src={editImg} alt=""/>
                    View {props.name}
                </div>
            </div>
            <AccountMenuType type={props.type}/>
        </div>
    )
}
export default AccountMenu