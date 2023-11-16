import Link from "next/link"


const Home = () => {
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