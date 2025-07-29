import { createEffect, Show } from "solid-js";
import { useMainWrapperContext } from "../contexts/MainWrapperContext";

export default function BackgroundBlur() {
    const { showPopup } = useMainWrapperContext();
    let blurRef

    createEffect(() => {
        if (showPopup() != '' && showPopup() != 'transfer') {
            if (blurRef)
                setTimeout(() => {
                    blurRef.classList.add('blur')
                }, 10);
        }
    });
    return (
        <Show when={(showPopup() != '' && showPopup() != 'transfer')}>
            <div class='background background-blur' ref={blurRef}/>
        </Show>
    );
}