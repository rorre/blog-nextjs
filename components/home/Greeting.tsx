import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

function Greeting() {
  return (
    <>
      <h1 className="py-4 text-3xl font-bold">Hello!</h1>
      <div className="flex flex-col gap-2">
        <p className="text-lg">
          I&apos;m Ren, and welcome to my space! I&apos;m a Computer Science
          fresh graduate, working as a pentester or red teamer by day, software
          engineer on the other time! This is where I post my rambles, be it
          technical, or simply talking about life.
        </p>

        <Link href="/about">
          <button className="py-3 pl-4 w-full flex flex-row justify-between border border-gray-500 rounded-xl opacity-80 hover:opacity-100 cursor-pointer transition duration-300 ease-in-out">
            <p>Learn more about me?</p>

            <div className="flex items-center justify-center basis-1/5">
              <FontAwesomeIcon icon={faChevronRight} size="1x" />
            </div>
          </button>
        </Link>
      </div>
    </>
  );
}

export default Greeting;
