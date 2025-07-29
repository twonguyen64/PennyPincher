import addIcon from '../assets/add.svg'
import AddButton from './AddButton';
import { useMainWrapperContext } from '../contexts/MainWrapperContext'

export default function AccountMenuButtons() {
    const { setEditMode, setShowPopup } = useMainWrapperContext();
    
    const scrollToPagePlusPopup = (popupType) => {
        const pages = document.getElementById('homepage').children
        pages[1].scrollIntoView({
            behavior: 'smooth',
            inline: 'center'
        });
        setEditMode(false)
        setShowPopup(popupType);
    }

    return (
        <div class="AddButton-wrapper">
            <AddButton 
                icon={addIcon} text={'Add paycheque'} 
                onClick={() => scrollToPagePlusPopup('paycheque')}
            />
            <AddButton 
                icon={addIcon} text={'Add expense'} 
                onClick={() => scrollToPagePlusPopup('expense')}
            /> 
        </div>
    );
}