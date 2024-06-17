"use client";
import { UserSignupDataError, signup } from "@/actions/auth-actions";
import { useFormState } from "react-dom";


export default function FiatCreateAccount() {
  
  const [formState, formAction] = useFormState(signup, {} as UserSignupDataError )
  return (
     <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md" action={formAction}>
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first-name">
            First Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="first-name"
            type="text"
            placeholder="Enter First Name"
            name ="firstName"
          />
        </div>
         <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last-name">
            Last Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="last-name"
            type="text"
            placeholder="Enter Last Name"
            name ="lastName"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Enter email"
            name ="email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Enter password"
            name="password"
          />
        </div>

         <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
            Confirm Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="confirm-password"
            type="password"
            placeholder="Enter password"
            name="confirmPassword"
          />
        </div>
     
        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline basis-full"
            type="submit"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}
