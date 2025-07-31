import gobackIcon from '../../assets/goback.svg';
import { useMainWrapperContext } from '../../contexts/MainWrapperContext';
import { usePageColumnScrolling } from "../../utils/PageColumnScrolling"

export default function PaymentPlanSummary() {
    const { pageIndex, pageIndexSetter } = useMainWrapperContext();
    const { slideToLeft } = usePageColumnScrolling(
        () => document.getElementById('Savingspage'), 
        () => pageIndex().savings, 
        pageIndexSetter.savings
    );

    return (
        <>
        <img id='backButton' src={gobackIcon} onClick={slideToLeft}/>
        </>
    )
}