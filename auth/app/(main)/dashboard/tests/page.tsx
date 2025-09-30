import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { Plus } from "lucide-react"
import { QuestionSet, Question } from "@prisma/client"

type QuestionSetWithCount = QuestionSet & {
  _count: {
    questions: number
  },
  questions: Pick<Question, 'difficulty'>[]
}

export default async function TestsPage() {
  const session = await auth()
  
  if (!session?.user) {
    return <div>Please sign in to view tests</div>
  }

  const questionSets = await db.questionSet.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      _count: {
        select: {
          questions: true
        }
      },
      questions: {
        select: {
          difficulty: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const getDifficultyBadge = (difficulty: 'EASY' | 'MEDIUM' | 'HARD') => {
    switch (difficulty) {
      case 'EASY':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Easy</Badge>
      case 'MEDIUM':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case 'HARD':
        return <Badge variant="destructive">Hard</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tests</h1>
          <p className="text-muted-foreground">View and manage your test collections</p>
        </div>
        {/* <Button asChild>
          <Link href="/dashboard/tests/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Test
          </Link>
        </Button> */}
      </div>

      {questionSets.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-lg font-medium mb-2">No tests yet</h3>
          <p className="text-muted-foreground mb-4">Get started by creating a new test</p>
          <Button asChild>
            <Link href="/dashboard/tests/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Test
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {questionSets.map((set: QuestionSetWithCount) => (
            <Card key={set.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">
                    <Link href={`/dashboard/tests/${set.id}`} className="hover:underline">
                      {set.title}
                    </Link>
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(set.createdAt), { addSuffix: true })}
                  </div>
                </div>
                {set.description && (
                  <CardDescription>{set.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">
                    {set._count.questions} {set._count.questions === 1 ? 'question' : 'questions'}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex gap-2">
                  {set.questions[0]?.difficulty && getDifficultyBadge(set.questions[0].difficulty)}
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/tests/${set.id}`}>
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
