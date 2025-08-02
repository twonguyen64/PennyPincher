export default function AddButton(props) {
    return (
        <div class="AddButton" ref={props.ref} onClick={props.onClick}>
            <img src={props.icon} alt="+"/>
            <span>{props.text}</span>
        </div>
    )
}