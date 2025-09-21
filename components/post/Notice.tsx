import { IconProp, SizeProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface NoticeProps extends React.HTMLProps<React.ReactElement> {
  faIcon: IconProp;
  faIconSize: SizeProp;
  noticeType: string;
  header: string;
  content: string;
  className: string;
}

export default function Notice({
  faIcon,
  faIconSize = "2x",
  noticeType,
  header,
  content,
  children,
  className,
}: NoticeProps) {
  let colorClass = "";

  switch (noticeType) {
    case "warning":
      colorClass = "border-yellow-400";
      break;
    case "info":
      colorClass = "border-blue-500";
      break;
    case "error":
      colorClass = "border-red-500";
      break;
    default:
      break;
  }

  return (
    <div
      className={`flex flex-col p-4 rounded-lg shadow-md border ${colorClass} gap-4`}
    >
      {header && (
        <div className="flex flex-row gap-4 items-center">
          {faIcon && <FontAwesomeIcon icon={faIcon} size={faIconSize} />}
          {header && <strong className="font-bold text-xl">{header}</strong>}
        </div>
      )}

      <div className={`text-left flex flex-col gap-2 ${className}`}>
        {children}
        {content && <p>{content}</p>}
      </div>
    </div>
  );
}
