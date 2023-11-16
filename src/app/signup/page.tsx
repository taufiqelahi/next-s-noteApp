
'use client'
import Link from "next/link"
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
interface Errors {
    name?: string;
    email?: string;
    password?: string;
}

const SignupPage = () => {
    const router = useRouter();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<Errors>({});
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
  

    useEffect(() => {
        validateForm();
    }, [name, email, password]);
    // Validate form 
    const validateForm = () => {
        let errors: Errors = {};

        if (!name) {
            errors.name = 'Name is required.';
        }

        if (!email) {
            errors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid.';
        }

        if (!password) {
            errors.password = 'Password is required.';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters.';
        }

        setErrors(errors);
        setIsFormValid(Object.keys(errors).length === 0);
    };
    // Submit 
    const handleSubmit = () => {
        if (isFormValid) {
            console.log('Form submitted successfully!');
            router.push('/login')
        } else {
            console.log('Form has errors. Please correct them.');
        }
       
    };


    return (
        <div className=" flex justify-center w-screen h-screen items-center">
            <div className=" bg-zinc-400 h-96 w-96  ">

                <div className=" flex justify-center">
                    <div className="text-center py-16">
                        <div className="text-2xl">Sign up</div>

                        <input type="text" className="my-4  bg-transparent border-2 border-black placeholder-white pl-2 " placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                         {errors.name && <p >{errors.name}</p>} 
                        <input type="text" className=" my-4 bg-transparent border-2 border-black placeholder-white pl-2 " placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <p >{errors.email}</p>} 
                        <input type="password" className=" my-4 bg-transparent border-2 border-black placeholder-white pl-2 " placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}

                        />
                         {errors.password && <p >{errors.password}</p>} 


                        <div className="text-sm bg-lime-500 ">
                            <button
                                disabled={!isFormValid}
                                onClick={handleSubmit}   >Create </button>
                        </div>
                        <div className=" text-white">already have an account?
                            <Link href="/login" className=" text-blue-600">login</Link>
                        </div>
                    </div>



                </div>
            </div>
        </div>
    )
}

export default SignupPage