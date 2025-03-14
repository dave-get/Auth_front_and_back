"use client";
import React from "react";
import InputGroup from "../inputGroup";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toastError, toastSuccess } from "@/components/toastify/toastify";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

const ForgotPwSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      message: "Email is required",
    })
    .min(10, "Email is too short"),
});

type formData = z.infer<typeof ForgotPwSchema>;
const VerifyAccountEmail = ({ token }: { token: string }) => {
  const [isLoading, setLoading] = React.useState(false);
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
    localStorage.setItem("verifyAcountEmail", data.email);
    setLoading(true);
    const res = await fetch(`${uri}/send-verification-code`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        client: "not-browser",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const resdata = await res.json();
    if (resdata.success) {
      toastSuccess(resdata.message);
      router.push("/api/verifyAccount/verifyWithCode");
      setLoading(false);
    }
    if (!resdata.success) {
      toastError(resdata.message);
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col space-y-4 w-[50%] items-center">
      <h1 className="font-semibold italic text-3xl">Enter Your Email</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full items-center"
      >
        <InputGroup
          id="email"
          label=""
          inputType="email"
          registerName="email"
          register={register}
          placeholder="Enter your email"
          errorMessage={errors?.email?.message as string}
        />
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-1 border border-slate-400 rounded-xl cursor-pointer"
          type="submit"
        >
          {isLoading ? <Loader className="animate-spin w-full" /> : "Continue"}
        </button>
      </form>
    </div>
  );
};

export default VerifyAccountEmail;
