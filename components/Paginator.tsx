import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface PaginatorProps {
  currentPage: number;
  hasNext: boolean;
}

const Paginator: React.FC<PaginatorProps> = ({ currentPage, hasNext }) => {
  return (
    <div className="flex flex-row justify-center space-x-4 py-4">
      {currentPage > 1 && (
        <Link href={"/" + (currentPage - 1)} legacyBehavior>
          <button className="rounded border py-1 px-2 hover:text-blue-600">
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        </Link>
      )}
      {hasNext && (
        <Link href={"/" + (currentPage + 1)} legacyBehavior>
          <button className="rounded border py-1 px-2 hover:text-blue-600">
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </Link>
      )}
    </div>
  );
};

export default Paginator;
