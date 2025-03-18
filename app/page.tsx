"use client"

import { useState, useEffect, useRef } from "react"
import { ChessPuzzleGate } from "@/components/chess-puzzle-gate"
import { ChessGame } from "@/components/chess-game"
import { ResumeSection } from "@/components/resume-section"
import { SecretSection } from "@/components/secret-section"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  LockIcon,
  UnlockIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  CodeIcon,
  TrophyIcon,
  WrenchIcon,
  SparklesIcon,
  CastleIcon as ChessKnightIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Portfolio() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const chessBoardRef = useRef(null)
  const [unlockedSections, setUnlockedSections] = useState({
    education: false,
    experience: false,
    projects: false,
    activities: false,
    skills: false,
    secret: false,
  })

  const [activeSection, setActiveSection] = useState(null)
  const [showPuzzle, setShowPuzzle] = useState(false)
  const [showChessGame, setShowChessGame] = useState(false)
  const [currentTarget, setCurrentTarget] = useState(null)

  const scrollToChessBoard = () => {
    if (chessBoardRef.current) {
      chessBoardRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Handle hydration mismatch by updating state after mount
  useEffect(() => {
    setMounted(true)

    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("unlockedSections")
        if (saved) {
          const parsed = JSON.parse(saved)
          // Ensure all sections are included in the parsed data
          if (parsed && typeof parsed === "object") {
            const updatedSections = { ...unlockedSections }

            // Only update keys that exist in our state
            Object.keys(updatedSections).forEach((key) => {
              if (key in parsed) {
                updatedSections[key] = Boolean(parsed[key])
              }
            })

            setUnlockedSections(updatedSections)
          }
        }
      } catch (e) {
        console.error("Failed to parse saved sections", e)
      }
    }
  }, [])

  const handleUnlock = (section) => {
    if (!section || typeof section !== "string") return

    setUnlockedSections((prev) => {
      // Only update if the section exists in our state
      if (!(section in prev)) return prev

      const updated = {
        ...prev,
        [section]: true,
      }

      // Save to localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("unlockedSections", JSON.stringify(updated))
        } catch (e) {
          console.error("Failed to save to localStorage", e)
        }
      }

      return updated
    })

    setActiveSection(section)
    setShowPuzzle(false)
    setShowChessGame(false)
  }

  const startPuzzleChallenge = (section) => {
    if (!section || typeof section !== "string") return
    setCurrentTarget(section)
    setShowPuzzle(true)
    setShowChessGame(false)
    setTimeout(() => scrollToChessBoard(), 100)
  }

  const startChessGame = () => {
    setShowChessGame(true)
    setShowPuzzle(false)
    setActiveSection(null)
    setTimeout(() => scrollToChessBoard(), 100)
  }

  // If not mounted yet, don't render content to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Header />

      <main className="flex-1 py-12">
        <div className="container">
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <div className="inline-block mb-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary rounded-full blur-md"></div>
                <div className="relative bg-background rounded-full p-1 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-primary/60 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary-foreground">AG</span>
                  </div>
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Aaron Gurovich
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Solve chess puzzles to unlock sections of my portfolio. Each section is protected by a puzzle
            </p>

            <div className="mt-4 inline-block">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary/70 hover:text-primary"
                      onClick={startChessGame}
                    >
                      <SparklesIcon className="h-4 w-4 mr-1" />
                      <span className="underline underline-offset-4">Play the chess challenge</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Play a game of chess against the chess engine!</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-12">
            {Object.entries({
              education: { icon: <GraduationCapIcon className="h-5 w-5" />, label: "Education" },
              experience: { icon: <BriefcaseIcon className="h-5 w-5" />, label: "Experience" },
              projects: { icon: <CodeIcon className="h-5 w-5" />, label: "Projects" },
              activities: { icon: <TrophyIcon className="h-5 w-5" />, label: "Activities" },
              skills: { icon: <WrenchIcon className="h-5 w-5" />, label: "Skills" },
            }).map(([key, { icon, label }]) => {
              const isUnlocked = unlockedSections[key] || false

              return (
                <div
                  key={key}
                  className={`relative overflow-hidden group cursor-pointer rounded-xl border ${activeSection === key ? "ring-2 ring-primary" : ""}`}
                  onClick={() => (isUnlocked ? setActiveSection(key) : startPuzzleChallenge(key))}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="p-6 flex flex-col items-center text-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isUnlocked ? "bg-primary/20" : "bg-muted"}`}
                    >
                      <div className="text-primary">{icon}</div>
                    </div>
                    <h3 className="text-lg font-medium mb-2">{label}</h3>
                    <div className="text-sm text-muted-foreground mb-4">
                      {isUnlocked ? "Section Unlocked" : "Solve a puzzle to unlock"}
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${isUnlocked ? "bg-green-100 dark:bg-green-900/20" : "bg-muted"}`}
                    >
                      {isUnlocked ? (
                        <UnlockIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <LockIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Secret section card - always visible */}
            <div
              className={`relative overflow-hidden group cursor-pointer rounded-xl border ${
                activeSection === "secret" ? "ring-2 ring-primary" : ""
              } ${
                unlockedSections.secret
                  ? "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20"
                  : "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20"
              }`}
              onClick={() => (unlockedSections.secret ? setActiveSection("secret") : startChessGame())}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-6 flex flex-col items-center text-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                    unlockedSections.secret ? "bg-amber-500/20" : "bg-muted"
                  }`}
                >
                  <div className={unlockedSections.secret ? "text-amber-600 dark:text-amber-400" : "text-primary"}>
                    <ChessKnightIcon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">Chess Achievements</h3>
                <div className="text-sm text-muted-foreground mb-4">
                  {unlockedSections.secret ? "Secret section unlocked!" : "Beat the chess engine to unlock"}
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    unlockedSections.secret ? "bg-amber-100 dark:bg-amber-900/20" : "bg-muted"
                  }`}
                >
                  {unlockedSections.secret ? (
                    <SparklesIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <LockIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {showPuzzle ? (
            <div className="my-8 animate-fadeIn" ref={chessBoardRef}>
              <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold mb-2">
                    Solve this puzzle to unlock{" "}
                    {currentTarget ? currentTarget.charAt(0).toUpperCase() + currentTarget.slice(1) : ""}
                  </h2>
                  <p className="text-muted-foreground">
                    Make the best move to continue. If you make a mistake, you'll get a new puzzle to solve.
                  </p>
                </div>
                <ChessPuzzleGate onSuccess={() => handleUnlock(currentTarget)} />
              </div>
            </div>
          ) : showChessGame ? (
            <div className="my-8 animate-fadeIn" ref={chessBoardRef}>
              <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold mb-2">Secret Chess Challenge</h2>
                  <p className="text-muted-foreground">
                    Beat the chess engine to unlock a special section about my chess achievements.
                  </p>
                </div>
                <ChessGame onSuccess={() => handleUnlock("secret")} />
              </div>
            </div>
          ) : activeSection ? (
            <div className="animate-fadeIn">
              {activeSection === "secret" ? (
                <SecretSection />
              ) : (
                <ResumeSection section={activeSection} unlockedSections={unlockedSections} />
              )}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted/20 rounded-xl border border-border/50 max-w-4xl mx-auto animate-fadeIn">
              <div className="max-w-2xl mx-auto px-4">
                <div className="inline-block mb-6">
                  <div className="p-4 rounded-lg bg-primary/10">
                    <div className="w-20 h-20 mx-auto overflow-hidden rounded-lg">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-wfQqfZERFPGfyoy5CeJk9VdEqbimUD.png"
                        alt="Aaron Gurovich"
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4">Welcome to my interactive portfolio!</h2>
                <p className="text-muted-foreground mb-6">
                  As a competitive chess player and software developer, I've combined my passions in this interactive
                  portfolio. Click on any section above to solve a chess puzzle and unlock information about my
                  background.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button onClick={() => startPuzzleChallenge("education")} className="gap-2">
                    <GraduationCapIcon className="h-4 w-4" />
                    Start with Education
                  </Button>
                  <Button onClick={() => startPuzzleChallenge("skills")} variant="outline" className="gap-2">
                    <WrenchIcon className="h-4 w-4" />
                    Try Skills
                  </Button>
                  <Button
                    onClick={startChessGame}
                    variant="outline"
                    className="gap-2 border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                  >
                    <ChessKnightIcon className="h-4 w-4" />
                    Chess Challenge
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

