"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon, MenuIcon, XIcon, PhoneIcon, MailIcon } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"

export function Header() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // After mounting, we can show the theme toggle (prevents hydration mismatch)
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <header className="border-b sticky top-0 bg-background/80 backdrop-blur-md z-10">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">AG</span>
            </div>
            <span className="hidden sm:inline-block">Aaron Gurovich</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-4">
            <a
              href="mailto:aargurov@ttu.edu"
              className="text-sm hover:text-primary transition-colors flex items-center gap-1"
            >
              <MailIcon className="h-4 w-4" />
              aargurov@ttu.edu
            </a>
            <a href="tel:+19495050956" className="text-sm hover:text-primary transition-colors flex items-center gap-1">
              <PhoneIcon className="h-4 w-4" />
              +1 949-505-0956
            </a>
          </nav>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-full"
            >
              {resolvedTheme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-full"
            >
              {resolvedTheme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="rounded-full"
          >
            {mobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4 bg-background">
          <div className="container">
            <nav className="flex flex-col gap-4">
              <a
                href="mailto:aargurov@ttu.edu"
                className="text-sm hover:text-primary transition-colors flex items-center gap-2 p-2"
              >
                <MailIcon className="h-4 w-4" />
                aargurov@ttu.edu
              </a>
              <a
                href="tel:+19495050956"
                className="text-sm hover:text-primary transition-colors flex items-center gap-2 p-2"
              >
                <PhoneIcon className="h-4 w-4" />
                +1 949-505-0956
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

