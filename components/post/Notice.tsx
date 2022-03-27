import { IconProp, library, SizeProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import React from 'react'

library.add(faInfoCircle)
library.add(faExclamationTriangle)

interface NoticeProps extends React.HTMLProps<React.ReactElement> {
    faIcon: IconProp
    faIconSize: SizeProp
    noticeType: string
    header: string
    content: string
}

export default function Notice({ faIcon, faIconSize = '3x', noticeType, header, content, children }: NoticeProps) {
    let colorClass = ''

    switch (noticeType) {
        case 'warning':
            colorClass = 'border-yellow-400'
            break
        case 'info':
            colorClass = 'border-blue-500'
            break
        case 'error':
            colorClass = 'border-red-500'
            break
        default:
            break
    }

    return (
        <div
            className={`flex flex-col md:flex-row items-center justify-center
                        p-4 rounded-lg shadow-md border ${colorClass}
                        space-x-4 space-y-4 md:space-y-0`}
        >
            {faIcon && <FontAwesomeIcon icon={faIcon} size={faIconSize} />}

            <div className="text-left">
                {header && <h4 className="font-bold text-md">{header}</h4>}
                {children}
                {content && <p>{content}</p>}
            </div>
        </div>
    )
}
