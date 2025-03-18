"use client"

import React, { useState, useEffect, useRef } from "react"
import { Chessboard } from "react-chessboard"
import { Chess } from "chess.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CheckCircle,
  RotateCcw,
  CastleIcon as ChessKnightIcon,
  TrophyIcon,
  InfoIcon,
  Clock,
  XIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  BrainIcon,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useTheme } from "next-themes"
import { Progress } from "@/components/ui/progress"

export function ChessGame({ onSuccess, onClose }) {
  const { resolvedTheme } = useTheme()
  const [game, setGame] = useState(() => new Chess())
  const [orientation, setOrientation] = useState("white")
  const [loading, setLoading] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [gameStatus, setGameStatus] = useState("ongoing") // 'checkmate', 'draw', 'ongoing'
  const [winner, setWinner] = useState(null) // 'player', 'bot', null
  const [moveHistory, setMoveHistory] = useState([])
  const [playerClock, setPlayerClock] = useState(600) // 10 minutes in seconds
  const [botClock, setBotClock] = useState(600)
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [engineThinking, setEngineThinking] = useState(0) // 0-100 progress
  const [lastMove, setLastMove] = useState(null)
  const [engineSkill] = useState(1000) // Engine skill level (hidden from user)

  // For dynamic board sizing
  const boardContainerRef = useRef(null)
  const [boardWidth, setBoardWidth] = useState(400)

  const playerClockIntervalRef = useRef(null)
  const botClockIntervalRef = useRef(null)
  const engineThinkingIntervalRef = useRef(null)
  const engineTimerRef = useRef(null)

  // Update board width on window resize
  useEffect(() => {
    const updateBoardWidth = () => {
      if (boardContainerRef.current) {
        setBoardWidth(boardContainerRef.current.clientWidth)
      }
    }
    updateBoardWidth()
    window.addEventListener("resize", updateBoardWidth)
    return () => window.removeEventListener("resize", updateBoardWidth)
  }, [])

  // Initialize the game
  useEffect(() => {
    setMounted(true)
    initializeGame()

    return () => {
      clearInterval(playerClockIntervalRef.current)
      clearInterval(botClockIntervalRef.current)
      clearInterval(engineThinkingIntervalRef.current)
      clearTimeout(engineTimerRef.current)
    }
  }, [])

  // Initialize the chess game
  const initializeGame = () => {
    const newGame = new Chess()
    setGame(newGame)
    setMoveHistory([])
    setGameStatus("ongoing")
    setWinner(null)
    setPlayerClock(600)
    setBotClock(600)
    setIsPlayerTurn(orientation === "white")
    setLoading(false)
    setLastMove(null)

    clearInterval(playerClockIntervalRef.current)
    clearInterval(botClockIntervalRef.current)

    // Start player clock if player is white
    if (orientation === "white") {
      startPlayerClock()
    } else {
      // If player is black, make the engine move first
      setTimeout(() => {
        makeEngineMove(newGame)
      }, 500)
    }
  }

  // Start player clock
  const startPlayerClock = () => {
    clearInterval(playerClockIntervalRef.current)
    playerClockIntervalRef.current = setInterval(() => {
      setPlayerClock((prev) => {
        if (prev <= 0) {
          clearInterval(playerClockIntervalRef.current)
          handleTimeout("player")
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Start bot clock
  const startBotClock = () => {
    clearInterval(botClockIntervalRef.current)
    botClockIntervalRef.current = setInterval(() => {
      setBotClock((prev) => {
        if (prev <= 0) {
          clearInterval(botClockIntervalRef.current)
          handleTimeout("bot")
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Handle timeout
  const handleTimeout = (side) => {
    if (side === "player") {
      setGameStatus("timeout")
      setWinner("bot")
    } else {
      setGameStatus("timeout")
      setWinner("player")
      // Player wins, trigger success callback
      setTimeout(() => {
        onSuccess()
      }, 2000)
    }
  }

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Piece values for evaluation
  const pieceValues = {
    p: 100, // pawn
    n: 320, // knight
    b: 330, // bishop
    r: 500, // rook
    q: 900, // queen
    k: 20000, // king
  }

  // Position bonuses for piece placement (simplified)
  const positionBonus = {
    p: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [50, 50, 50, 50, 50, 50, 50, 50],
      [10, 10, 20, 30, 30, 20, 10, 10],
      [5, 5, 10, 25, 25, 10, 5, 5],
      [0, 0, 0, 20, 20, 0, 0, 0],
      [5, -5, -10, 0, 0, -10, -5, 5],
      [5, 10, 10, -20, -20, 10, 10, 5],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    n: [
      [-50, -40, -30, -30, -30, -30, -40, -50],
      [-40, -20, 0, 0, 0, 0, -20, -40],
      [-30, 0, 10, 15, 15, 10, 0, -30],
      [-30, 5, 15, 20, 20, 15, 5, -30],
      [-30, 0, 15, 20, 20, 15, 0, -30],
      [-30, 5, 10, 15, 15, 10, 5, -30],
      [-40, -20, 0, 5, 5, 0, -20, -40],
      [-50, -40, -30, -30, -30, -30, -40, -50],
    ],
    b: [
      [-20, -10, -10, -10, -10, -10, -10, -20],
      [-10, 0, 0, 0, 0, 0, 0, -10],
      [-10, 0, 10, 10, 10, 10, 0, -10],
      [-10, 5, 5, 10, 10, 5, 5, -10],
      [-10, 0, 5, 10, 10, 5, 0, -10],
      [-10, 10, 10, 10, 10, 10, 10, -10],
      [-10, 5, 0, 0, 0, 0, 5, -10],
      [-20, -10, -10, -10, -10, -10, -10, -20],
    ],
    r: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [5, 10, 10, 10, 10, 10, 10, 5],
      [-5, 0, 0, 0, 0, 0, 0, -5],
      [-5, 0, 0, 0, 0, 0, 0, -5],
      [-5, 0, 0, 0, 0, 0, 0, -5],
      [-5, 0, 0, 0, 0, 0, 0, -5],
      [-5, 0, 0, 0, 0, 0, 0, -5],
      [0, 0, 0, 5, 5, 0, 0, 0],
    ],
    q: [
      [-20, -10, -10, -5, -5, -10, -10, -20],
      [-10, 0, 0, 0, 0, 0, 0, -10],
      [-10, 0, 5, 5, 5, 5, 0, -10],
      [-5, 0, 5, 5, 5, 5, 0, -5],
      [0, 0, 5, 5, 5, 5, 0, -5],
      [-10, 5, 5, 5, 5, 5, 0, -10],
      [-10, 0, 5, 0, 0, 0, 0, -10],
      [-20, -10, -10, -5, -5, -10, -10, -20],
    ],
    k: [
      [-30, -40, -40, -50, -50, -40, -40, -30],
      [-30, -40, -40, -50, -50, -40, -40, -30],
      [-30, -40, -40, -50, -50, -40, -40, -30],
      [-30, -40, -40, -50, -50, -40, -40, -30],
      [-20, -30, -30, -40, -40, -30, -30, -20],
      [-10, -20, -20, -20, -20, -20, -20, -10],
      [20, 20, 0, 0, 0, 0, 20, 20],
      [20, 30, 10, 0, 0, 10, 30, 20],
    ],
  }

  // Evaluate a position for the current player
  const evaluatePosition = (board, isMaximizing) => {
    let score = 0

    // Count material
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const square = board[i][j]
        if (square) {
          // Add piece value
          const pieceValue = pieceValues[square.type] || 0
          const isWhitePiece = square.color === "w"

          // Add bonus for position
          let posBonus = 0
          if (positionBonus[square.type]) {
            // For black pieces, we need to flip the board for the position bonus
            const row = isWhitePiece ? 7 - i : i
            posBonus = positionBonus[square.type][row][j]
          }

          // Update score
          if ((isWhitePiece && isMaximizing) || (!isWhitePiece && !isMaximizing)) {
            score += pieceValue + posBonus
          } else {
            score -= pieceValue + posBonus
          }
        }
      }
    }

    return score
  }

  // Minimax algorithm with alpha-beta pruning
  const minimax = (position, depth, alpha, beta, isMaximizing) => {
    if (depth === 0 || position.isGameOver()) {
      return evaluatePosition(position.board(), isMaximizing)
    }

    const moves = position.moves({ verbose: true })

    // Sort moves to improve alpha-beta pruning
    moves.sort((a, b) => {
      // Prioritize captures
      const aCapture = a.captured ? pieceValues[a.captured] : 0
      const bCapture = b.captured ? pieceValues[b.captured] : 0
      return bCapture - aCapture
    })

    if (isMaximizing) {
      let maxEval = Number.NEGATIVE_INFINITY
      for (const move of moves) {
        const newPosition = new Chess(position.fen())
        newPosition.move(move)
        const evaluation = minimax(newPosition, depth - 1, alpha, beta, false)
        maxEval = Math.max(maxEval, evaluation)
        alpha = Math.max(alpha, evaluation)
        if (beta <= alpha) break
      }
      return maxEval
    } else {
      let minEval = Number.POSITIVE_INFINITY
      for (const move of moves) {
        const newPosition = new Chess(position.fen())
        newPosition.move(move)
        const evaluation = minimax(newPosition, depth - 1, alpha, beta, true)
        minEval = Math.min(minEval, evaluation)
        beta = Math.min(beta, evaluation)
        if (beta <= alpha) break
      }
      return minEval
    }
  }

  // Find the best move for the engine
  const findBestMove = (position, depth) => {
    const isMaximizing = position.turn() === "w"
    const moves = position.moves({ verbose: true })

    if (moves.length === 0) {
      return null
    }

    // Sort moves to improve alpha-beta pruning
    moves.sort((a, b) => {
      // Prioritize captures
      const aCapture = a.captured ? pieceValues[a.captured] : 0
      const bCapture = b.captured ? pieceValues[b.captured] : 0
      return bCapture - aCapture
    })

    let bestMove = moves[0] // Default to first move to avoid null
    let bestEval = isMaximizing ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY

    for (const move of moves) {
      try {
        const newPosition = new Chess(position.fen())
        const moveResult = newPosition.move(move)

        if (!moveResult) {
          console.warn("Invalid move detected in findBestMove:", move)
          continue
        }

        const evaluation = minimax(
          newPosition,
          depth - 1,
          Number.NEGATIVE_INFINITY,
          Number.POSITIVE_INFINITY,
          !isMaximizing,
        )

        if (isMaximizing && evaluation > bestEval) {
          bestEval = evaluation
          bestMove = move
        } else if (!isMaximizing && evaluation < bestEval) {
          bestEval = evaluation
          bestMove = move
        }
      } catch (error) {
        console.error("Error evaluating move in findBestMove:", error)
        continue
      }
    }

    // Add randomness based on engine skill level
    // Lower skill means more chance of not picking the best move
    const skillFactor = Math.min(1, Math.max(0, (engineSkill - 1400) / 1000))

    if (Math.random() > skillFactor && moves.length > 1) {
      // Choose a random move that isn't the best
      const otherMoves = moves.filter((m) => m.from !== bestMove.from || m.to !== bestMove.to)
      if (otherMoves.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherMoves.length)
        return otherMoves[randomIndex]
      }
    }

    return bestMove
  }

  // Simulate bot evaluation of moves
  const simulateBotEvaluation = (moves, strength) => {
    // This is a simplified evaluation function
    // A real chess bot would use a proper evaluation function

    // Add a "score" to each move
    const scoredMoves = moves.map((move) => {
      let score = Math.random() * 5 // Reduced base randomness (from 10)

      // Capturing moves are generally good
      if (move.captured) {
        score += 8 // Increased from 5

        // Capturing with a less valuable piece is better
        const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9 }
        const capturedValue = pieceValues[move.captured] || 0
        const movingPieceValue = pieceValues[move.piece] || 0

        if (capturedValue > movingPieceValue) {
          score += (capturedValue - movingPieceValue) * 3 // Increased from 2
        }
      }

      // Check moves are good
      if (move.san.includes("+")) {
        score += 5 // Increased from 3
      }

      // Checkmate is best
      if (move.san.includes("#")) {
        score += 200 // Increased from 100
      }

      // Add some randomness based on inverse of bot strength
      // Lower strength = more randomness
      const randomFactor = (3000 - strength) / 1500 // Reduced randomness factor
      score += Math.random() * randomFactor * 5 // Reduced from 10

      return { ...move, score }
    })

    // Sort by score (highest first)
    return scoredMoves.sort((a, b) => b.score - a.score)
  }

  // Make engine move
  const makeEngineMove = (currentGame) => {
    if (thinking || !currentGame || currentGame.isGameOver()) return

    setThinking(true)
    clearInterval(botClockIntervalRef.current)

    // Start a fake "thinking" progress bar
    setEngineThinking(0)
    engineThinkingIntervalRef.current = setInterval(() => {
      setEngineThinking((prev) => {
        const increment = Math.random() * 5 + 1
        return Math.min(prev + increment, 95) // Never reach 100 until move is made
      })
    }, 100)

    // Delay the engine's move to simulate thinking time
    const thinkingTime = 1000 + Math.random() * 1500

    engineTimerRef.current = setTimeout(() => {
      try {
        // Make sure we're working with a valid game state
        const gameToUse = new Chess(currentGame.fen())

        // Check if the game is over
        if (gameToUse.isGameOver()) {
          handleGameOver(gameToUse)
          clearInterval(engineThinkingIntervalRef.current)
          setEngineThinking(100)
          setThinking(false)
          return
        }

        // Get a random legal move directly from chess.js
        const legalMoves = gameToUse.moves({ verbose: true })
        if (legalMoves.length === 0) {
          // No legal moves available
          clearInterval(engineThinkingIntervalRef.current)
          setEngineThinking(100)
          setThinking(false)
          return
        }

        // Choose a random move
        const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)]

        // Make the move
        const moveObj = gameToUse.move(randomMove)

        if (moveObj) {
          setLastMove({ from: randomMove.from, to: randomMove.to })
          setGame(gameToUse)
          setMoveHistory((prev) => [...prev, moveObj])

          // Check for game end
          if (gameToUse.isGameOver()) {
            handleGameOver(gameToUse)
          }
        }

        clearInterval(botClockIntervalRef.current)
        startPlayerClock()
        setIsPlayerTurn(true)
      } catch (error) {
        console.error("Engine error:", error)

        // Recovery: try to make a random legal move
        try {
          const recoveryGame = new Chess(game.fen())
          const legalMoves = recoveryGame.moves({ verbose: true })

          if (legalMoves.length > 0) {
            const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)]
            const moveObj = recoveryGame.move(randomMove)

            setLastMove({ from: randomMove.from, to: randomMove.to })
            setGame(recoveryGame)
            setMoveHistory((prev) => [...prev, moveObj])

            if (recoveryGame.isGameOver()) {
              handleGameOver(recoveryGame)
            }
          }

          clearInterval(botClockIntervalRef.current)
          startPlayerClock()
          setIsPlayerTurn(true)
        } catch (recoveryError) {
          console.error("Failed to recover from engine error:", recoveryError)
        }
      } finally {
        clearInterval(engineThinkingIntervalRef.current)
        setEngineThinking(100)
        setThinking(false)
      }
    }, thinkingTime)
  }

  // Handle player move
  const handlePlayerMove = (from, to) => {
    if (!isPlayerTurn || gameStatus !== "ongoing") return false

    try {
      // Check if the piece belongs to the player's color
      const piece = game.get(from)
      if (
        !piece ||
        (orientation === "white" && piece.color !== "w") ||
        (orientation === "black" && piece.color !== "b")
      ) {
        return false
      }

      // Try to make the move
      const newGame = new Chess(game.fen())
      const moveObj = newGame.move({
        from,
        to,
        promotion: "q", // Always promote to queen for simplicity
      })

      // If the move is invalid, return false
      if (!moveObj) return false

      setLastMove({ from, to })
      setGame(newGame)
      setMoveHistory((prev) => [...prev, moveObj])

      // Check for game end
      if (newGame.isGameOver()) {
        handleGameOver(newGame)
        return true
      }

      // Switch to engine's turn
      clearInterval(playerClockIntervalRef.current)
      startBotClock()
      setIsPlayerTurn(false)

      // Make engine move after a short delay
      setTimeout(() => {
        makeEngineMove(newGame)
      }, 500)

      return true
    } catch (error) {
      console.error("Error making player move:", error)
      return false
    }
  }

  // Handle game over
  const handleGameOver = (currentGame) => {
    clearInterval(playerClockIntervalRef.current)
    clearInterval(botClockIntervalRef.current)

    if (currentGame.isCheckmate()) {
      setGameStatus("checkmate")
      // Determine winner
      const lastMoveColor = currentGame.history().length % 2 === 0 ? "black" : "white"
      const playerWon =
        (orientation === "white" && lastMoveColor === "white") || (orientation === "black" && lastMoveColor === "black")

      setWinner(playerWon ? "player" : "bot")

      // If player won, trigger success callback
      if (playerWon) {
        setTimeout(() => {
          if (onSuccess) onSuccess()
        }, 2000)
      }
    } else if (currentGame.isDraw()) {
      setGameStatus("draw")
      setWinner(null)
    } else if (currentGame.isStalemate()) {
      setGameStatus("stalemate")
      setWinner(null)
    } else if (currentGame.isThreefoldRepetition()) {
      setGameStatus("repetition")
      setWinner(null)
    } else if (currentGame.isInsufficientMaterial()) {
      setGameStatus("insufficient")
      setWinner(null)
    }
  }

  // Reset the game
  const resetGame = () => {
    clearInterval(playerClockIntervalRef.current)
    clearInterval(botClockIntervalRef.current)
    clearInterval(engineThinkingIntervalRef.current)
    clearTimeout(engineTimerRef.current)
    initializeGame()
  }

  // Switch sides
  const switchSides = () => {
    setOrientation((prev) => (prev === "white" ? "black" : "white"))
    resetGame()
  }

  // Get board colors and dynamic board width based on theme
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

  // Get status message
  const getStatusMessage = () => {
    switch (gameStatus) {
      case "checkmate":
        return winner === "player" ? "Checkmate! You win!" : "Checkmate! You lose."
      case "draw":
        return "Game drawn by agreement."
      case "stalemate":
        return "Game drawn by stalemate."
      case "repetition":
        return "Game drawn by threefold repetition."
      case "insufficient":
        return "Game drawn by insufficient material."
      case "timeout":
        return winner === "player" ? "Engine ran out of time! You win!" : "You ran out of time! You lose."
      default:
        return isPlayerTurn ? "Your move" : "Engine is thinking..."
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
      {/* Chess Board Container with updated responsive classes */}
      <div className="w-full aspect-square max-w-xl mx-auto md:max-w-full md:mx-0" ref={boardContainerRef}>
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-xl border">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Initializing chess engine...</p>
            </div>
          </div>
        ) : (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-primary/10 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <Chessboard
                position={game.fen()}
                onPieceDrop={(sourceSquare, targetSquare) => handlePlayerMove(sourceSquare, targetSquare)}
                boardOrientation={orientation}
                customSquareStyles={
                  lastMove
                    ? {
                        [lastMove.from]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
                        [lastMove.to]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
                      }
                    : {}
                }
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

      {/* Game Panel */}
      <div className="flex flex-col gap-4">
        <Card className="border-primary/20 overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChessKnightIcon className="h-5 w-5 text-primary" />
              Chess Challenge
            </CardTitle>
            <CardDescription>Beat the chess engine to unlock the secret section</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${orientation === "white" ? "bg-white border border-gray-300" : "bg-gray-800"}`}
                  ></div>
                  <span className="font-medium">You ({orientation === "white" ? "White" : "Black"})</span>
                </div>
                <div className="bg-muted px-3 py-1 rounded-md font-mono">
                  <Clock className="inline-block h-4 w-4 mr-1" />
                  {formatTime(playerClock)}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${orientation !== "white" ? "bg-white border border-gray-300" : "bg-gray-800"}`}
                  ></div>
                  <span className="font-medium">Engine</span>
                </div>
                <div className="bg-muted px-3 py-1 rounded-md font-mono">
                  <Clock className="inline-block h-4 w-4 mr-1" />
                  {formatTime(botClock)}
                </div>
              </div>

              {thinking && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Engine thinking...</span>
                    <span>{engineThinking.toFixed(0)}%</span>
                  </div>
                  <Progress value={engineThinking} className="h-2" />
                </div>
              )}

              <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                <p className="font-medium mb-1 flex items-center gap-1">
                  <InfoIcon className="h-4 w-4 text-primary/70" />
                  Status
                </p>
                <p className="text-sm">{getStatusMessage()}</p>
              </div>

              <div>
                <p className="font-medium mb-2 flex items-center gap-1">
                  <TrophyIcon className="h-4 w-4 text-primary/70" />
                  Last Moves
                </p>
                <div className="bg-muted/30 rounded-md p-2 h-24 overflow-y-auto text-sm font-mono">
                  {moveHistory.length === 0 ? (
                    <p className="text-muted-foreground text-center py-2">No moves yet</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-1">
                      {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => (
                        <React.Fragment key={i}>
                          <div className={`px-2 py-1 rounded ${i % 2 === 0 ? "bg-muted/30" : "bg-muted/10"}`}>
                            {i + 1}. {moveHistory[i * 2]?.san || ""}
                          </div>
                          {moveHistory[i * 2 + 1] && (
                            <div className={`px-2 py-1 rounded ${i % 2 === 0 ? "bg-muted/30" : "bg-muted/10"}`}>
                              {moveHistory[i * 2 + 1].san}
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-2 border-t bg-muted/10 p-4">
            <div className="flex gap-2">
              <Button onClick={resetGame} variant="outline" className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" /> New Game
              </Button>
              <Button onClick={switchSides} variant="outline" className="flex-1">
                <XIcon className="mr-2 h-4 w-4" /> Switch Sides
              </Button>
            </div>
            <Button variant="default" className="w-full" disabled={gameStatus !== "ongoing"}>
              <BrainIcon className="mr-2 h-4 w-4" /> Playing as {orientation}
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
            <AlertDescription>Congratulations! You've defeated the chess engine. Well played!</AlertDescription>
          </Alert>
        )}

        {gameStatus && gameStatus !== "ongoing" && winner !== "player" && (
          <Alert variant={winner === "bot" ? "destructive" : "default"} className="animate-fadeIn">
            {winner === "bot" ? <ThumbsDownIcon className="h-4 w-4" /> : <ThumbsUpIcon className="h-4 w-4" />}
            <AlertTitle>{winner === "bot" ? "Defeat" : "Draw"}</AlertTitle>
            <AlertDescription>
              {winner === "bot"
                ? "You lost the game. Try again to unlock the secret section!"
                : "The game ended in a draw. Try again for a win to unlock the secret section!"}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
