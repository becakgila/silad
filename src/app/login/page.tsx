'use client'
import Image from "next/image";
import sequelize from "@/helper/database";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';


// import { useState } from "react";

export default function Home() {
    // useState
  const [emailState, setEmailState] = useState("");
  const [passwordState, setPasswordState] = useState("");
  const router = useRouter()

  async function verifAkun() {
    const res = await fetch("http://localhost:3000/api/auth/login", 
        {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailState,
        password: passwordState, 
      }), // Convert your data object to a JSON string
    }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          alt="Your Company"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {/* <form action="#" method="POST" className="space-y-6"> */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-100"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                name="email"
                onChange={(ref) => setEmailState(ref.target.value)}
                required
                autoComplete="email"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-100"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                name="password"
                onChange={(ref) => setPasswordState(ref.target.value)}
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
            //   type="submit"
              onClick={async () => {
                // prevend
                // console.log('test');
                 verifAkun().then(val => {
                    console.log(val);
                    
                    if(val.response.verify){
                        console.log('berhasil');
                        
                        router.push("/")
                    }
                    console.log(val.response.message);
                    
                    toast.error(val.response.message);
                 });

                //  console.log('gagal');

                
                
              }}
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Sign in
            </button>
          </div>
        {/* </form> */}

        <p className="mt-10 text-center text-sm/6 text-gray-400">
          Not a member?
          <a
            href="#"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Start a 14 day free trial
          </a>
        </p>
      </div>
    </div>
  );
}
