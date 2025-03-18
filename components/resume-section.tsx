"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  GraduationCapIcon,
  BriefcaseIcon,
  CodeIcon,
  TrophyIcon,
  BookOpenIcon,
  CalendarIcon,
  StarIcon,
  WrenchIcon,
  LayoutIcon,
  PenToolIcon as ToolIcon,
  DatabaseIcon,
  BrainIcon,
  LockIcon,
  ServerIcon,
  FilterIcon,
  ZapIcon,
  SearchIcon,
  TableIcon,
  BarChart2Icon,
  ShieldIcon,
  TreesIcon as TreeIcon,
  KeyIcon,
} from "lucide-react"

export function ResumeSection({ section, unlockedSections = {} }) {
  const isSkillsUnlocked = unlockedSections.skills || false

  const renderEducation = () => (
    <Card className="mb-6 overflow-hidden border-primary/20">
      <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-full"></div>
      <CardHeader className="border-b bg-muted/10">
        <div className="flex items-center gap-2">
          <GraduationCapIcon className="h-5 w-5 text-primary" />
          <CardTitle>Education</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="relative pl-4 border-l-2 border-primary/30">
            <h3 className="text-xl font-semibold">Texas Tech University</h3>
            <p className="text-muted-foreground mb-2">Lubbock, TX, USA</p>
            <div className="space-y-1">
              <p className="flex items-center gap-2">
                <BookOpenIcon className="h-4 w-4 text-primary/70" />
                <span>Computer Science B.S. / Minor in Mathematics</span>
              </p>
              <p className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-primary/70" />
                <span>Graduation: May 2026</span>
              </p>
              <p className="flex items-center gap-2">
                <StarIcon className="h-4 w-4 text-primary/70" />
                <span>GPA: 3.76</span>
              </p>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Relevant Coursework</h4>
              <div className="flex flex-wrap gap-1">
                {[
                  "Object-Oriented Programming (Java)",
                  "Data Structures (C)",
                  "Programming Principles (C)",
                  "Computer Architecture",
                  "Linear Algebra",
                  "Calculus I-III",
                  "Mathematical Statistics for Engineers",
                  "Modern Digital System Design",
                ].map((course) => (
                  <Badge key={course} variant="outline" className="mb-1">
                    {course}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Achievements/Awards</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>President's List</li>
                <li>Dean's List</li>
                <li>Presidential Transfer Scholarship</li>
                <li>Competitive Chess Scholarship</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderExperience = () => (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BriefcaseIcon className="h-5 w-5" />
          <CardTitle>Experience</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">Texas Tech University | Research Assistant</h3>
              <Badge>Lubbock, TX, USA</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">October 2024 – Present</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Developed <span className="font-medium">MalScape</span>, a full-stack interactive network visualization
                tool using
                <Badge variant="secondary" className="ml-1">
                  Cytoscape.js
                </Badge>
                <Badge variant="secondary" className="ml-1">
                  Flask
                </Badge>
                <Badge variant="secondary" className="ml-1">
                  Pandas
                </Badge>
                , enabling cybersecurity analysts to upload CSV data for visualizing and analyzing network activity.
              </li>
              <li className="flex gap-2">
                <FilterIcon className="h-4 w-4 text-primary/70 mt-1 flex-shrink-0" />
                <span>
                  Designed advanced <span className="font-medium">filtering</span>,{" "}
                  <span className="font-medium">clustering</span>, and{" "}
                  <span className="font-medium">protocol-based grouping</span> features to help cybersecurity analysts
                  efficiently detect and investigate anomalies.
                </span>
              </li>
              <li className="flex gap-2">
                <ServerIcon className="h-4 w-4 text-primary/70 mt-1 flex-shrink-0" />
                <span>
                  Optimized and personally developed the backend data processing system using the{" "}
                  <span className="font-medium">High Performance Computing Center</span> at my university, utilizing{" "}
                  <span className="font-medium">vectorized operations</span>,{" "}
                  <span className="font-medium">IP classification</span>, and{" "}
                  <span className="font-medium">Union-Find clustering</span> to significantly improve performance when
                  handling large-scale datasets.
                </span>
              </li>
              <li className="flex gap-2">
                <ZapIcon className="h-4 w-4 text-primary/70 mt-1 flex-shrink-0" />
                <span>
                  Contributed to a <span className="font-medium">50–80% reduction</span> in incident response times by
                  automating key investigative tasks and providing intuitive data visualization.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">ProofPerks | Software Developer Intern</h3>
              <Badge>Remote</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">August 2024 – December 2024</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Deployed <span className="font-medium">biometric verification models</span> using{" "}
                <Badge variant="secondary">Python</Badge>, improving model accuracy.
              </li>
              <li className="flex gap-2">
                <DatabaseIcon className="h-4 w-4 text-primary/70 mt-1 flex-shrink-0" />
                <span>
                  Optimized complex <span className="font-medium">PostgreSQL queries</span> by implementing strategic
                  indexing, query refactoring, and performance tuning, achieving a{" "}
                  <span className="font-medium">35% reduction</span> in execution times and substantially boosting
                  database performance.
                </span>
              </li>
              <li className="flex gap-2">
                <ZapIcon className="h-4 w-4 text-primary/70 mt-1 flex-shrink-0" />
                <span>
                  Implemented a robust <span className="font-medium">Redis caching</span> layer to offload frequent
                  query loads, resulting in a <span className="font-medium">50% reduction</span> in response times under
                  high-concurrency conditions.
                </span>
              </li>
              <li>
                Refactored and streamlined backend logic for deployment on{" "}
                <span className="font-medium">Google Cloud Server</span> infrastructure, reducing latency and enhancing
                overall request handling efficiency.
              </li>
              <li>
                Developed and integrated <span className="font-medium">high-performance data pipelines</span> for{" "}
                <span className="font-medium">real-time processing</span> of biometric data, ensuring{" "}
                <span className="font-medium">scalable ingestion</span> and processing capabilities to support future
                system growth.
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderProjects = () => (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CodeIcon className="h-5 w-5" />
          <CardTitle>Projects</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">Banking Management System</h3>
              <div className="flex gap-1">
                <Badge variant="outline">Python</Badge>
              </div>
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li className="flex gap-2">
                <LayoutIcon className="h-4 w-4 text-primary/70 mt-1 flex-shrink-0" />
                <span>
                  Engineered a comprehensive <span className="font-medium">banking simulation system</span> featuring
                  robust <span className="font-medium">account management</span>,{" "}
                  <span className="font-medium">transaction processing</span>, and{" "}
                  <span className="font-medium">financial reporting</span> functionalities.
                </span>
              </li>
              <li className="flex gap-2">
                <TableIcon className="h-4 w-4 text-primary/70 mt-1 flex-shrink-0" />
                <span>
                  Leveraged efficient data structures, including <span className="font-medium">arrays/lists</span> for
                  optimal account storage, <span className="font-medium">queues/stacks</span> for streamlined
                  transaction handling, and implemented <span className="font-medium">binary search</span> for rapid
                  account retrieval.
                </span>
              </li>
              <li className="flex gap-2">
                <BarChart2Icon className="h-4 w-4 text-primary/70 mt-1 flex-shrink-0" />
                <span>
                  Developed high-performance <span className="font-medium">financial reporting</span> tools by
                  integrating advanced algorithms such as <span className="font-medium">merge sort</span> and{" "}
                  <span className="font-medium">quicksort</span> to accurately rank accounts by balance, significantly
                  enhancing data retrieval efficiency.
                </span>
              </li>
              <li className="flex gap-2">
                <ShieldIcon className="h-4 w-4 text-primary/70 mt-1 flex-shrink-0" />
                <span>
                  Guaranteed <span className="font-medium">data integrity</span> and{" "}
                  <span className="font-medium">security</span> through rigorous{" "}
                  <span className="font-medium">input validation</span>,{" "}
                  <span className="font-medium">error handling</span>, and enforcing{" "}
                  <span className="font-medium">hierarchical access control</span> via tree and graph-based structures.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">Real Estate Property Search</h3>
              <div className="flex gap-1">
                <Badge variant="outline">Python</Badge>
              </div>
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li className="flex gap-2">
                <TreeIcon className="h-4 w-4 text-primary/70 mt-1 flex-shrink-0" />
                <span>
                  Architected an innovative <span className="font-medium">spatial property search system</span>{" "}
                  leveraging <span className="font-medium">R-tree indexing</span> to efficiently store and query
                  multidimensional real estate datasets.
                </span>
              </li>
              <li className="flex gap-2">
                <SearchIcon className="h-4 w-4 text-primary/70 mt-1 flex-shrink-0" />
                <span>
                  Integrated sophisticated <span className="font-medium">range queries</span>,{" "}
                  <span className="font-medium">nearest neighbor searches</span>, and{" "}
                  <span className="font-medium">multi-criteria filtering</span> mechanisms to optimize property
                  retrieval based on location, price, and features.
                </span>
              </li>
              <li className="flex gap-2">
                <FilterIcon className="h-4 w-4 text-primary/70 mt-1 flex-shrink-0" />
                <span>
                  Deployed advanced sorting algorithms (<span className="font-medium">merge sort</span> and{" "}
                  <span className="font-medium">quicksort</span>) in conjunction with{" "}
                  <span className="font-medium">priority queues</span> for swift and accurate ranking of property
                  listings.
                </span>
              </li>
              <li className="flex gap-2">
                <ZapIcon className="h-4 w-4 text-primary/70 mt-1 flex-shrink-0" />
                <span>
                  Enhanced overall system performance by optimizing{" "}
                  <span className="font-medium">database operations</span> and{" "}
                  <span className="font-medium">indexing</span> strategies, significantly boosting search efficiency and
                  elevating real estate market analysis.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderActivities = () => (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrophyIcon className="h-5 w-5" />
          <CardTitle>Activities</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Chess Team Member</h3>
            <p>
              Represented Texas Tech in national tournaments, refining strategic thinking and decision-making under
              pressure. Volunteered at local tournaments to support chess outreach in the community. USCF: 1907.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Hillel Member</h3>
            <p>
              Engaged in Hillel's cultural and community programs, fostering connections among Jewish students through
              discussions, events, and leadership opportunities.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderSkills = () => (
    <Card className="border-primary/20 overflow-hidden">
      <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-full"></div>
      <CardHeader className="border-b bg-muted/10">
        <div className="flex items-center gap-2">
          <WrenchIcon className="h-5 w-5 text-primary" />
          <CardTitle>Skills</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <CodeIcon className="h-4 w-4 text-primary/70" />
              Programming Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Python", "Java", "JavaScript", "C", "SQL"].map((skill) => (
                <Badge key={skill} variant="secondary" className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <LayoutIcon className="h-4 w-4 text-primary/70" />
              Libraries/Frameworks
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Node.js", "Express.js", "D3.js", "React.js", "Flask", "Pandas", "Cytoscape.js"].map((skill) => (
                <Badge key={skill} variant="secondary" className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <ToolIcon className="h-4 w-4 text-primary/70" />
              Tools / Platforms
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Git", "VS Code", "GitHub", "Docker", "Linux", "Cloudflare", "AWS/GCP"].map((skill) => (
                <Badge key={skill} variant="secondary" className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <DatabaseIcon className="h-4 w-4 text-primary/70" />
              Databases
            </h3>
            <div className="flex flex-wrap gap-2">
              {["PostgreSQL", "Redis"].map((skill) => (
                <Badge key={skill} variant="secondary" className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderSkillsLockedMessage = () => (
    <Card className="border-primary/20 overflow-hidden">
      <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-full"></div>
      <CardHeader className="border-b bg-muted/10">
        <div className="flex items-center gap-2">
          <WrenchIcon className="h-5 w-5 text-primary" />
          <CardTitle>Skills</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <LockIcon className="h-8 w-8 text-muted-foreground/70" />
          </div>
          <h3 className="text-lg font-medium mb-2">Skills Section Locked</h3>
          <p className="text-muted-foreground max-w-md">
            Solve the Skills puzzle to unlock detailed information about my technical and soft skills.
          </p>
        </div>
      </CardContent>
    </Card>
  )

  const renderExpandedSkills = () => (
    <>
      <Card className="mb-6 border-primary/20 overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-full"></div>
        <CardHeader className="border-b bg-muted/10">
          <div className="flex items-center gap-2">
            <WrenchIcon className="h-5 w-5 text-primary" />
            <CardTitle>Technical Skills</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <CodeIcon className="h-4 w-4 text-primary/70" />
                Programming Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Python", "Java", "JavaScript", "C", "SQL"].map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <LayoutIcon className="h-4 w-4 text-primary/70" />
                Libraries/Frameworks
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Node.js", "Express.js", "D3.js", "React.js", "Flask", "Pandas", "Cytoscape.js"].map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <ToolIcon className="h-4 w-4 text-primary/70" />
                Tools / Platforms
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Git",
                  "VS Code",
                  "GitHub",
                  "Docker",
                  "Linux",
                  "Cloudflare",
                  "AWS/GCP",
                  "High Performance Computing",
                ].map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <DatabaseIcon className="h-4 w-4 text-primary/70" />
                Databases
              </h3>
              <div className="flex flex-wrap gap-2">
                {["PostgreSQL", "Redis"].map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyIcon className="h-5 w-5 text-primary" />
            <CardTitle>Key Technical Competencies</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Backend Development</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">API Development</Badge>
                <Badge variant="outline">Database Design</Badge>
                <Badge variant="outline">Server Optimization</Badge>
                <Badge variant="outline">Cache Implementation</Badge>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3">Data Structures & Algorithms</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">R-tree Indexing</Badge>
                <Badge variant="outline">Union-Find Clustering</Badge>
                <Badge variant="outline">Merge Sort</Badge>
                <Badge variant="outline">QuickSort</Badge>
                <Badge variant="outline">Binary Search</Badge>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3">Data Processing</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Vectorized Operations</Badge>
                <Badge variant="outline">Real-time Processing</Badge>
                <Badge variant="outline">Data Pipelines</Badge>
                <Badge variant="outline">High Performance Computing</Badge>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3">Visualization & UI</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Interactive Dashboards</Badge>
                <Badge variant="outline">Network Visualization</Badge>
                <Badge variant="outline">Data Clustering</Badge>
                <Badge variant="outline">Filtering Systems</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BrainIcon className="h-5 w-5 text-primary" />
            <CardTitle>Soft Skills & Additional Abilities</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Problem Solving</h3>
              <p className="text-muted-foreground">
                Strong analytical thinking and creative problem-solving abilities, developed through competitive chess
                and complex programming challenges.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-3">Communication</h3>
              <p className="text-muted-foreground">
                Clear and effective communication skills, with experience presenting technical concepts to both
                technical and non-technical audiences.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-3">Chess</h3>
              <p className="text-muted-foreground mb-2">USCF Rating: 1922</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Strategic Planning</Badge>
                <Badge variant="outline">Pattern Recognition</Badge>
                <Badge variant="outline">Decision Making</Badge>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">English (Native)</Badge>
                <Badge variant="outline">Russian (Conversational)</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )

  const renderContent = () => {
    switch (section) {
      case "education":
        return <>{renderEducation()}</>
      case "experience":
        return <>{renderExperience()}</>
      case "projects":
        return <>{renderProjects()}</>
      case "activities":
        return <>{renderActivities()}</>
      case "skills":
        return renderExpandedSkills()
      default:
        return <p>Select a section to view</p>
    }
  }

  return <div className="animate-fadeIn">{renderContent()}</div>
}

