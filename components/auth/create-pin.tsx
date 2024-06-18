/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { FaUserLock } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import { FaArrowRightLong } from "react-icons/fa6";

const formSchema = z
  .object({
    pin: z.string().min(4, {
      message: "Your PIN must be 4 characters.",
    }),
    cpin: z.string().min(4, {
      message: "Your PIN must be 4 characters.",
    }),
  })
  .refine((data) => data.pin === data.cpin, {
    message: "Pins Mismatch, Please try Again!",
    path: ["cpin"], // this will point to the cpin field
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

const CreatePin = () => {
  const [buttonVariant, setButtonVariant] = useState<ButtonVariant>("pink");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: "",
      cpin: "",
    },
  });

  const router = useRouter();

  useEffect(() => {
    const subscription = form.watch((values) => {
      const { pin, cpin } = values;
      if (pin.length === 4 && cpin.length === 4) {
        setButtonVariant("purple");
      } else {
        setButtonVariant("pink");
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    router.push("/register/kyc");
  }

  return (
    <>
      <main className="flex w-full items-center justify-center bg-[#F9F8F9]">
        <div className="rounded bg-white py-10 px-10 w-full max-w-md flex flex-col items-center">
          <FaUserLock className="text-4xl mb-4" />
          <h2 className="text-[#21133F] font-semibold text-[30px] mb-4">
            Create PIN
          </h2>
          <p className="mb-4 text-center">
            Your pin adds an extra layer of security to your owujupe account
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full mt-8 flex flex-col items-center"
            >
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col items-center">
                    <FormLabel>Create Your PIN</FormLabel>
                    <FormControl className="w-full flex justify-center">
                      <InputOTP maxLength={4} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={0}
                            className="w-14 h-14 bg-[#F9F8F9] text-center text-2xl"
                          />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={1}
                            className="w-14 h-14 bg-[#F9F8F9] text-center text-2xl"
                          />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={2}
                            className="w-14 h-14 bg-[#F9F8F9] text-center text-2xl"
                          />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={3}
                            className="w-14 h-14 bg-[#F9F8F9] text-center text-2xl"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cpin"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col items-center">
                    <FormLabel>Confirm Your PIN</FormLabel>
                    <FormControl className="w-full flex justify-center">
                      <InputOTP maxLength={4} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={0}
                            className="w-14 h-14 bg-[#F9F8F9] text-center text-2xl"
                          />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={1}
                            className="w-14 h-14 bg-[#F9F8F9] text-center text-2xl"
                          />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={2}
                            className="w-14 h-14 bg-[#F9F8F9] text-center text-2xl"
                          />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={3}
                            className="w-14 h-14 bg-[#F9F8F9] text-center text-2xl"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-center">
                <Button
                  variant={buttonVariant}
                  className="my-5 px-14 py-7 text-[18px]"
                >
                  Create PIN <FaArrowRightLong className="mx-2" />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </>
  );
};

export default CreatePin;
