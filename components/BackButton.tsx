import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import Link from "next/link";

export default function BackButton() {
  const router = useRouter();
  const currentPath = router.pathname;

  return currentPath !== "/" ? (
    <div className="flex flex-row py-4 space-x-2 items-center">
      <FontAwesomeIcon icon={faChevronLeft} color="white" />
      <Link href="/" className="text-blue-400 hover:text-blue-500">
        Back to Index
      </Link>
    </div>
  ) : (
    <div></div>
  );
}
