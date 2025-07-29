import { useMainWrapperContext } from "../contexts/MainWrapperContext";
import gobackIcon from '../assets/goback.svg';
import Summary from './Summary';
import Transactions from './Transactions';
import BackgroundBlur from "../components/BackgroundBlur";
import { onMount } from "solid-js";
import { getCenterElementOfScroller } from "../utils/util-functions";


export default function MainHome() {
    const {currentScrollPageID, setCurrentScrollPageID} = useMainWrapperContext();
    let scrollerRef, firstPage;

    onMount(() => {
        if (currentScrollPageID()) {
            document.getElementById(currentScrollPageID()).scrollIntoView({
                behavior: 'instant', inline: 'center'
            })
        }
    })
    const slideBack = () => {
        firstPage.scrollIntoView({
            behavior: 'smooth', inline: 'center'
        });
    };

    const scrollEnd = () => {
        const currentPage = getCenterElementOfScroller(scrollerRef)
        if (currentPage.id !== currentScrollPageID()) {
            setCurrentScrollPageID(currentPage.id)
            console.log(currentScrollPageID())
        }
    };

    return (
        <>
        <BackgroundBlur/>
        <div 
            id='homepage'
            ref={scrollerRef}
            class="page-multi" 
            ontouchstart=""
            onScrollEnd={scrollEnd}
        >
            <div class="page-single" id="homepage-1" ref={firstPage}>
                <Summary/>
            </div>
            <div class="page-single" id="homepage-2">
                <img id='backButton' src={gobackIcon} onClick={slideBack}/>
                <Transactions/>
            </div>
        </div>
        </>
    )
}