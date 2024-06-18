"use client";

import Image from "next/image";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FaArrowRightLong } from "react-icons/fa6";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";

// import { useFormContext, FormProvider } from "@/context/FormContext";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
});

const Register = () => {
  // const { setFormData } = useFormContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const router = useRouter();

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    // setFormData(values);
    router.push("/register/email-verification");
  }

  return (
    <>
      <main>
        <div className="flex w-full h-screen">
          {/* <!-- Left content div --> */}
          <div className="w-7/12 h-full flex bg-[#F9F8F9]">
            {/* <p>Your Content Goes Here</p> */}
            <div className="mx-[100px] py-[20px]">
              <Image src="/logo8.png" alt="logo" width={200} height={200} />
              <div className="py-[50px]">
                <div className="rounded bg-white h-[500px] py-10 px-10">
                  <h1 className="text-[#21133F] font-bold text-[45px]">
                    Join Owujupe Community Savings
                  </h1>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8 my-8"
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email address</FormLabel>
                            <FormControl>
                              <Input
                                className="py-7 bg-[#F9F8F9]"
                                placeholder="ikpejonathan@gmail.com"
                                {...field}
                              />
                            </FormControl>
                            {/* <FormDescription>
                              This is your public display name.
                            </FormDescription> */}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between items-center">
                        <p>
                          Got an account?{" "}
                          <Link
                            href="/login"
                            className="text-[#6E00F7] font-bold hover:underline"
                          >
                            Sign in
                          </Link>
                        </p>
                        <Button
                          variant="purple"
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
          {/* <!-- Right background image div --> */}
          <div
            className="w-5/12 h-full bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: "url('/bg-2.png')" }}
          >
            <div className="bg-white-gradient h-[300px] rounded mx-16 py-10 px-10 backdrop-blur-md">
              <h1 className=" font-bold text-[30px] text-[#2B5265]">
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
          {/* <!-- This div covers the right half of the screen with a background image --> */}
        </div>
      </main>
    </>
  );
};

export default Register;
