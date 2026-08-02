"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/format";

type NavItem = { href: string; label: string; icon: React.ReactNode };

const icon = (path: React.ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-[18px] w-[18px]"
  >
    {path}
  </svg>
);

const NAV: NavItem[] = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: icon(
      <>
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </>,
    ),
  },
  {
    href: "/month-detail",
    label: "Transactions",
    icon: icon(
      <>
        <line x1="4" y1="7" x2="20" y2="7" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="17" x2="14" y2="17" />
      </>,
    ),
  },
  {
    href: "/month-overview",
    label: "Months",
    icon: icon(
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="16" y1="2" x2="16" y2="6" />
      </>,
    ),
  },
  {
    href: "/import",
    label: "Import",
    icon: icon(
      <>
        <path d="M12 15V3" />
        <path d="M7 8l5-5 5 5" />
        <path d="M5 21h14a2 2 0 0 0 2-2v-4" />
        <path d="M3 15v4a2 2 0 0 0 2 2" />
      </>,
    ),
  },
  {
    href: "/debt",
    label: "Debts",
    icon: icon(
      <>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        <line x1="12" y1="2" x2="12" y2="22" />
      </>,
    ),
  },
  {
    href: "/notes",
    label: "Notes",
    icon: icon(
      <>
        <path d="M4 4h16v12l-4 4H4z" />
        <path d="M16 20v-4h4" />
      </>,
    ),
  },
];

function Brand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 px-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-foreground text-sm font-semibold">
        L
      </span>
      <span className="text-sm font-semibold">Ledger</span>
    </Link>
  );
}

function NavLinks({ pathname }: { pathname: string }) {
  return (
    <>
      {NAV.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-surface-muted text-foreground"
                : "text-muted hover:bg-surface-muted hover:text-foreground",
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

function MobileNavLinks({
  pathname,
  onSelect,
}: {
  pathname: string;
  onSelect?: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {NAV.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => onSelect?.()}
            aria-label={item.label}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl transition-colors",
              active
                ? "bg-surface-muted text-foreground"
                : "text-muted hover:bg-surface-muted hover:text-foreground",
            )}
          >
            {item.icon}
          </Link>
        );
      })}
    </div>
  );
}

function MobileBrand() {
  return (
    <Link
      href="/dashboard"
      className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground text-sm font-semibold"
      aria-label="Ledger home"
    >
      L
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-border bg-surface px-3 py-5 md:flex">
        <Brand />
        <nav className="mt-8 flex flex-col gap-1">
          <NavLinks pathname={pathname} />
        </nav>
      </aside>

      <header className="sticky top-0 z-20 border-b border-border bg-surface/80 backdrop-blur md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <MobileBrand />
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-muted transition hover:bg-surface-muted hover:text-foreground"
            aria-label="Toggle navigation"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-5 w-5">
              {open ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-y-0 left-0 z-30 flex w-20 flex-col border-r border-border bg-surface p-3 shadow-lg md:hidden">
          <div className="mb-4 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground text-sm font-semibold"
              aria-label="Ledger home"
            >
              L
            </button>
          </div>
          <MobileNavLinks pathname={pathname} onSelect={() => setOpen(false)} />
        </div>
      ) : null}
    </>
  );
}
