export default function SavingsGoal(props) {
    const percentage = (props.balance / props.target) * 100

    return (
        <div class="Goal ObjectContainer" objectID={props.objectID}>
            <div class='Goal-name'>{props.name}</div>
            <div class="Goal-lower-wrapper">
                <div class='Goal-money'>
                    <span class='Goal-balance'>${props.balance} of</span>
                    <span class='Goal-target'>${props.target}</span>
                </div>
                <div class='Goal-progressbar'>
                    <div class='Goal-progressbar-inner'
                        style={`width: ${percentage}%`}
                    ></div>
                </div>
            </div>
        </div>
    )
}