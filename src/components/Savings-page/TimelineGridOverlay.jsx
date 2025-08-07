import { createEffect, createMemo } from "solid-js";

export default function TimelineGridOverlay(props) {

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
        document.getElementById('Timeline-grid-overlay').style.setProperty('--timeline-first-date-column-width', cssString)
    }
    
    createEffect(() => {
    if (props.freq)
        calculateDateOffset();
    });

    const gridlines = createMemo(() => {
        const { freq } = props;
        if (!freq) return [];

        // Move your Array.from logic here
        return Array.from({ length: props.maxColumns + 1}, () => {
            return (
                <div class='Timeline-gridline'></div>
            )
        });
    });

    return (
        <div id='Timeline-grid-overlay' class='TimelineRow'>
            <div></div>
            {gridlines}
        </div>
    )
}