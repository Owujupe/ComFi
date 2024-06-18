"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Input } from "@/components/ui/input";

const formSchema = z.object({
  dob: z.date(),
  address: z.string(),
  postalCode: z.string().optional(),
  province: z.string().optional(),
  houseNumber: z.string().optional(),
  unitNumber: z.string().optional(),
  streetName: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
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

const KYCForm = () => {
  const [inputValue, setInputValue] = useState("");
  const [buttonVariant, setButtonVariant] = useState<ButtonVariant>("pink");
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dob: undefined,
      address: "",
    },
  });

  const router = useRouter();

  useEffect(() => {
    if (inputValue) {
      setButtonVariant("purple");
      setShowAdditionalFields(true);
    } else {
      setButtonVariant("pink");
      setShowAdditionalFields(false);
    }
  }, [inputValue]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    router.push("/dashboard");
  }

  return (
    <main>
      <div className="flex w-full h-screen">
        <div className="w-7/12 h-full flex bg-[#F9F8F9]">
          <div className="mx-[100px] py-[20px]">
            <Image src="/logo8.png" alt="logo" width={200} height={200} />
            <div className="py-[50px]">
              <div className="rounded bg-white h-auto py-10 px-10">
                <h2 className="text-[#21133F] font-semibold text-[30px]">
                  Your Date of Birth and Address
                </h2>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 my-8"
                  >
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <DatePicker
                                selected={field.value}
                                onChange={(date) => {
                                  field.onChange(date);
                                  setInputValue(date ? date.toString() : "");
                                }}
                                className="py-7 pl-7 my-2 w-[500px] rounded-sm bg-[#F9F8F9] border border-gray-300 focus:border-blue-500"
                                placeholderText="Date of Birth"
                                dateFormat="dd/MM/yyyy"
                              />
                              <FaCalendarAlt className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                              <input
                                {...field}
                                className="py-7 pl-10 my-2 w-[500px] rounded-sm bg-[#F9F8F9] border border-gray-300 focus:border-blue-500"
                                placeholder="Address"
                                onChange={(e) => {
                                  field.onChange(e);
                                  setInputValue(e.target.value);
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {showAdditionalFields && (
                      <>
                        <div className="flex space-x-4">
                          <FormField
                            control={form.control}
                            name="houseNumber"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl className="w-full floating-label">
                                  <div>
                                    <Input
                                      className="py-7 mt-5  bg-[#F9F8F9]"
                                      placeholder="House Number"
                                      required
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        setInputValue(e.target.value);
                                      }}
                                    />
                                    <label className="floating-label-text">
                                      House Number
                                    </label>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="streetName"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl className="floating-label">
                                  <div>
                                    <Input
                                      required
                                      className="py-7 mt-5 bg-[#F9F8F9]"
                                      placeholder="Street Name"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        setInputValue(e.target.value);
                                      }}
                                    />
                                    <label className="floating-label-text">
                                      Street Name
                                    </label>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex space-x-4">
                          <FormField
                            control={form.control}
                            name="unitNumber"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl className="floating-label">
                                  <div>
                                    <Input
                                      required
                                      className="py-7  bg-[#F9F8F9]"
                                      placeholder="Unit Number"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        setInputValue(e.target.value);
                                      }}
                                    />
                                    <label className="floating-label-text">
                                      Unit Number
                                    </label>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl className="floating-label">
                                  <div>
                                    <Input
                                      required
                                      className="py-7 bg-[#F9F8F9]"
                                      placeholder="City"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        setInputValue(e.target.value);
                                      }}
                                    />
                                    <label className="floating-label-text">
                                      City
                                    </label>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex space-x-4">
                          <FormField
                            control={form.control}
                            name="province"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl className="floating-label">
                                  <div>
                                    <Input
                                      required
                                      className="py-7 bg-[#F9F8F9]"
                                      placeholder="Province"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        setInputValue(e.target.value);
                                      }}
                                    />
                                    <label className="floating-label-text">
                                      Province
                                    </label>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="postalCode"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl className="floating-label">
                                  <div>
                                    <Input
                                      required
                                      className="py-7 bg-[#F9F8F9]"
                                      placeholder="Postal Code"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        setInputValue(e.target.value);
                                      }}
                                    />
                                    <label className="floating-label-text">
                                      Postal Code
                                    </label>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl className="floating-label">
                                  <div>
                                    <Input
                                      required
                                      className="py-7 bg-[#F9F8F9]"
                                      placeholder="Country"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        setInputValue(e.target.value);
                                      }}
                                    />
                                    <label className="floating-label-text">
                                      Country
                                    </label>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </>
                    )}
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
        <div
          className="w-5/12 h-full bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: "url('/bg-2.png')" }}
        >
          <div className="bg-white-gradient h-[300px] rounded mx-16 py-10 px-10 backdrop-blur-md">
            <h1 className="font-bold text-[30px] text-[#2B5265]">
              Where Like-minded Savers Unite
            </h1>
            <p className="text-[#21133F] text-justify my-4">
              Welcome to OWUJUPE, a vibrant community where you and like-minded
              individuals come together to achieve financial goals. By signing
              up, you are taking the first step towards financial empowerment
              and collective savings.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default KYCForm;
