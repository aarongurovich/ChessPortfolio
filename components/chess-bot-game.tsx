"use client"

import { useState, useEffect, useCallback } from "react"
import { Chessboard } from "react-chessboard"
import { Chess } from "chess.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  CheckCircle,
  RotateCcw,
  CastleIcon as ChessKnightIcon,
  TrophyIcon,
  InfoIcon,
  XIcon,
  Clock,
  Crown,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useTheme } from "next-themes"
import { Progress } from "@/components/ui/progress"

export function ChessBotGame({ onSuccess, onClose }) {
  const { resolvedTheme } = useTheme()
  const [game, setGame] = useState(() => new Chess())
  const [orientation, setOrientation] = useState("white")
  const [gameStatus, setGameStatus] = useState(null) // 'checkmate', 'draw', 'ongoing'
  const [winner, setWinner] = useState(null) // 'player', 'bot', null
  const [thinking, setThinking] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [moveHistory, setMoveHistory] = useState([])
  const [botStrength, setBotStrength] = useState(2000)
  const [botThinkingProgress, setBotThinkingProgress] = useState(0)

  useEffect(() => {
    setMounted(true)
    resetGame()
  }, [])

  const resetGame = useCallback(() => {
    const newGame = new Chess()
    setGame(newGame)
    setGameStatus("ongoing")
    setWinner(null)
    setMoveHistory([])
    setOrientation("white") // Player always plays as white for simplicity
  }, [])

  // Function to make a move on the board
  const makeMove = useCallback(
    (move) => {
      try {
        const gameCopy = new Chess(game.fen())
        const result = gameCopy.move(move)

        if (result) {
          setGame(gameCopy)
          setMoveHistory((prev) => [...prev, result.san])

          // Check for game over conditions
          if (gameCopy.isGameOver()) {
            if (gameCopy.isCheckmate()) {
              setGameStatus("checkmate")
              // If it's checkmate and it was the player's move, player wins
              // If it was the bot's move, bot wins
              setWinner(gameCopy.turn() === "b" ? "player" : "bot")
            } else if (gameCopy.isDraw()) {
              setGameStatus("draw")
            }
            return true
          }
          return true
        }
        return false
      } catch (error) {
        console.error("Error making move:", error)
        return false
      }
    },
    [game],
  )

  // Bot makes a move
  const makeBotMove = useCallback(async () => {
    if (game.isGameOver() || thinking) return

    setThinking(true)

    // Simulate bot thinking with progress
    const thinkingTime = 1000 + Math.random() * 1500 // 1-2.5 seconds
    const interval = setInterval(() => {
      setBotThinkingProgress((prev) => {
        const newProgress = prev + 100 / (thinkingTime / 100)
        return newProgress > 100 ? 100 : newProgress
      })
    }, 100)

    try {
      // Wait for the "thinking" time
      await new Promise((resolve) => setTimeout(resolve, thinkingTime))

      // Generate a move based on bot strength
      // This is a simplified bot that makes random legal moves
      // In a real implementation, you would use a chess engine API
      const moves = game.moves({ verbose: true })

      if (moves.length > 0) {
        // Sort moves by a simple evaluation to simulate bot strength
        // Higher strength bots make "better" moves more often
        const sortedMoves = simulateBotEvaluation(moves, botStrength)
        const move = sortedMoves[0]

        makeMove({
          from: move.from,
          to: move.to,
          promotion: move.promotion,
        })
      }
    } catch (error) {
      console.error("Error in bot move:", error)
    } finally {
      clearInterval(interval)
      setBotThinkingProgress(0)
      setThinking(false)
    }
  }, [game, thinking, makeMove, botStrength])

  // Simulate bot evaluation of moves
  const simulateBotEvaluation = (moves, strength) => {
    // This is a very simplified evaluation function
    // A real chess bot would use a proper evaluation function

    // Add a "score" to each move
    const scoredMoves = moves.map((move) => {
      let score = Math.random() * 10 // Base randomness

      // Capturing moves are generally good
      if (move.captured) {
        score += 5

        // Capturing with a less valuable piece is better
        const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9 }
        const capturedValue = pieceValues[move.captured] || 0
        const movingPieceValue = pieceValues[move.piece] || 0

        if (capturedValue > movingPieceValue) {
          score += (capturedValue - movingPieceValue) * 2
        }
      }

      // Check moves are good
      if (move.san.includes("+")) {
        score += 3
      }

      // Checkmate is best
      if (move.san.includes("#")) {
        score += 100
      }

      // Add some randomness based on inverse of bot strength
      // Lower strength = more randomness
      const randomFactor = (3000 - strength) / 1000
      score += Math.random() * randomFactor * 10

      return { ...move, score }
    })

    // Sort by score (highest first)
    return scoredMoves.sort((a, b) => b.score - a.score)
  }

  // Handle player move
  const handlePlayerMove = (sourceSquare, targetSquare) => {
    if (thinking || gameStatus !== "ongoing" || game.turn() !== "w") return false

    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Always promote to queen for simplicity
    }

    const moveSuccess = makeMove(move)

    if (moveSuccess) {
      // If game is not over after player's move, make bot move
      if (!game.isGameOver()) {
        setTimeout(() => {
          makeBotMove()
        }, 300)
      }
    }

    return moveSuccess
  }

  // Watch for game completion
  useEffect(() => {
    if (gameStatus === "checkmate" && winner === "player") {
      // Player won against the bot
      const timer = setTimeout(() => {
        onSuccess()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [gameStatus, winner, onSuccess])

  // Get board colors based on theme
  const getBoardColors = () => {
    if (resolvedTheme === "dark") {
      return {
        boardWidth: 560,
        customDarkSquareStyle: { backgroundColor: "#2d3748" },
        customLightSquareStyle: { backgroundColor: "#4a5568" },
      }
    }
    return {
      boardWidth: 560,
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
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border rounded-xl shadow-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-background border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ChessKnightIcon className="h-6 w-6 text-primary" />
            Secret Chess Challenge
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <XIcon className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-[1fr_350px] gap-6">
            <div className="w-full aspect-square max-w-xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-primary/10 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <Chessboard
                    position={game.fen()}
                    onPieceDrop={handlePlayerMove}
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
            </div>

            <div className="flex flex-col gap-4">
              <Card className="border-primary/20 overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrophyIcon className="h-5 w-5 text-primary" />
                    Chess Bot Challenge
                  </CardTitle>
                  <CardDescription>Beat the 2000-rated bot to unlock a secret section</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                      <p className="font-medium mb-1 flex items-center gap-1">
                        <InfoIcon className="h-4 w-4 text-primary/70" />
                        How to Play
                      </p>
                      <p className="text-sm text-muted-foreground">
                        You play as White. Make your move by dragging and dropping pieces. Beat the bot to unlock a
                        secret section!
                      </p>
                    </div>

                    <div>
                      <p className="font-medium mb-1">Bot Strength</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/5">
                          Rating: {botStrength}
                        </Badge>
                        <Crown className="h-4 w-4 text-yellow-500" />
                      </div>
                    </div>

                    <div>
                      <p className="font-medium mb-1">Game Status</p>
                      <div className="flex items-center gap-2">
                        {gameStatus === "ongoing" && (
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                            {game.turn() === "w" ? "Your Turn" : "Bot's Turn"}
                          </Badge>
                        )}
                        {gameStatus === "checkmate" && (
                          <Badge variant={winner === "player" ? "success" : "destructive"}>
                            {winner === "player" ? "You Won!" : "Bot Won"}
                          </Badge>
                        )}
                        {gameStatus === "draw" && <Badge variant="outline">Draw</Badge>}
                      </div>
                    </div>

                    {thinking && (
                      <div>
                        <p className="font-medium mb-1 flex items-center gap-1">
                          <Clock className="h-4 w-4 text-primary/70" />
                          Bot is thinking...
                        </p>
                        <Progress value={botThinkingProgress} className="h-2" />
                      </div>
                    )}

                    <div>
                      <p className="font-medium mb-1">Move History</p>
                      <div className="bg-muted/30 p-2 rounded-md h-32 overflow-y-auto text-sm font-mono">
                        {moveHistory.length === 0 ? (
                          <p className="text-muted-foreground text-center py-4">No moves yet</p>
                        ) : (
                          <div className="grid grid-cols-2 gap-1">
                            {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => (
                              <div key={i} className="contents">
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">{i + 1}.</span>
                                  <span>{moveHistory[i * 2]}</span>
                                </div>
                                {moveHistory[i * 2 + 1] && (
                                  <div>
                                    <span>{moveHistory[i * 2 + 1]}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col items-stretch gap-2 border-t bg-muted/10 p-4">
                  <Button onClick={resetGame} variant="outline" className="w-full">
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset Game
                  </Button>
                </CardFooter>
              </Card>

              {gameStatus === "checkmate" && winner === "player" && (
                <Alert
                  variant="default"
                  className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900 animate-fadeIn"
                >
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle>Victory!</AlertTitle>
                  <AlertDescription>
                    Congratulations! You've defeated the bot and unlocked the secret section.
                  </AlertDescription>
                </Alert>
              )}

              {gameStatus === "checkmate" && winner === "bot" && (
                <Alert variant="destructive" className="animate-fadeIn">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Defeat</AlertTitle>
                  <AlertDescription>The bot has won this game. Try again!</AlertDescription>
                </Alert>
              )}

              {gameStatus === "draw" && (
                <Alert variant="default" className="animate-fadeIn">
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Draw</AlertTitle>
                  <AlertDescription>The game ended in a draw. Try again to win!</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

