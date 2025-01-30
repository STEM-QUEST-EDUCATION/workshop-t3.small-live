import { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { useBooking } from "@/contexts/BookingContext"; // Import BookingContext

interface ParentContact {
  phone1: string;
  phone2: string;
}

interface PhoneErrors {
  phone1: string;
  phone2: string;
}

interface Step3Props {
  parentContact: ParentContact;
  setParentContact: Dispatch<SetStateAction<ParentContact>>;
  errors: PhoneErrors;
  setErrors: Dispatch<SetStateAction<PhoneErrors>>;
}

const isValidIndianPhoneNumber = (phone: string) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export default function Step3ParentContact({
  parentContact,
  setParentContact,
  errors,
  setErrors,
}: Step3Props) {
  const { setParentPhone } = useBooking(); // Access setParentPhone from BookingContext

  const handleParentContactChange = (field: "phone1" | "phone2", value: string) => {
    setParentContact((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Validate phone number
    if (value && !isValidIndianPhoneNumber(value)) {
      setErrors((prev) => ({
        ...prev,
        [field]: "Please enter a valid 10-digit phone number",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    // Update BookingContext with primary phone number
    if (field === "phone1") {
      setParentPhone(value);
      console.log("Parent phone number updated:", value);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Input
          placeholder="Parent's phone number (Primary)"
          value={parentContact.phone1}
          onChange={(e) => handleParentContactChange("phone1", e.target.value)}
          className={`bg-white rounded-lg ${errors.phone1 ? "border-red-500" : ""}`}
          type="tel"
        />
        {errors.phone1 && <p className="text-red-500 text-sm mt-1">{errors.phone1}</p>}
      </div>
      <div>
        <Input
          placeholder="Parent's phone number (Optional)"
          value={parentContact.phone2}
          onChange={(e) => handleParentContactChange("phone2", e.target.value)}
          className={`bg-white rounded-lg ${errors.phone2 ? "border-red-500" : ""}`}
          type="tel"
        />
        {errors.phone2 && <p className="text-red-500 text-sm mt-1">{errors.phone2}</p>}
      </div>
    </div>
  );
}
