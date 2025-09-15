import usePopup from "../../utils/Popup"
import DOMPurify from '../../utils/dompurify/purify.module'

export default function PopupLink() {
    const { exitPopup } = usePopup();
    let urlRef, labelRef

    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (error) {
            return false;
        }
    }
    const submit = () => {
        let link = urlRef.value
        if (link && isValidUrl(link)) {
            link = DOMPurify.sanitize(link)
        } else {
            alert('Enter a valid url')
            return
        }

        let linkLabel = labelRef.value
        if (linkLabel) {
            linkLabel = DOMPurify.sanitize(linkLabel)
        } else {
            linkLabel = link
        }

        const notes = document.getElementById('Goal-notes')
        notes.innerHTML += `<a contenteditable="false" href="${link}">${linkLabel}</a>`
        exitPopup()
    }
    return (
        <div class="popup-wrapper">
            <div class="popup">
                <h3>Insert link</h3>
                <div class='popupfield url'>
                    <label>Link/URL</label>
                    <input type="text" ref={urlRef}/>
                </div>
                <div class='popupfield url'>
                    <label>Text to show (optional)</label>
                    <input type="text" ref={labelRef}/>
                </div>
                <div class='popupfield spaced'>
                    <button onClick={exitPopup}>Cancel</button>
                    <button onClick={submit}>Add</button>
                </div>
            </div>
        </div>
        
    )
}