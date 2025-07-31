import { useMainWrapperContext } from "../contexts/MainWrapperContext";
import Summary from './Summary';
import Transactions from './Transactions';
import BackgroundBlur from "../components/BackgroundBlur";

import gobackIcon from '../assets/goback.svg';
import { usePageColumnScrolling } from "../utils/PageColumnScrolling";

export default function MainHome() {
    let scrollerRef
     
    const { pageIndex, pageIndexSetter } = useMainWrapperContext();
    const { slideToLeft, snapScrollEnd } = usePageColumnScrolling(
        () => scrollerRef, () => pageIndex().home, pageIndexSetter.home
    );

    return (
        <>
        <BackgroundBlur/>
        <div 
            id='Homepage'
            ref={scrollerRef}
            class="page-multi scroll" 
            ontouchstart=""
            onScrollEnd={snapScrollEnd}
        >
            <div class="page-single">
                <Summary/>
            </div>
            <div class="page-single">
                <img id='backButton' src={gobackIcon} onClick={slideToLeft}/>
                <Transactions/>
            </div>
        </div>
        </>
    )
}
//<div onClick={slideRight}>CLICK ME</div>