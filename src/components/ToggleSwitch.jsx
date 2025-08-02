export default function ToggleSwitch(props) {
    return (
        <label 
            class='Toggle'
            style={{ '--toggle-switch-height': props.height }}
            onChange={props.onClick}
        >
            <input type="checkbox" checked={props.checked} ref={props.ref}/>
            <div 
            class='Toggle-slider' 
            style={{'--toggle-on-color': props.color}}>

            </div>
        </label>
    )
}