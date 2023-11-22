'use client'
import Link from "next/link"
import { useEffect, useState } from 'react';
import { supabaseBrowserClient } from "../../utils/supabase_bowser";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import NotePage from "./notes/page";

type User = {
  email: string
}
type NullableUser = User | null;


const Home = () => {
  const router = useRouter()
  const [user, setUser] = useState<NullableUser>(null);

  async function logout() {
    await supabaseBrowserClient.auth.signOut();

    setUser(null);


    //  router.push("/login")

  }
  const checkUser = async () => {


    const userData = (await supabaseBrowserClient.auth.getUser()).data.user;

    console.log(userData);
    if (userData != null) {
      
      setUser({ email: userData?.email! });
    }






  };

  useEffect(() => {

    if (typeof window !== 'undefined') {
      checkUser();
    }
  }, []);

  if (user != null) {
    return (
      <div className=" px-10 py-10 text-2xl ">
        <div className=" flex justify-between ">NoteApp
          <div className="flex text-black ">logged in as
            <p className="px-1 text-blue-500">{user!.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 h-screen">

          <div className="flex sm:col-span-2 md:col-span-1   text-justify items-center">
          <div className=" ">
            When the life too much things you need more than you have.
            Let’s Peyme help your life to easier with smart payment
            <div className=" my-10 flex items-center justify-center h-11 w-36 rounded-3xl text-white bg-blue-600">
              <Link href="/notes" className=""> Get Started</Link>
            </div>


          </div>
          </div>
        

          <div className=" flex justify-center w-full items-center text-center sm:col-span-2 md:col-span-1">
            <Image src="/assets/Banner.png" alt={""}
              width="0"
              height="0"
              sizes="100vw"
              className="w-96 h-96"
            />
          </div>
          <div>

          </div>
        </div>
        <div className=" text-center h-10 w-28 bg-black text-white rounded-2xl">
          <button onClick={logout}>Logout</button>

        </div>

     
      </div>
    )

  }
  return (
    <div className="justify-center">
      <div className="text-left px-10 py-10 text-2xl">

        NoteApp

        <div className=" flex py-10 gap-x-10 text-sm ">
          <Link className="flex items-center justify-center bg-blue-800 text-white h-10 w-20 rounded-md " href="/login"

          >Sign In</Link>

          <Link className="flex items-center justify-center bg-blue-800 text-white  h-10 w-20 rounded-md  " href="/signup"
          >Signup</Link>
        </div>
      </div>




    </div>
  )
}

export default Home