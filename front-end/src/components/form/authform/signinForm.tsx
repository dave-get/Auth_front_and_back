"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputGroup from "../inputGroup";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toastError, toastSuccess } from "@/components/toastify/toastify";
import { signIn } from "next-auth/react";
import { Loader } from "lucide-react";

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      message: "Email is required",
    })
    .min(10, "Email is too short"),
  password: z
    .string({
      required_error: "Password is required",
      message: "Password is required",
    })
    .min(8, "Password is too short"),
});

type formData = z.infer<typeof loginSchema>;

const SigninForm = () => {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      console.log("res************", res);
      if (res?.ok) {
        router.push("/homePage");
        toastSuccess("Sign in successfully");
        setLoading(false);
      }
      if (!res?.ok) {
        setLoading(false);
        toastError("Faild to sign in");
        console.log("**************", res);
      }
    } catch (error) {
      toastError("Invalid Email or Password");
      setLoading(false);
    }
  };
  return (
    <div>
      <h1 className="text-center text-4xl font-bold font-serif text-[#A9A9A9]">
        Sign In
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
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
          className="w-full bg-slate-300 font-bold text-slate-400 p-3 rounded-xl cursor-pointer"
        >
          {isLoading ? <Loader className="animate-spin w-full" /> : "SignIn"}
        </button>
      </form>
    </div>
  );
};

export default SigninForm;
