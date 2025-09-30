import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createQuestionSet } from "@/actions/question-set"
import Link from "next/link"

export default function NewTestPage() {
  async function handleCreateTest(formData: FormData) {
    'use server'
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Not authenticated')
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string

    try {
      const questionSet = await createQuestionSet({
        title,
        description,
        userId: session.user.id,
      })
      redirect(`/dashboard/tests/${questionSet.id}`)
    } catch (error) {
      console.error('Error creating question set:', error)
      throw new Error('Failed to create test')
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create New Test</h1>
          <p className="text-muted-foreground">Create a new test collection for your candidates</p>
        </div>

        <form action={handleCreateTest} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Test Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Frontend Developer Assessment"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Add a brief description about this test..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/tests">
                Cancel
              </Link>
            </Button>
            <Button type="submit">
              Create Test
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
