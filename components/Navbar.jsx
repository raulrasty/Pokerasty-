"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Mis equipos" },
  { href: "/builder", label: "Crear equipo" },
  { href: "/compare", label: "Comparar" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-md">
      <div className="bg-red-600 h-1 w-full" />

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl text-gray-900 tracking-tight">
            Poké<span className="text-red-600">Rasty</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-5 py-5 text-sm font-medium transition-all border-b-2 ${
                  active
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-gray-600 hover:text-red-600 hover:border-red-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <Image
                src={session.user.image}
                alt={session.user.name}
                width={36}
                height={36}
                className="rounded-full border-2 border-gray-200"
              />
              <div className="hidden md:flex flex-col">
                <span className="text-xs text-gray-500">Hola,</span>
                <span className="text-sm font-medium text-gray-800 leading-tight">
                  {session.user.name?.split(" ")[0]}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors border border-gray-200 rounded-lg px-3 py-1.5 hover:border-red-300"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
