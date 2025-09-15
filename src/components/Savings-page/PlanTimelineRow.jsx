import { For } from "solid-js"


export default function PlanTimelineRow(props) {

    const planNodes = Array.from({ length: props.maxColumns}, (_, index) => {
        if (index < props.plan.numberOfPayments) {
            return <div class="TimelineRow-calendar-space filled"></div>;
        }
        return <div class="TimelineRow-calendar-space"></div>;
    });
    const marginLeft = (props.plan.extraTimePercentage * 100) || 0
    
    let dueDateInfoRef;
    const clickDueDate = () => {
        dueDateInfoRef.classList.toggle('hidden')
    }

    return (
        <div class="Timeline-rows-item TimelineRow">
            {planNodes}
            <div
                onTouchEnd={clickDueDate}
                class="TimelineRow-due-date" 
                style={`margin-left: ${marginLeft}%`}
            >
                <div ref={dueDateInfoRef} class="TimelineRow-due-date-info hidden">{props.plan.endDateString}</div>
            </div>
            
        </div>
    )
}