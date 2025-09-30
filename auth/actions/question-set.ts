'use server'

import { db } from "@/lib/db"

type CreateQuestionSetInput = {
  title: string
  description?: string
  userId: string
}

export async function createQuestionSet(input: CreateQuestionSetInput) {
  return db.questionSet.create({
    data: {
      title: input.title,
      description: input.description,
      userId: input.userId,
    },
  })
}

export async function getQuestionSetById(id: string, userId: string) {
  return db.questionSet.findUnique({
    where: {
      id,
      userId,
    },
    include: {
      questions: true,
    },
  })
}

export async function getQuestionSetsByUser(userId: string) {
  return db.questionSet.findMany({
    where: {
      userId,
    },
    include: {
      _count: {
        select: {
          questions: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}
