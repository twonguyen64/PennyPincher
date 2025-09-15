import { onCleanup, onMount } from "solid-js"
import { useMainWrapperContext } from "../contexts/MainWrapperContext";

export default function usePopup() {
    console.log('starting')
    const { setShowPopup } = useMainWrapperContext();
    let popupRef
    onMount(() => {
        popupRef = document.querySelector('.popup-wrapper')
        console.log(popupRef)
        setTimeout(() => {popupRef.classList.add('active')}, 10)
    });

    const exitPopup = () => {
        popupRef.classList.remove('active')
        popupRef.addEventListener('transitionend', popupTransitionEnd, {once: true})
    }
    const popupTransitionEnd = () => {
        const isActive = popupRef.classList.contains('active')
        if (!isActive) setShowPopup('')
    }
    onCleanup(() => {
        popupRef.removeEventListener("transitionend", popupTransitionEnd, {once: true});
    });

    return {exitPopup}
}