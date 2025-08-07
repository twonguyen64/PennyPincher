import { createEffect, createMemo, createSignal, Show } from "solid-js";
import { useMainWrapperContext } from "../../contexts/MainWrapperContext";
import { usePageColumnScrolling } from "../../utils/PageColumnScrolling"
import { getShortMonthString } from "../../utils/util-functions";
import gobackIcon from '../../assets/goback.svg';

export default function TimelineDateOverlay(props) {
    const [numberOfUnits, setNumberOfUnits] = createSignal(0)

    /**Returns the percentage of a single date space to be used as the width
     * @returns {string}
    */
    const calculateDateOffset = () => {
        const { freq } = props;
        if (!freq) return
        const today = new Date;
        const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const daysSinceMonthStart = Math.ceil(Math.abs(today - firstOfMonth) / (1000* 60 * 60 * 24))
        
        //Unit is either a week, biweek, or month
        const ratioOfUnit = ((daysSinceMonthStart % freq) / freq)
        const ratioToUse = 1 - ratioOfUnit.toPrecision(3)
        
        const rootStyles = getComputedStyle(document.documentElement)
        const normalColumnWidth = parseFloat(rootStyles.getPropertyValue('--timeline-column-width'))

        const cssString = `${normalColumnWidth * ratioToUse}rem`
        document.getElementById('Timeline-date-scroller').style.setProperty('--timeline-first-date-column-width', cssString)

        setNumberOfUnits(Math.floor(daysSinceMonthStart / freq))
    }
    
    createEffect(() => {
    if (props.freq)
        calculateDateOffset();
    });

    const calendarNodes = createMemo(() => {
        const { freq } = props;
        if (!freq) return [];

        // Move your Array.from logic here
        return Array.from({ length: props.maxColumns + 1 }, (_, i) => {
            const { freq } = props;
            if (!freq) return
            const index = i + numberOfUnits();
            let dateString, numberOfMonthsToAdd;
            switch (props.freq) {
                case 7:
                    const weekends = ['7', '14', '21', '1']
                    dateString = weekends[index % 4]
                    numberOfMonthsToAdd = Math.floor((index + 1) / 4)
                    break;
                case 14:
                    const biweekends = ['14', '1']
                    dateString =  biweekends[index % 2]
                    numberOfMonthsToAdd = Math.floor((index + 1) / 2)
                    break;
                case 30:
                    dateString = '1'
                    numberOfMonthsToAdd = index + 1
            }
            const currentMonth = new Date().getMonth();
            const monthIndex = (currentMonth + numberOfMonthsToAdd) % 12
            const monthString = getShortMonthString(monthIndex)
            
            //Add year when Jan 1 hits:
            let yearString = null
            if (monthIndex === 0 && dateString === '1') {
                const currentYear = new Date().getFullYear();
                const yearsToAdd = Math.floor((currentMonth + numberOfMonthsToAdd) / 12)
                yearString = (currentYear + yearsToAdd).toString()
            }

            return (
                <div class='Timeline-date'>{monthString} {dateString}
                <Show when={yearString}>
                        <div class='Timeline-date-year'>{yearString}</div>
                    </Show></div>
            )
        });
    });

    const { pageIndex, pageIndexSetter } = useMainWrapperContext();
    const { slideToLeft } = usePageColumnScrolling(
        () => document.getElementById('Savingspage'), 
        () => pageIndex().savings, 
        pageIndexSetter.savings
    );

    return (
        <div id='Timeline-date-scroller-wrapper'>
            <div id='Timeline-date-scroller-spacer'>
                <img id='backButton' src={gobackIcon} onTouchEnd={slideToLeft}/>
            </div>
            <div id='Timeline-date-scroller' ref={props.ref}>
                <div></div>
                {calendarNodes}
            </div>
        </div>
    )
}