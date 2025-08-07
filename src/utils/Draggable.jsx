import { createSignal, onCleanup } from "solid-js";

export function useDraggable() {
    const [position, setPosition] = createSignal({ x: 0, y: 0 });
    const [initialPosition, setInitialPosition] = createSignal({ x: 0, y: 0 });
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    const getInitialPosition = (element) => {
        const rect = element.getBoundingClientRect();
        const containerRect = element.parentElement.getBoundingClientRect();

        const initialLeft = rect.left - containerRect.left;
        const initialTop = rect.top - containerRect.top;

        setInitialPosition({ x: initialLeft, y: initialTop });
    };

    // Start the drag operation
    const onTouchStart = (e, element) => {
        isDragging = true;
        const touch = e.touches[0];

        // Set initial drag position based on the touch
        startX = touch.clientX - position().x;
        startY = touch.clientY - position().y;

        // Set the element to absolute positioning
        element.style.position = 'absolute';

        // Capture initial position once when drag starts
        getInitialPosition(element);
        e.preventDefault(); // Prevent default action, like scrolling
    };

    // Move the element as the user drags
    const onTouchMove = (e) => {
        if (isDragging) {
        const touch = e.touches[0];
        setPosition({
            x: touch.clientX - startX,
            y: touch.clientY - startY,
        });
        }
    };

    // End the drag operation
    const onTouchEnd = () => {
        isDragging = false;
        document.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("touchend", onTouchEnd);
    };

      // Attach listeners to an element
  const attachListeners = (element) => {
    element.addEventListener("touchstart", (e) => onTouchStart(e, element), { passive: false });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);
  };

    return { position, initialPosition, attachListeners };
}