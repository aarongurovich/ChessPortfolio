import { GithubIcon, LinkedinIcon, MailIcon, CastleIcon as ChessKnightIcon } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-8 bg-background">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">AG</span>
              </div>
              <span className="font-bold">Aaron Gurovich</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Software Developer & Chess Enthusiast
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/aarongurovich"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>

            <Link
              href="https://www.linkedin.com/in/aaron-gurovich-b2087b2b1/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>

            <a
              href="mailto:aargurov@ttu.edu"
              className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
              aria-label="Email"
            >
              <MailIcon className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </a>

            <Link
              href="https://lichess.org/@/poinchik"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
              aria-label="Lichess Profile"
            >
              <ChessKnightIcon className="h-5 w-5" />
              <span className="sr-only">Chess Profile</span>
            </Link>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Aaron Gurovich. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

