import { Dispatch, SetStateAction } from 'react'
import { Calendar, Pencil, Plus, Minus } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface StudentDetails {
  id: string
  name: string
  age: string
}

interface ParentContact {
  phone1: string
  phone2: string
}

interface SummaryCardProps {
  step: 1 | 2 | 3 | 4
  students: StudentDetails[]
  parentContact: ParentContact
  handleAddStudent: () => void
  handleRemoveStudent: () => void
  setStep: Dispatch<SetStateAction<1 | 2 | 3 | 4>>
}

export function SummaryCard({
  step,
  students,
  parentContact,
  handleAddStudent,
  handleRemoveStudent,
  setStep
}: SummaryCardProps) {
  return (
    <div className="bg-[#F5FAFF] rounded-xl p-4 space-y-4">
      {step !== 4 && step !== 3 &&  (
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#00A0E4]">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">Number of students</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {step === 2 && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                onClick={handleRemoveStudent}
              >
                <Minus className="h-4 w-4" />
              </Button>
            )}
            <span className="font-semibold text-lg w-8 text-center">{students.length}</span>
            {step === 2 && students.length < 4 && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                onClick={handleAddStudent}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {((step === 3 || step === 4) && students.length > 0) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#00A0E4]">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">Student details</span>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-400" onClick={() => setStep(2)}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {students.map((student) => (
              <div key={student.id} className="text-gray-600 bg-white p-2 rounded-md shadow-sm">
                <span className="font-medium">{student.name}</span>
                <span className="ml-2">{student.age} yrs</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-gray-600 font-medium">Phone number</div>
            <div className="text-gray-800">{parentContact.phone1}</div>
            {parentContact.phone2 && <div className="text-gray-800">{parentContact.phone2}</div>}
          </div>
          <Button variant="ghost" size="icon" className="text-gray-400" onClick={() => setStep(3)}>
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

