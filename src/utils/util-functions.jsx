import { PaymentPlan } from './Classes'

export function getObjectFromCheckbox(objectArray) {
    const checkbox = document.querySelector('.editModeCheckbox:checked')
    const objectContainer = checkbox.closest('.ObjectContainer')
    const objectID = parseInt(objectContainer.getAttribute('objectID'), 10)
    let object = objectArray.find(object => object.id === objectID)
    return object
}

/**
 * @param {HTMLElement} scrollContainer 
 * @returns {HTMLElement}
 */
export function getCenterElementOfScroller(scrollContainer) {
    const containerRect = scrollContainer.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestElement = null;
    let minDistance = Infinity;
    for (const child of scrollContainer.children) {
        const childRect = child.getBoundingClientRect();
        
        // Check if child is within vertical bounds of container, otherwise, skip
        if (childRect.right > containerRect.left && childRect.left < containerRect.right) {
            const childCenter = childRect.left + childRect.width / 2;
            const distance = Math.abs(childCenter - containerCenter);
            if (distance < minDistance) {
                minDistance = distance;
                closestElement = child;
            }
        }
    };
    return closestElement;
}
/**
 * @param {HTMLElement} objectElement 
 * @param {AccessorArray} signalArray 
 * @returns {Object}
 */
export function getObjectFromElement(objectElement, signalArray) {
    const objectID = objectElement.getAttribute('objectid')
    if (objectID === null) return null
    const id = parseInt(objectID)
    const object = signalArray.find(obj => obj.id === id); signalArray.find(obj => obj.id === objectID);
    return object
}
/**
 * @param {HTMLElement} scroller
 * @param {AccessorArray} signalArray 
 * @returns {Object | null}
 */
export function getObjectFromScroller(scroller, signalArray) {
    const objectElement = getCenterElementOfScroller(scroller)
    if (!objectElement) return null
    const object = getObjectFromElement(objectElement, signalArray)
    return object
}

/**
 * @param {HTMLElement} scroller 
 * @param {number} objectID 
 * @returns {HTMLElement | null}
 */
export function getElementFromObjectID(scroller, objectID) {
    for (const objectElement of scroller.children) {
        if (objectElement.getAttribute('objectid') === objectID.toString())
            return objectElement
    }
    return null
}


export function dateToStr(date) {
    if (!date) return ''
    const dateParts = date.split('-')
    const year = dateParts[0]
    const monthNumber = dateParts[1]
    const day = dateParts[2]

    let month
    switch (monthNumber) {
    case '01': month = 'Jan'; break;
    case '02': month = 'Feb'; break;
    case '03': month = 'Mar'; break;
    case '04': month = 'Apr'; break;
    case '05': month = 'May'; break;
    case '06': month = 'Jun'; break;
    case '07': month = 'Jul'; break;
    case '08': month = 'Aug'; break;
    case '09': month = 'Sep'; break;
    case '10': month = 'Oct'; break;
    case '11': month = 'Nov'; break;
    case '12': month = 'Dec';
    }

    return `${month} ${day}, ${year}`
}

/**
 * @param {number} monthIndex 
 * @returns 
 */
export function getShortMonthString(monthIndex) {
  const date = new Date(0, monthIndex);
  const options = { month: 'short' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Get the difference between two dates. Rounds to either days, weeks, or months.
 * @param {String} dateString 
 * @returns {String}
 */
export function dateDifferenceRounded(dateStrStart, dateStrEnd) {
    const dateStart = new Date(dateStrStart);
    const dateEnd = new Date(dateStrEnd);

    const timeInMilliseconds = Math.abs(dateEnd.getTime() - dateStart.getTime());
    const timeInDays = Math.ceil(timeInMilliseconds / (1000 * 60 * 60 * 24));
    
    if (timeInDays >= 7) {
        const timeInWeeks = Math.floor(timeInDays / 7)
        if (timeInWeeks >= 8) {
            const timeInMonths = Math.floor(timeInWeeks / 4)
            return `${timeInMonths} months`
        } 
        else return `${timeInWeeks} weeks`
    }
    else return `${timeInDays} days`
}

/**
 * The difference between two dates. The unit of time is whatever payFreq is at the moment.
 */
export function dateDifference(dateStrStart, dateStrEnd, daysPeriod) {
    const dateStart = new Date(dateStrStart);
    const dateEnd = new Date(dateStrEnd);
    const timeInMilliseconds = Math.abs(dateEnd.getTime() - dateStart.getTime());
    const timeInDays = Math.ceil(timeInMilliseconds / (1000 * 60 * 60 * 24));

    const roundedPeriod = Math.floor(timeInDays / daysPeriod)
    const remainderPeriod = (timeInDays / daysPeriod) - roundedPeriod
    return {
        rounded: roundedPeriod,
        extra: remainderPeriod
    }
}

/**
 * 
 * @param {Object} goal 
 * @param {Object} payFreq 
 * @returns {PaymentPlan}
 */
export function generatePaymentPlan(goal, payFreq) {
    const { dateStart, dateEnd, target, balance } = goal
    const dateDiff = dateDifference(dateStart, dateEnd, payFreq.value)
    const endDateString = dateToStr(dateEnd)
    const numberOfPayments = dateDiff.rounded
    const extraTimePercentage = dateDiff.extra
    
    const contributionNeeded = target - balance;
    const paymentAmount = parseInt(contributionNeeded / numberOfPayments)

    return new PaymentPlan(
        payFreq.value,
        payFreq.string,
        paymentAmount,
        endDateString,
        numberOfPayments,
        extraTimePercentage
    )
}


export function getDateFiveYearsFromNow() {
    const today = new Date();
    const fiveYearsFromNow = new Date(today);
    fiveYearsFromNow.setFullYear(today.getFullYear() + 5);
    return fiveYearsFromNow.toISOString().split('T')[0]
}

