import viewIcon from '../assets/view.svg'
import addIcon from '../assets/add.svg'
import AddButton from './AddButton';

import { useMainWrapperContext } from '../contexts/MainWrapperContext';
import { usePageColumnScrolling } from "../utils/PageColumnScrolling";

export default function AccountMenu() { 
    const { pageIndex, pageIndexSetter, setEditMode, setShowPopup } = useMainWrapperContext();

    const { slideToRight } = usePageColumnScrolling(
        () => document.getElementById('Homepage'), 
        () => pageIndex().home, 
        pageIndexSetter.home
    );

    const scrollToPagePlusPopup = (popupType) => {
        slideToRight();
        setEditMode(false);
        setShowPopup(popupType);
    }

    return (
        <div class="account-menu">
            <div class="account-menu-header">
                <span style={'font-weight: bold'}>TITLE</span>
                <div class='edit-button' onClick={slideToRight}>
                    <img src={viewIcon} alt=""/>
                    View Transactions
                </div>
            </div>
            
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
        </div>
    )
}