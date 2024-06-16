"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FaArrowRightLong } from "react-icons/fa6";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  code: z.string(),
});
type ButtonVariant =
  | "pink"
  | "link"
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "purple"
  | "aqua"
  | null
  | undefined;

const EmailVerification = () => {
  const [inputValue, setInputValue] = useState("");
  const [buttonVariant, setButtonVariant] = useState<ButtonVariant>("pink");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  const router = useRouter();

  useEffect(() => {
    if (inputValue) {
      setButtonVariant("purple");
    } else {
      setButtonVariant("pink");
    }
  }, [inputValue]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    router.push("/register/profile-form");
  }

  return (
    <>
      <main>
        <div className="flex w-full h-screen">
          {/* Left content div */}
          <div className="w-7/12 h-full flex bg-[#F9F8F9]">
            <div className="mx-[100px] py-[20px]">
              <Image src="/logo8.png" alt="logo" width={200} height={200} />
              <div className="py-[50px]">
                <div className="rounded bg-white h-[500px] py-10 px-10">
                  <h2 className="text-[#21133F] font-semibold text-[30px]">
                    Enter code sent to
                  </h2>
                  <p className="text-[#21133F] font-semibold">
                    athika.fxz@gmail.com
                  </p>
                  <p className="text-[#6E00F7] font-semibold text-[12px] hover:underline">
                    Wrong email?
                  </p>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8 my-8"
                    >
                      <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className="py-7 my-16 bg-[#F9F8F9]"
                                placeholder="Code"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setInputValue(e.target.value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between items-center">
                        <p className="text-[12px] text-[#625C69] lg:mr-20">
                          Did not get an OTP?
                          <Link
                            href=""
                            className="text-[#6E00F7] font-bold hover:underline ml-1"
                          >
                            Resend
                          </Link>
                        </p>
                        <Button
                          variant={buttonVariant}
                          className="my-12 px-14 py-7 text-[18px]"
                        >
                          Continue <FaArrowRightLong className="mx-2" />
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
          {/* Right background image div */}
          <div
            className="w-5/12 h-full bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: "url('/bg-2.png')" }}
          >
            <div className="bg-white-gradient h-[300px] rounded mx-16 py-10 px-10 backdrop-blur-md">
              <h1 className="font-bold text-[30px] text-[#2B5265]">
                Where Like-minded Savers Unite
              </h1>
              <p className="text-[#21133F] text-justify my-4">
                Welcome to OWUJUPE, a vibrant community where you and
                like-minded individuals come together to achieve financial
                goals. By signing up, you are taking the first step towards
                financial empowerment and collective savings.
              </p>
            </div>
          </div>
          {/* This div covers the right half of the screen with a background image */}
        </div>
      </main>
    </>
  );
};

export default EmailVerification;
