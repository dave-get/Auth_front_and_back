"use client";
import InputGroup from "@/components/form/inputGroup";
import { toastError, toastSuccess } from "@/components/toastify/toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ForgotPwSchema = z.object({
  verificationCode: z
    .string({
      required_error: "verificationCode is required",
      message: "verificationCode is required",
    })
    .min(6, "verificationCode is too short"),
  NewPassword: z
    .string({
      required_error: "NewPassword is required",
      message: "NewPassword is required",
    })
    .min(8, "NewPassword is too short"),
});

type formData = z.infer<typeof ForgotPwSchema>;

const VerifyAccount = () => {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<formData>({
    resolver: zodResolver(ForgotPwSchema),
  });

  const uri = process.env.NEXT_PUBLIC_BASE_URL;
  const onSubmit = async (data: any) => {
    setLoading(true);
    const res = await fetch(`${uri}/verify-forgot-password-code`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "davewaanofii@gmail.com",
        providedCode: data.verificationCode,
        newPassword: data.NewPassword,
      }),
    });
    const resdata = await res.json();
    console.log("*********", resdata);
    if (res.ok) {
      router.push("/api/auth/signin");
      toastSuccess("Account Verified!");
      setLoading(false);
    }
    if (!res.ok) {
      toastError("Error with verification");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-[50%] h-[50%] items-center">
      <h1 className="text-center text-4xl font-bold font-serif">
        Forgot Password
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full items-center"
      >
        <InputGroup
          id="verificationCode"
          label="verificationCode"
          inputType="text"
          registerName="verificationCode"
          register={register}
          placeholder="Enter verificationCode"
          errorMessage={errors?.verificationCode?.message as string}
        />
        <InputGroup
          id="NewPassword"
          label="New Password"
          inputType="password"
          registerName="NewPassword"
          register={register}
          placeholder="Enter New Password"
          errorMessage={errors?.NewPassword?.message as string}
        />
        <button
          type="submit"
          className="rounded-lg px-5 py-1 bg-green-300 cursor-pointer font-bold"
        >
          {isLoading ? <Loader className="animate-spin w-full" /> : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default VerifyAccount;
