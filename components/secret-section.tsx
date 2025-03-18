"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  UnlockIcon,
  TrophyIcon,
  StarIcon,
  BrainIcon,
  RocketIcon,
  HeartIcon,
  CastleIcon as ChessKnightIcon,
  BookOpenIcon,
  GraduationCapIcon,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function SecretSection() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="overflow-hidden border-primary/20">
        <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-full"></div>
        <CardHeader className="border-b bg-muted/10">
          <div className="flex items-center gap-2">
            <TrophyIcon className="h-5 w-5 text-primary" />
            <CardTitle>Secret Chess Achievements</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <StarIcon className="h-5 w-5 text-amber-500" />
                Tournament Achievements
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Badge className="mt-1 bg-amber-500 shrink-0">1st</Badge>
                  <div>
                    <p className="font-medium">U1200 Section - 53rd American Open</p>
                    <p className="text-sm text-muted-foreground">
                      Tournament in Costa Mesa, California with 35 players
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="mt-1 bg-gray-400 shrink-0">2nd</Badge>
                  <div>
                    <p className="font-medium">U1500 Section - Dreaming King Open</p>
                    <p className="text-sm text-muted-foreground">Tournament in San Diego, California with 31 players</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="mt-1 bg-amber-500 shrink-0">1st</Badge>
                  <div>
                    <p className="font-medium">U1400 Section - 25th Western Class Championships</p>
                    <p className="text-sm text-muted-foreground">Tournament in Van Nuys, California with 28 players</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="mt-1 bg-amber-700 shrink-0">3rd</Badge>
                  <div>
                    <p className="font-medium">U1600 Section - 43rd Annual Lina Grumette Memorial</p>
                    <p className="text-sm text-muted-foreground">Tournament in Van Nuys, California with 26 players</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="mt-1 bg-gray-400 shrink-0">2nd</Badge>
                  <div>
                    <p className="font-medium">U1700 Section - 2023 National Open</p>
                    <p className="text-sm text-muted-foreground">Tournament in Las Vegas, Nevada with 166 players</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="mt-1 bg-gray-400 shrink-0">2nd</Badge>
                  <div>
                    <p className="font-medium">U1900 Section - 28th Annual Pacific Coast Open</p>
                    <p className="text-sm text-muted-foreground">Tournament in Van Nuys, California with 49 players</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="mt-1 bg-amber-700 shrink-0">3rd</Badge>
                  <div>
                    <p className="font-medium">U1900 Section - 2024 National Open</p>
                    <p className="text-sm text-muted-foreground">Tournament in Las Vegas, Nevada with 160 players</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="mt-1 bg-gray-400 shrink-0">2nd</Badge>
                  <div>
                    <p className="font-medium">U1900 Section - 34th North American Open</p>
                    <p className="text-sm text-muted-foreground">Tournament in Las Vegas, Nevada with 168 players</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <ChessKnightIcon className="h-5 w-5 text-primary" />
                Chess Journey
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <RocketIcon className="h-4 w-4 text-primary/70 shrink-0" />
                  <p>
                    <span className="font-medium">Peak Rating:</span> 1922 USCF
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <HeartIcon className="h-4 w-4 text-primary/70 shrink-0" />
                  <p>
                    <span className="font-medium">Favorite Opening:</span> Dragon Sicilian Defense (as Black), English
                    Opening (as White)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <BrainIcon className="h-4 w-4 text-primary/70 shrink-0" />
                  <p>
                    <span className="font-medium">Playing Style:</span> Positional strategist who excels at long-term
                    planning and methodically outmaneuvering opponents in complex positions.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpenIcon className="h-4 w-4 text-primary/70 shrink-0" />
                  <p>
                    <span className="font-medium">Chess Influences:</span> Jose Capablanca, Magnus Carlsen, Garry
                    Kasparov
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <GraduationCapIcon className="h-5 w-5 text-primary" />
                Chess Education & Outreach
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-primary/5 p-3 rounded-lg">
                  <p className="font-medium mb-1">Tournament Volunteer</p>
                  <p className="text-sm text-muted-foreground">
                    Active tournament volunteer in Lubbock, helping organize events and promote chess in the community
                  </p>
                </div>
                <div className="bg-primary/5 p-3 rounded-lg">
                  <p className="font-medium mb-1">Chess Instructor</p>
                  <p className="text-sm text-muted-foreground">
                    Former chess instructor for after school programs, introducing young students to the fundamentals of
                    chess strategy and critical thinking
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 text-center">
        <p className="text-sm text-muted-foreground">
          <UnlockIcon className="inline-block h-4 w-4 mr-1" />
          Congratulations on your victory against the chess engine! You've unlocked this exclusive showcase of my
          competitive chess journey and achievements across the United States.
        </p>
      </div>
    </div>
  )
}

