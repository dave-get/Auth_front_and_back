"use client";
import React from "react";
import InputGroup from "../inputGroup";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toastError, toastSuccess } from "@/components/toastify/toastify";
import { useRouter } from "next/navigation";
import { userType } from "@/type/userType";

const signupSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      message: "Email is required",
    })
    .email()
    .min(10, "Email is too short"),
  password: z
    .string({
      required_error: "Password is required",
      message: "Password is required",
    })
    .min(8, "Password is too short"),
});

type formData = z.infer<typeof signupSchema>;
const SignupForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>({
    resolver: zodResolver(signupSchema),
  });

  const uri = process.env.NEXT_PUBLIC_BASE_URL;

  const onSubmit = async (data: userType) => {
    const res = await fetch(`${uri}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data?.email,
        password: data?.password,
      }),
    });
    console.log("res:****", res);
    if (res.ok) {
      router.push("/api/auth/signin");
      toastSuccess("account created successfuly");
    }
    if (!res.ok) {
      toastError("Faild to sign up");
    }
  };
  return (
    <div>
      <h1 className="text-center text-4xl font-bold font-serif text-[#A9A9A9]">
        SignUP
      </h1>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <InputGroup
          id="email"
          label="Email"
          inputType="email"
          registerName="email"
          register={register}
          placeholder="Enter Email"
          errorMessage={errors?.email?.message as string}
        />

        <InputGroup
          id="password"
          label="Password"
          inputType="password"
          registerName="password"
          register={register}
          placeholder="Enter Password"
          errorMessage={errors?.password?.message as string}
        />
        <button
          type="submit"
          className="w-full bg-slate-300 text-slate-400 font-bold p-3 rounded-xl mt-5 cursor-pointer"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
