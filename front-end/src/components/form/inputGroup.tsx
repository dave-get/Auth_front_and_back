// "use client";
import { InputGroupType } from "@/type/formType";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const InputGroup = ({
  id,
  label,
  inputType,
  registerName,
  register,
  placeholder,
  errorMessage,
  min,
}: InputGroupType) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = inputType === "password";

  return (
    <div className="w-full space-y-1 my-3">
      <label htmlFor={id} className="gray-dark text-16px">
        {label} <br />
      </label>
      <div className="relative">
        <input
          type={
            inputType && inputType == "password"
              ? showPassword
                ? "text"
                : "password"
              : inputType
          }
          min={min}
          id={id}
          placeholder={placeholder}
          {...register(registerName)}
          className="w-full border-2 border-[#A9A9A9] p-5 py-3 rounded-xl placeholder:text-blue-steel focus:border-blue-steel outline-none"
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        )}
      </div>
      {errorMessage && <p className="text-red-400"> {errorMessage} </p>}
    </div>
  );
};

export default InputGroup;
