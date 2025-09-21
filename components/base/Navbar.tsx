/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <div className="flex flex-row gap-4 justify-between">
      <Link href="/" className="flex flex-row gap-4 items-center">
        <img
          src="https://avatars.githubusercontent.com/u/6541445?v=4"
          className="rounded-lg aspect-square"
          height={40}
          width={40}
          alt="Ren's profile picture"
        />
        <h2 className="text-2xl font-bold">Ren&apos;s Space</h2>
      </Link>

      <div className="flex flex-row gap-4 items-center text-lg">
        <Link href="/blog" className="hover:text-blue-500 hover:underline">
          Blog
        </Link>
        <Link href="/about" className="hover:text-blue-500 hover:underline">
          About
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
