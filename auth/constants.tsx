import { Badge, BriefcaseBusiness, Code2Icon, Puzzle, User2Icon } from "lucide-react";

export const TestType = [
    {
        name: "Technical",
        icon: Code2Icon
    },
    {
        name: "Behavioral",
        icon: User2Icon
    },
    {
        name: "Experience",
        icon: BriefcaseBusiness
    },
    {
        name: "Problem Solving",
        icon: Puzzle
    },
    {
        name: "Leadership",
        icon: Badge
    }
]

export const PROMPT = `
    You are an expert test creator. 
Generate a structured set of **technical test questions** based on the following details:

- Job Position: {{job-position}}
- Job Description: {{job-description}}


Guidelines:
1. There will be total of 6 questions.
2. Match question difficulty to the role level (entry-level, mid, senior).
3. For **coding questions**:
   - Provide a **clear problem statement**.
   - (Optional) Include **sample input and expected output**.
   - Ensure questions reflect the actual technical skills required in the job description.
4. For **theory/system design questions**:
   - Make them concise but precise.
   - Cover relevant topics mentioned in the job description.
5. Return the questions in **valid JSON format** where each object contains:
   - "question": string
   - "type": string (coding, theory, system-design)
   - "difficulty": string (easy, medium, hard)

Generate the most suitable technical questions for this test.
`