'use client'
import Link from "next/link"
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { supabaseBrowserClient } from "../../../utils/supabase_bowser";
interface Errors {

    email?: string;
    password?: string;
}

const LoginPage = () => {
    const router = useRouter();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<Errors>({});
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    useEffect(() => {
        validateForm();
    }, [email, password]);
    // Validate form 
    const validateForm = () => {
        let errors: Errors = {};



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
    const handleSubmit = async() => {
        if (isFormValid) {
            console.log('Form submitted successfully!');
            const { data, error } = await supabaseBrowserClient.auth.signInWithPassword({
                email: email,
                password: password,
                
    
            }) 
            if(!error){
                router.push('/notes') 
            }
           
            
           
        } else {
            console.log('Form has errors. Please correct them.');
        }

    };

    return (
        <div className=" flex justify-center w-screen h-screen items-center">
            <div className=" bg-zinc-400 h-96 w-96  ">

                <div className=" flex justify-center">
                    <div className="text-center py-16">
                        <div className="text-2xl">Login</div>

                        <input type="text" className="my-4  bg-transparent border-2 border-black placeholder-white pl-2 " placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <p className=" text-red-600">{errors.email}</p>}

                        <input type="password" className=" my-4 bg-transparent border-2 border-black placeholder-white pl-2 " placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <p className=" text-red-600">{errors.password}</p>}


                        <div className="text-sm bg-lime-500 ">
                            <button className=""
                                disabled={!isFormValid}
                                onClick={handleSubmit}
                            >login </button>
                        </div>
                        <div className=" text-white">dont have an account?
                            <Link href="/signup" className=" text-blue-600">signup</Link>
                        </div>
                    </div>



                </div>
            </div>
        </div>
    )
}

export default LoginPage