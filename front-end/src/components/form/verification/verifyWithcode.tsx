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
});

type formData = z.infer<typeof ForgotPwSchema>;

const VerifyAccount = ({ token }: { token: string }) => {
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
    const SentEmail = localStorage.getItem("verifyAcountEmail");
    console.log("sent email*****",SentEmail)
    setLoading(true);
    const res = await fetch(`${uri}/verify-code`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        client: "not-browser",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: SentEmail,
        providedCode: data.verificationCode,
      }),
    });
    const resdata = await res.json();
    if (resdata.success) {
      toastSuccess(resdata.message);
      router.push("/homePage");
      setLoading(false);
    }
    if (!resdata.success) {
      toastError(resdata.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-[50%] h-[50%] items-center">
      <h1 className="text-center text-4xl font-bold font-serif">
        Verify Your Account
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
