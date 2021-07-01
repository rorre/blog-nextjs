import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

library.add(faExclamationTriangle);

export default function Notice({ faIcon, faIconSize = "3x", noticeType, header, content, children }) {
    let colorClass = ""

    switch (noticeType) {
        case "warning":
            colorClass = "border-yellow-400"
            break
        case "info":
            colorClass = "border-blue-500"
            break
        case "error":
            colorClass = "border-red-500"
            break
        default:
            break
    }

    return (
        <div className={`flex items-center justify-center p-4 rounded-lg shadow-md bg-white border ${colorClass} space-x-4`}>
            {faIcon && <FontAwesomeIcon icon={faIcon} size={faIconSize} />}

            <div className="text-left">
                {children}
                {header && <h4 className="font-bold text-md">{header}</h4>}
                {content && <p>{content}</p>}
            </div>
        </div >
    )
}