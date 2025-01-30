import { Dispatch, SetStateAction } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface Step1Props {
  studentCount: string
  setStudentCount: Dispatch<SetStateAction<string>>
  setStep: Dispatch<SetStateAction<1 | 2 | 3 | 4>>
}

export default function Step1SelectStudents({ studentCount, setStudentCount, setStep }: Step1Props) {
  const handleStudentCountChange = (value: string) => {
    setStudentCount(value)
    setStep(2)
  }

  return (
    <Select value={studentCount} onValueChange={handleStudentCountChange}>
      <SelectTrigger className="w-full bg-white border rounded-lg p-4 font-normal text-base">
        <SelectValue placeholder="Enter number of students" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">1</SelectItem>
        <SelectItem value="2">2</SelectItem>
        <SelectItem value="3">3</SelectItem>
        <SelectItem value="4">4</SelectItem>
      </SelectContent>
    </Select>
  )
}

