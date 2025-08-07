import SavingsGoal from "./SavingsGoal"

export default function GoalScrollerColumn(props) {
    const SCROLL_DELAY = 400
    const INSERT_DELAY = 100
    const INIT_TOUCH_DELAY = 600

    const SPACER_CLASS = 'Goal-sort-spacer'
    const SHRINK_CLASS = 'shrink'
    const SHIFT_LEFT_CLASS = 'shift-left'
    const SHIFT_RIGHT_CLASS = 'shift-right'

    let dragContainerRef, scrollerRef, slotRef;
    //dragContainer is the grandparent, scrollRef is the parent (relative to goal)
    
    //Element References
    let placeholder = null
    let prevSpacer = null

    //Conditionals
    let isDragging = false;
    let readyToInsert = false

    //Timers
    let holdTimer = null;
    let hoverTimer = null;
    let scrollTimer = null; 
    let scrollInterval = null;

    function handleTouchStart(e) {
        if (!e.target.classList.contains('Goal')) return;
        e.preventDefault();
        holdTimer = setTimeout(() => {moveGoal(e)}, INIT_TOUCH_DELAY);
        dragContainerRef.addEventListener('touchmove', handleTouchMove, { passive: false });
        dragContainerRef.addEventListener('touchend', handleTouchEnd, { once: true });
        dragContainerRef.addEventListener('touchcancel', handleTouchEnd, { once: true });
    }
    function handleTouchMove(e) {
        if (isDragging) {
            onDrag(e);
            scrollMove(e);
        } 
        else if (holdTimer) {
            clearTimeout(holdTimer);
            holdTimer = null;
        }
    }

    function handleTouchEnd(e) {
        if (holdTimer) clearTimeout(holdTimer);
        if (hoverTimer) clearTimeout(hoverTimer);
        if (scrollTimer) clearTimeout(scrollTimer);
        if (scrollInterval) clearInterval(scrollInterval);
        if (isDragging) onDragEnd(e);
        holdTimer = null;
        hoverTimer = null;
        scrollTimer = null;
        scrollInterval = null;
        placeholder = null;
        prevSpacer = null;
        isDragging = false;
        dragContainerRef.removeEventListener('touchmove', handleTouchMove, { passive: false });
        dragContainerRef.removeEventListener('touchend', handleTouchEnd, { once: true });
        dragContainerRef.removeEventListener('touchcancel', handleTouchEnd, { once: true });
    }

    function moveGoal(e) {
        isDragging = true;
        scrollerRef.style.scrollSnapType = 'none'
        e.target.style.position = 'absolute'

        const mouseX = e.touches[0].clientX
        const mouseY = e.touches[0].clientY
        const containerRect = dragContainerRef.getBoundingClientRect()
        dragElementWithMouse(e.target, containerRect, mouseX, mouseY)

        if (e.target.parentNode === scrollerRef) {
            placeholder = document.createElement('div')
            placeholder.classList.add('Goal-placeholder')
            scrollerRef.replaceChild(placeholder, e.target);

            //Shrink placeholder and left-side spacer
            //Gives the appearance of the item moving away
            setTimeout(() => {
                placeholder.classList.add(SHRINK_CLASS)
                placeholder.previousElementSibling.classList.add(SHRINK_CLASS)
            }, 20)
        }
        dragContainerRef.appendChild(e.target)
        console.log(placeholder)
    }

    function onDrag(e) {
        // Prevent default scrolling
        e.preventDefault(); 
        
        // Update position of element
        const mouseX = e.touches[0].clientX
        const mouseY = e.touches[0].clientY
        const containerRect = dragContainerRef.getBoundingClientRect();
        dragElementWithMouse(e.target, containerRect, mouseX, mouseY)
        
        //Conditionals:
        const eleUnderMouse = document.elementFromPoint(mouseX, mouseY);
        const isSpacer = 
        (eleUnderMouse && eleUnderMouse.classList.contains(SPACER_CLASS))

        //If mouse has hovered over a new spacer
        if (isSpacer && eleUnderMouse !== prevSpacer) {
            if (hoverTimer) clearTimeout(hoverTimer);
            
            prevSpacer = eleUnderMouse
            hoverTimer = setTimeout(() => {
                makeSpaceAroundElement(prevSpacer, 'add')
                readyToInsert = true
                hoverTimer = null;
            }, INSERT_DELAY);
        }
        // If mouse has moved away from the previous spacer
        else if (!isSpacer && prevSpacer) {
            if (hoverTimer) clearTimeout(hoverTimer);
            makeSpaceAroundElement(prevSpacer, 'remove')
            readyToInsert = false
            prevSpacer = null;
        }
    }

    function onDragEnd(e) {
        const slotRect = slotRef.getBoundingClientRect();
        const endTouchX = e.changedTouches[0].clientX;
        const endTouchY = e.changedTouches[0].clientY;

        //Case: goal is dropped onto the placeholder
        if (
            endTouchX >= slotRect.left &&
            endTouchX <= slotRect.right &&
            endTouchY >= slotRect.top &&
            endTouchY <= slotRect.bottom
        ) {
            slotRef.appendChild(e.target)
            placeholder.previousElementSibling.remove()
            placeholder.remove()
            scrollerRef.style.scrollSnapType = '';
        }
        //Case: goal is dropped on a spacer
        else if (readyToInsert && prevSpacer) {
            const newSpacer = document.createElement('div')
            newSpacer.classList.add(SPACER_CLASS, SHRINK_CLASS)
            setTimeout(() => {
                newSpacer.classList.remove(SHRINK_CLASS)
                scrollToGoal(e.target, scrollerRef)
            }, 20)

            prevSpacer.insertAdjacentElement('beforebegin', newSpacer)
            prevSpacer.insertAdjacentElement('beforebegin', e.target)
            e.target.removeAttribute('style');
            
            console.log(placeholder)
            if (placeholder) {
                placeholder.previousElementSibling.remove()
                placeholder.remove()
            }

            if (hoverTimer) clearTimeout(hoverTimer);
            makeSpaceAroundElement(prevSpacer, 'remove')
            readyToInsert = false
            prevSpacer = null;
            return
        }
        //Goal is dropped anywhere else
        else {
            if (placeholder) {
                placeholder.previousElementSibling.classList.remove(SHRINK_CLASS)
                scrollerRef.replaceChild(e.target, placeholder)
                placeholder.remove()
                scrollerRef.style.scrollSnapType = '';
            }
            else slotRef.appendChild(e.target)
            scrollerRef.style.scrollSnapType = '';
        }
        e.target.removeAttribute('style');
    }

    function scrollMove(e) {
        const edgeThreshold = 40; //pixels from edge
        const scrollSpeed = 6; //pixels per interval
        const interval = 12;
        const containerRect = dragContainerRef.getBoundingClientRect();

        const touchX = e.touches[0].clientX;
        const isCloseToLeft = touchX <= containerRect.left + edgeThreshold;
        const isCloseToRight = touchX >= containerRect.right - edgeThreshold;

        if (!isCloseToLeft && !isCloseToRight) {
            if (scrollInterval !== null) {
                clearInterval(scrollInterval);
                scrollInterval = null;
            }
            if (scrollTimer !== null) {
                clearTimeout(scrollTimer);
                scrollTimer = null;
            }
        }
        if (scrollInterval === null && scrollTimer === null) {
            if (isCloseToLeft) {
                scrollTimer = setTimeout(() => {
                    scrollInterval = setInterval(() => { 
                        scrollerRef.scrollLeft -= scrollSpeed; 
                    }, interval);
                }, SCROLL_DELAY);
            } 
            else if (isCloseToRight) {
                scrollTimer = setTimeout(() => {
                    scrollInterval = setInterval(() => { 
                        scrollerRef.scrollLeft += scrollSpeed; 
                    }, interval);
                }, SCROLL_DELAY);
            }
        }
    }

    /**
     * @param {HTMLElement} targetElement 
     * @param {Number} mouseX 
     * @param {Number} mouseY 
     */
    function dragElementWithMouse(targetEle, containerRect, mouseX, mouseY) {
        const posX = mouseX - containerRect.left - targetEle.offsetWidth / 2
        const posY = mouseY - containerRect.top - targetEle.offsetHeight / 2
        targetEle.style.left = `${posX}px`;
        targetEle.style.top = `${posY}px`;
    }

    function getAdjacentSiblings(centerElement) {
        const leftSiblings = [];
        let currentLeft = centerElement.previousElementSibling;
        while (currentLeft) {
            leftSiblings.unshift(currentLeft);
            currentLeft = currentLeft.previousElementSibling;
        }

        const rightSiblings = [];
        let currentRight = centerElement.nextElementSibling;
        while (currentRight) {
            rightSiblings.push(currentRight);
            currentRight = currentRight.nextElementSibling;
        }

        return {
            left: leftSiblings,
            right: rightSiblings
        };
    }

    /**
     * @param {HTMLElement} centerElement 
     * @param {String} addOrRemove Either 'add' or 'remove'
     */
    function makeSpaceAroundElement(centerElement, addOrRemove) {
        const siblings = getAdjacentSiblings(centerElement)
        switch (addOrRemove) {
            case 'add':
                for (const ele of siblings.left) ele.classList.add(SHIFT_LEFT_CLASS)
                for (const ele of siblings.right) ele.classList.add(SHIFT_RIGHT_CLASS)
            break;
            case 'remove':
                for (const ele of siblings.left) ele.classList.remove(SHIFT_LEFT_CLASS)
                for (const ele of siblings.right) ele.classList.remove(SHIFT_RIGHT_CLASS)
            break;
        }
    }

    /**Centers scroller on the middle element after being inserted back into the list */
    function scrollToGoal(item, container) {
        //Important since spacer width affects the end result
        const rootStyles = getComputedStyle(document.documentElement);
        const spacerWidthRem = rootStyles.getPropertyValue('--goal-sort-spacer-size');
        const fontSize = rootStyles.getPropertyValue('font-size')
        const spacerWidthPx = parseFloat(fontSize) * parseFloat(spacerWidthRem)

        const itemLeft = item.offsetLeft || 0;
        const itemWidth = item.offsetWidth || 0;
        const containerWidth = container.offsetWidth || 0;

        const newScrollLeft = itemLeft + (itemWidth / 2) - (containerWidth / 2)
        container.scrollTo({
            left: newScrollLeft + spacerWidthPx,
            top: 0,
            behavior: 'smooth'
        });

        container.addEventListener('scrollend', () => {
            container.style.scrollSnapType = '';
        }, {once: true})
    }

    return (
        <div 
        id="Goals-scroller-column-wrapper"
        ontouchstart={handleTouchStart}
        ref={dragContainerRef}>
            <div 
            id="Goals-scroller-column" 
            class="hidden-scrollbar" 
            ref={scrollerRef}
            >
                <div class={SPACER_CLASS}></div>
                
                <For each={props.goals}>
                    {(goal) => (
                        <>
                        <SavingsGoal
                        objectID={goal.id}
                        name={goal.name}
                        target={goal.target}
                        balance={goal.balance}
                        />
                        <div class={SPACER_CLASS}></div>
                        </>
                    )}
                </For>
            </div>
            <div id="Goal-scroller-slot-wrapper">
                <div id="Goal-scroller-slot" ref={slotRef}></div>
            </div>
        </div>
    )
}