import { onMount, onCleanup, createSignal } from 'solid-js';
import { getCenterElementOfScroller } from './util-functions';

/**Class name to apply to the elements that allow manual scrolling */
const SWIPE_SCROLL_CLASS = 'swipe-scroll'
const NO_TOUCH_EVENTS_CLASS = 'no-touch-events'
const ANIMATION_DURATION = 500;

const EASING_FUNCTION = (t) => {return (t - 1) * (t - 1) * (t - 1) + 1} //Ease-out

export function usePageColumnScrolling(scrollerRef, pageIndex, setPageIndex) {
    let pagesNodeList;
    let animationFrameId = null;

    const stopAnimation = () => {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    };

    const animateScroll = (startScroll, endScroll, duration) => {
         //Initialize
        const scroller = scrollerRef()
        stopAnimation();

        //Handle scroll containers that allow user to also scroll by swiping
        const scrollerAllowsSwipeScroll = (scroller.classList.contains(SWIPE_SCROLL_CLASS))
        if (scrollerAllowsSwipeScroll) 
            scroller.classList.remove(SWIPE_SCROLL_CLASS)
            scroller.classList.add(NO_TOUCH_EVENTS_CLASS)

        let startTime = 0
        const animate = (currentTime) => {
            if (startTime === 0) {
                startTime = currentTime;
            }
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1); // Clamp progress between 0 and 1
            const easedProgress = EASING_FUNCTION(progress);
            if (scroller) { // Ensure scrollerRef() is available
                scroller.scrollLeft = startScroll + (endScroll - startScroll) * easedProgress;

            }
            if (progress < 1) {
                //Recursive call down until end of animation
                animationFrameId = requestAnimationFrame(animate);
            } else {
                // End of animation
                animationFrameId = null;
                if (scrollerAllowsSwipeScroll) 
                    scroller.classList.add(SWIPE_SCROLL_CLASS)
                    scroller.classList.remove(NO_TOUCH_EVENTS_CLASS)
            }
        };
        animationFrameId = requestAnimationFrame(animate);
    };

    const slideToLeft = () => {
        if (scrollerRef() && pageIndex() > 0) {
            const startScroll = scrollerRef().scrollLeft;
            const newIndex = pageIndex() - 1;
            const targetScroll = newIndex * scrollerRef().clientWidth;

            setPageIndex(newIndex); // Update signal immediately
            animateScroll(startScroll, targetScroll, ANIMATION_DURATION);
        }
    };

    const slideToRight = () => {
        if (scrollerRef() && pageIndex() < pagesNodeList.length - 1) {
            const startScroll = scrollerRef().scrollLeft;
            const newIndex = pageIndex() + 1;
            const targetScroll = newIndex * scrollerRef().clientWidth;

            setPageIndex(newIndex); // Update signal immediately
            animateScroll(startScroll, targetScroll, ANIMATION_DURATION);
        }
    };

    onMount(() => {
        if (!scrollerRef()) return
        //Following code insures that onMount only runs once per page:
        pagesNodeList = scrollerRef().children
        if (pageIndex()) {
            pagesNodeList[pageIndex()].scrollIntoView({
                behavior: 'instant', inline: 'center'
            })
        }
        else {
            const currentPage = getCenterElementOfScroller(scrollerRef())
            const newIndex = Array.from(pagesNodeList).indexOf(currentPage)
            setPageIndex(newIndex)
        }
    })
    onCleanup(() => {
        stopAnimation();
    });

    const snapScrollEnd = () => {
        const pagesNodeList = scrollerRef().children
        const currentPage = getCenterElementOfScroller(scrollerRef())
        if (currentPage !== pagesNodeList[pageIndex()]) {
            const newIndex = Array.from(pagesNodeList).indexOf(currentPage)
            setPageIndex(newIndex)
        }
    };
    
    return {
        slideToLeft,
        slideToRight,
        snapScrollEnd
    }
}
