export default function AnimatedArrows(props) {
    return (
        <div class="arrows-wrapper-positioner" >
            <div class="arrows-wrapper" style={
                props.translate ? `translate: 0 ${[props.translate]}` : ''
                }>
                <div class="arrow"></div>
                <div class="arrow"></div>
                <div class="arrow"></div>
            </div>
        </div>
    )

}