import {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { Trash2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AlertPopup from "./AlertPopup";
import { useBooking } from "@/contexts/BookingContext"; // Import useBooking hook

interface StudentDetails {
  id: string;
  name: string;
  age: string;
}

interface Step2Props {
  students: StudentDetails[];
  setStudents: Dispatch<SetStateAction<StudentDetails[]>>;
  setStudentCount: Dispatch<SetStateAction<string>>;
  setStep: Dispatch<SetStateAction<1 | 2 | 3 | 4>>;
}

export default function Step2StudentsDetails({
  students,
  setStudents,
  setStudentCount,
  setStep,
}: Step2Props) {
  const {  setBookingData } = useBooking(); // Access the context
  const [activeSwipeIndex, setActiveSwipeIndex] = useState<number | null>(null);
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [invalidAges, setInvalidAges] = useState<number[]>([]); // Track invalid ages
  const [invalidNames, setInvalidNames] = useState<number[]>([]); // Track invalid names
  const swipeStartX = useRef<number | null>(null);
  const swipeThreshold = 50;

  useEffect(() => {
    if (students.length > 0 && !initialAnimationDone) {
      setActiveSwipeIndex(0);
      const timer = setTimeout(() => {
        setActiveSwipeIndex(null);
        setInitialAnimationDone(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [students.length, initialAnimationDone]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeSwipeIndex !== null) {
        const target = event.target as HTMLElement;
        if (!target.closest(".student-field")) {
          setActiveSwipeIndex(null);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [activeSwipeIndex]);

  const isValidName = (name: string) => {
    const nameRegex = /^[a-zA-Z.\-\s]+$/;
    return nameRegex.test(name);
  };

  const handleInputChange = useCallback(
    (index: number, field: "name" | "age", value: string) => {
      setStudents((prevStudents) => {
        const newStudents = [...prevStudents];
        newStudents[index] = { ...newStudents[index], [field]: value };

        setBookingData((prevBookingData) => ({
          ...prevBookingData,
          children: [...newStudents],
        }));

        return newStudents;
      });

      if (field === "name") {
        setInvalidNames((prev) => {
          if (value === "" || isValidName(value)) {
            return prev.filter((i) => i !== index);
          } else {
            return prev.includes(index) ? prev : [...prev, index];
          }
        });
      } else if (field === "age") {
        const trimmedAge = value.trim();
        setInvalidAges((prev) => {
          if (trimmedAge === "") {
            return prev.filter((i) => i !== index);
          } else {
            const ageNum = parseFloat(trimmedAge);
            if (
              ageNum >= 4 &&
              ageNum <= 15 &&
              trimmedAge === ageNum.toString()
            ) {
              return prev.filter((i) => i !== index);
            } else {
              return prev.includes(index) ? prev : [...prev, index];
            }
          }
        });
      }
    },
    [setStudents, setBookingData]
  );

  const handleDeleteClick = useCallback((index: number) => {
    setDeleteIndex(index);
    setShowDeletePopup(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteIndex !== null) {
      setStudents((prevStudents) => {
        const newStudents = prevStudents.filter((_, i) => i !== deleteIndex);
        setStudentCount(newStudents.length.toString());
        if (newStudents.length === 0) {
          setStudentCount("");
          setStep(1);
        }
        return newStudents;
      });
      setActiveSwipeIndex(null);
    }
    setShowDeletePopup(false);
    setDeleteIndex(null);
  }, [deleteIndex, setStudents, setStudentCount, setStep]);

  const handleCancelDelete = useCallback(() => {
    setShowDeletePopup(false);
    setDeleteIndex(null);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent, ) => {
    swipeStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent, index: number) => {
    if (swipeStartX.current !== null) {
      const currentX = e.touches[0].clientX;
      const diff = swipeStartX.current - currentX;
      if (diff > swipeThreshold) {
        setActiveSwipeIndex(index);
      } else if (diff < -swipeThreshold) {
        setActiveSwipeIndex(null);
      }
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    swipeStartX.current = null;
  }, []);

  return (
    <div className="space-y-1">
      {students.map((student, index) => (
        <div
          key={student.id}
          className="relative student-field overflow-hidden"
          onTouchStart={(e) => handleTouchStart(e)}
          onTouchMove={(e) => handleTouchMove(e, index)}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex gap-3 items-start rounded-lg p-1 shadow-sm"
            style={{
              transform: `translateX(${
                activeSwipeIndex === index ? "-60px" : "0px"
              })`,
              transition: initialAnimationDone
                ? "transform 200ms ease-out"
                : "transform 100ms ease-out",
            }}
          >
            <div className="flex-1 relative">
              <Input
                placeholder="Name of student"
                value={student.name}
                onChange={(e) =>
                  handleInputChange(index, "name", e.target.value)
                }
                className="bg-white"
              />
              {student.name && (
                invalidNames.includes(index) ? (
                  <XCircle className="absolute right-2 top-2 text-red-500 w-5 h-5" />
                ) : (
                  <CheckCircle className="absolute right-2 top-2 text-green-500 w-5 h-5" />
                )
              )}
              {invalidNames.includes(index) && (
                <p className="text-red-500 text-xs mt-1">
                  Only alphabets, spaces, periods, and hyphens are allowed.
                </p>
              )}
            </div>
            <div className="flex-1 relative">
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Age"
                value={student.age}
                onChange={(e) =>
                  handleInputChange(index, "age", e.target.value)
                }
                className="bg-white"
              />
              {student.age && (
                invalidAges.includes(index) ? (
                  <XCircle className="absolute right-2 top-2 text-red-500 w-5 h-5" />
                ) : (
<CheckCircle
  className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5 z-10 bg-white rounded-full"
/>
                )
              )}
              {invalidAges.includes(index) && (
                <p className="text-red-500 text-xs mt-1">
                  Age must be a number between 4 and 15.
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteClick(index)}
            className="absolute right-0 top-1 bottom-0 w-[50px] bg-red-500 hover:bg-red-600 text-white"
            style={{
              transform: `translateX(${
                activeSwipeIndex === index ? "0px" : "50px"
              })`,
              transition: initialAnimationDone
                ? "transform 200ms ease-out"
                : "transform 100ms ease-out",
            }}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      ))}
      {showDeletePopup && (
        <AlertPopup
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          message="Are you sure you want to remove this student?"
        />
      )}
    </div>
  );
}
