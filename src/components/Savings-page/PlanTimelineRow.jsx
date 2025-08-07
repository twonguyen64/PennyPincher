import { For } from "solid-js"


export default function PlanTimelineRow(props) {

    const planNodes = Array.from({ length: props.maxColumns }, (_, index) => {
        if (index < props.plan.numberOfPayments) {
            return <div class="TimelineRow-calendar-space filled"></div>;
        }
        return <div class="TimelineRow-calendar-space"></div>;
    });

    return (
        <div class="Timeline-rows-item TimelineRow">
            {planNodes}
            <div></div>
        </div>
    )
}