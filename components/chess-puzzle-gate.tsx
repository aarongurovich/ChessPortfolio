"use client"

import { useState, useEffect, useRef } from "react"
import { Chessboard } from "react-chessboard"
import { Chess } from "chess.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertCircle,
  CheckCircle,
  RotateCcw,
  ChevronRight,
  CastleIcon as ChessKnightIcon,
  TrophyIcon,
  TagIcon,
  InfoIcon,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useTheme } from "next-themes"

export function ChessPuzzleGate({ onSuccess }) {
  const { resolvedTheme } = useTheme()
  const [game, setGame] = useState(() => new Chess())
  const [puzzle, setPuzzle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0)
  const [status, setStatus] = useState(null) // 'correct', 'incorrect', or null
  const [orientation, setOrientation] = useState("white")
  const [error, setError] = useState(null)
  const [mounted, setMounted] = useState(false)

  // For dynamic board sizing
  const boardContainerRef = useRef(null)
  const [boardWidth, setBoardWidth] = useState(400)

  useEffect(() => {
    setMounted(true)

    // Measure the container immediately on mount
    const updateBoardWidth = () => {
      if (boardContainerRef.current) {
        setBoardWidth(boardContainerRef.current.clientWidth)
      }
    }

    updateBoardWidth()
    window.addEventListener("resize", updateBoardWidth)

    return () => window.removeEventListener("resize", updateBoardWidth)
  }, [])


  useEffect(() => {
    const initPuzzle = async () => {
      try {
        await fetchPuzzle()
      } catch (error) {
        console.error("Failed to fetch puzzle:", error)
        setError("Failed to load puzzle. Please try again.")
        setLoading(false)
      }
    }
    initPuzzle()
  }, [])

  // Watch for successful completion
  useEffect(() => {
    if (status === "correct") {
      // Wait a moment before triggering success callback
      const timer = setTimeout(() => {
        onSuccess()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [status, onSuccess])

  async function fetchPuzzle() {
    setLoading(true)
    setStatus(null)
    setError(null)
    try {
      // Fetch the daily puzzle from Lichess API
      const response = await fetch("https://lichess.org/api/puzzle/next")
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }
      const data = await response.json()
      if (!data || !data.puzzle) {
        throw new Error("Invalid or missing puzzle data in API response")
      }
      // Extract puzzle data
      const puzzleData = {
        id: data.puzzle.id || "unknown",
        rating: data.puzzle.rating || 1500,
        themes: data.puzzle.themes || [],
        solution: data.puzzle.solution || [],
        rawData: data,
      }
      const newGame = new Chess()
      let fen = null
      if (data.puzzle.fen) {
        fen = data.puzzle.fen
      } else if (data.game && data.game.fen) {
        fen = data.game.fen
      } else if (data.position) {
        fen = data.position
      }
      if (!fen && data.game && data.game.pgn) {
        try {
          const tempGame = new Chess()
          tempGame.loadPgn(data.game.pgn)
          fen = tempGame.fen()
        } catch (e) {
          console.error("Failed to extract FEN from PGN:", e)
        }
      }
      if (!fen) {
        console.warn("No FEN found in puzzle data, using default starting position")
        fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
      }
      try {
        newGame.load(fen)
      } catch (e) {
        console.error("Invalid FEN:", fen, e)
        throw new Error("Invalid FEN in puzzle data")
      }
      setPuzzle({
        ...puzzleData,
        fen: fen,
      })
      setGame(newGame)
      setCurrentMoveIndex(0)
      const playerColor = newGame.turn() === "w" ? "white" : "black"
      setOrientation(playerColor)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching puzzle:", error)
      setError("Failed to load puzzle. Please try again.")
      setLoading(false)
      throw error
    }
  }

  function handleMove(sourceSquare, targetSquare) {
    if (status || loading) return false
    try {
      const piece = game.get(sourceSquare)
      if (
        !piece ||
        (orientation === "white" && piece.color !== "w") ||
        (orientation === "black" && piece.color !== "b")
      ) {
        return false
      }
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      })
      if (!move) return false
      setGame(new Chess(game.fen()))
      if (puzzle && puzzle.solution && currentMoveIndex < puzzle.solution.length) {
        const expectedMove = puzzle.solution[currentMoveIndex]
        const userMove = sourceSquare + targetSquare + (move.promotion || "")
        if (userMove === expectedMove) {
          setCurrentMoveIndex(currentMoveIndex + 1)
          if (currentMoveIndex + 1 < puzzle.solution.length) {
            setTimeout(() => {
              try {
                const nextMove = puzzle.solution[currentMoveIndex + 1]
                const from = nextMove.substring(0, 2)
                const to = nextMove.substring(2, 4)
                const promotion = nextMove.length === 5 ? nextMove[4] : undefined
                const gameCopy = new Chess(game.fen())
                gameCopy.move({ from, to, promotion })
                setGame(gameCopy)
                setCurrentMoveIndex(currentMoveIndex + 2)
              } catch (error) {
                console.error("Error making opponent's move:", error)
              }
            }, 500)
          } else {
            setStatus("correct")
          }
        } else {
          setStatus("incorrect")
          setTimeout(() => {
            fetchPuzzle().catch((err) => {
              console.error("Error fetching new puzzle:", err)
              setError("Failed to load a new puzzle. Please try again.")
            })
          }, 1500)
        }
      }
      return true
    } catch (error) {
      console.error("Error making move:", error)
      return false
    }
  }

  function resetPuzzle() {
    if (puzzle) {
      try {
        const newGame = new Chess()
        if (puzzle.fen) {
          newGame.load(puzzle.fen)
          setGame(newGame)
          setCurrentMoveIndex(0)
          setStatus(null)
        }
      } catch (error) {
        console.error("Error resetting puzzle:", error)
      }
    }
  }

  function tryDifferentPuzzle() {
    fetchPuzzle().catch((error) => {
      console.error("Failed to fetch a different puzzle:", error)
      setError("Failed to load puzzle. Please try again.")
    })
  }

  // Update board colors to use dynamic board width
  const getBoardColors = () => {
    if (resolvedTheme === "dark") {
      return {
        boardWidth: boardWidth,
        customDarkSquareStyle: { backgroundColor: "#2d3748" },
        customLightSquareStyle: { backgroundColor: "#4a5568" },
      }
    }
    return {
      boardWidth: boardWidth,
      customDarkSquareStyle: { backgroundColor: "#b58863" },
      customLightSquareStyle: { backgroundColor: "#f0d9b5" },
    }
  }

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-0">
      {/* Board Container with dynamic sizing */}
      <div className="w-full aspect-square max-w-xl mx-auto md:max-w-full md:mx-0" ref={boardContainerRef}>
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-xl border">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Loading puzzle...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full border rounded-xl bg-muted/20">
            <div className="text-center p-6">
              <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Error Loading Puzzle</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={tryDifferentPuzzle}>Try Again</Button>
            </div>
          </div>
        ) : (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-primary/10 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <Chessboard
                position={game.fen()}
                onPieceDrop={handleMove}
                boardOrientation={orientation}
                {...getBoardColors()}
                customBoardStyle={{
                  borderRadius: "0.75rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  overflow: "hidden",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Puzzle Panel */}
      <div className="flex flex-col gap-4">
        <Card className="border-primary/20 overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChessKnightIcon className="h-5 w-5 text-primary" />
              Puzzle Challenge
            </CardTitle>
            <CardDescription>
              {loading
                ? "Loading puzzle..."
                : error
                ? "Error loading puzzle"
                : `Puzzle ID: ${puzzle?.id || "Unknown"}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : error ? (
              <div className="text-center py-4">
                <Button onClick={tryDifferentPuzzle} className="w-full">
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-1 flex items-center gap-1">
                    <TrophyIcon className="h-4 w-4 text-primary/70" />
                    Rating
                  </p>
                  <Badge variant="outline" className="bg-primary/5">
                    {puzzle?.rating || "Unknown"}
                  </Badge>
                </div>
                <div>
                  <p className="font-medium mb-1 flex items-center gap-1">
                    <TagIcon className="h-4 w-4 text-primary/70" />
                    Themes
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {puzzle?.themes?.map((theme) => (
                      <Badge key={theme} variant="secondary" className="capitalize">
                        {theme.replace(/-/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                  <p className="font-medium mb-1 flex items-center gap-1">
                    <InfoIcon className="h-4 w-4 text-primary/70" />
                    Instructions
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Find the best move for {orientation === "white" ? "white" : "black"} to unlock this section.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-2 border-t bg-muted/10 p-4">
            <Button onClick={resetPuzzle} variant="outline" disabled={loading || !puzzle || error} className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset Puzzle
            </Button>
            <Button onClick={tryDifferentPuzzle} disabled={loading} className="w-full">
              <ChevronRight className="mr-2 h-4 w-4" /> Try Different Puzzle
            </Button>
          </CardFooter>
        </Card>

        {status === "correct" && (
          <Alert
            variant="default"
            className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900 animate-fadeIn"
          >
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle>Correct!</AlertTitle>
            <AlertDescription>Well done! Section unlocked. Loading content...</AlertDescription>
          </Alert>
        )}

        {status === "incorrect" && (
          <Alert variant="destructive" className="animate-fadeIn">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Incorrect</AlertTitle>
            <AlertDescription>That's not the best move. Loading a new puzzle...</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
