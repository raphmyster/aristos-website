"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Container from "@/components/shared/Container";
import Button from "@/components/shared/Button";
import SanityImage from "@/components/shared/SanityImage";

interface NavbarProps {
  logo?: any;
  siteName?: string;
  orderButtonText?: string;
  primaryCtaLink?: string;
  enableCatering?: boolean;
}

interface NavLink {
  label: string;
  href: string;
}

export default function Navbar({
  logo,
  siteName,
  orderButtonText,
  primaryCtaLink,
  enableCatering,
}: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // --- Navigation links ---
  const navLinks: NavLink[] = [
    { label: "Home", href: "/" },
    { label: "Menu", href: "/menu" },
    ...(enableCatering ? [{ label: "Catering", href: "/catering" }] : []),
    { label: "Locations", href: "/locations" },
  ];

  // --- Scroll detection ---
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Escape key closes mobile menu ---
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // --- Body scroll lock when mobile menu is open ---
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [menuOpen]);

  // --- Active link helper ---
  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href);
  }

  return (
    <>
      {/* Desktop / Main Navbar */}
      <nav
        aria-label="Main navigation"
        className={cn(
          "sticky top-0 z-50 h-16 lg:h-[72px] bg-background transition-shadow duration-200",
          scrolled &&
            "border-b border-border shadow-[0_1px_4px_rgba(0,0,0,0.05)] bg-background/95 backdrop-blur-md",
        )}
      >
        <Container className="flex h-full items-center justify-between">
          {/* Logo / Site name */}
          <Link href="/" className="flex-shrink-0">
            {logo ? (
              <SanityImage
                image={logo}
                alt={siteName || "Logo"}
                width={120}
                height={48}
                className="max-h-12 w-auto"
              />
            ) : (
              <span className="font-heading text-xl text-foreground">
                {siteName}
              </span>
            )}
          </Link>

          {/* Desktop nav links + CTA */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[15px] font-medium font-body text-foreground hover:text-primary transition-colors",
                  isActive(link.href) && "text-primary",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button variant="primary" size="sm" href={primaryCtaLink}>
              {orderButtonText || "Order Now"}
            </Button>
          </div>

          {/* Hamburger button (mobile) */}
          <button
            type="button"
            className="lg:hidden"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </Container>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        role="dialog"
        aria-label="Mobile navigation"
        className={cn(
          "fixed inset-0 z-50 bg-background transition-transform duration-250 ease-out",
          menuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Mobile menu header */}
        <div className="h-16 lg:h-[72px]">
          <Container className="flex h-full items-center justify-between">
            <Link
              href="/"
              className="flex-shrink-0"
              onClick={() => setMenuOpen(false)}
            >
              {logo ? (
                <SanityImage
                  image={logo}
                  alt={siteName || "Logo"}
                  width={120}
                  height={48}
                  className="max-h-12 w-auto"
                />
              ) : (
                <span className="font-heading text-xl text-foreground">
                  {siteName}
                </span>
              )}
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </Container>
        </div>

        {/* Mobile menu links */}
        <div className="flex flex-col items-center justify-center flex-1 h-[calc(100%-4rem-5rem)]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "text-2xl font-heading min-h-[48px] py-3 flex items-center transition-colors",
                isActive(link.href)
                  ? "text-primary"
                  : "text-foreground hover:text-primary",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu CTA */}
        <div className="px-4 pb-8">
          <Button
            variant="primary"
            size="lg"
            href={primaryCtaLink}
            className="w-full"
            onClick={() => setMenuOpen(false)}
          >
            {orderButtonText || "Order Now"}
          </Button>
        </div>
      </div>
    </>
  );
}
