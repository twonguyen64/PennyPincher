import viewImg from '../assets/view.svg'
import AccountMenuButtons from './AccountMenuButtons';


export default function AccountMenu() { 
    const scrollToPage = () => {
        const pages = document.getElementById('homepage').children
        pages[1].scrollIntoView({
            behavior: 'smooth',
            inline: 'center'
        });
    }

    return (
        <div class="account-menu">
            <div class="account-menu-header">
                <span style={'font-weight: bold'}>TITLE</span>
                <div class='edit-button' onClick={scrollToPage}>
                    <img src={viewImg} alt=""/>
                    View Transactions
                </div>
            </div>
            <AccountMenuButtons/>
        </div>
    )
}