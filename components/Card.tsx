import Image from "next/image";
import Link from "next/link";
import Markdown from "markdown-to-jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface CardProps {
  id: string;
  title: string;
  preview: string;
  datetime: Date;
  cover?: string;
}

export default function Card({
  id,
  title,
  preview,
  datetime,
  cover,
}: CardProps) {
  return (
    <Link href={`/post/${id}`}>
      <div className="flex flex-row border border-gray-500 rounded-xl opacity-80 hover:opacity-100 cursor-pointer transition duration-300 ease-in-out">
        <div className="flex flex-col rounded-lg shadow-md basis-4/5">
          {cover && (
            <Image
              className="mx-auto md:h-auto"
              src={cover}
              width={400}
              height={200}
              alt="Post cover image"
            />
          )}

          <div className="flex flex-col gap-0.5 py-3 text-left pl-4">
            <div className="text-gray-400 text-sm">{datetime}</div>

            <strong>{title}</strong>

            <div className="text-sm text-gray-400">
              <Markdown
                // eslint-disable-next-line react/no-children-prop
                children={preview}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center basis-1/5">
          <FontAwesomeIcon icon={faChevronRight} size="1x" />
        </div>
      </div>
    </Link>
  );
}
