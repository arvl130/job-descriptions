import Link from "next/link"
import { useRouter } from "next/router"

export function SideNav() {
  const router = useRouter()

  return (
    <aside className="px-4 py-12 space-y-2">
      <Link
        href="/getting-started"
        className={`block px-4 py-2 hover:bg-zinc-200 transition duration-200 rounded-md font-medium ${
          router.pathname === "/getting-started" ? "bg-zinc-100" : ""
        }`}
      >
        Getting Started
      </Link>
      <Link
        href="/api-keys"
        className={`block px-4 py-2 hover:bg-zinc-200 transition duration-200 rounded-md font-medium ${
          router.pathname === "/api-keys" ? "bg-zinc-100" : ""
        }`}
      >
        API Keys
      </Link>
      <Link
        href="/search"
        className={`block px-4 py-2 hover:bg-zinc-200 transition duration-200 rounded-md font-medium ${
          router.pathname === "/search" ? "bg-zinc-100" : ""
        }`}
      >
        Online Search
      </Link>
    </aside>
  )
}
