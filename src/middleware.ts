import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )



    const user = (await supabase.auth.getUser()).data.user;
    

    const path =request.nextUrl.pathname
    
    if (user == null) {
    
        
          
                 if(path=="notes") {
  return NextResponse.redirect(new URL("/notes", request.url));
                 }  
      
        

        return NextResponse.next();

    } else {
        if(path=='/login'){
          
                    
               return NextResponse.redirect(new URL("/notes", request.url));
            }
            return NextResponse.next();
   
    }
}



////

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// import { useEffect } from 'react';
// import { url } from "inspector";
// import { createServerClient} from '@supabase/ssr'
// import { cookies } from 'next/headers'
// export async function middleware(request: NextRequest) {
//     const cookieStore = cookies()

//     const supabase = createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//         {
//             cookies: {
//                 get(name: string) {
//                     return cookieStore.get(name)?.value
//                 },
//             },
//         }
//     )

//     const user = (await supabase.auth.getUser()).data.user;

//     const path =request.nextUrl.pathname
    
//     if (user == null) {
    
//         if(path=='/home'){
          
                    
//         return NextResponse.redirect(new URL("/login", request.url));
//         }

//         return NextResponse.next();

//     } else {
//         if(path=='/login'){
          
                    
//                return NextResponse.redirect(new URL("/home", request.url));
//             }
//             return NextResponse.next();
   
//     }





// }


export const config = {
    matcher: ['/login', '/notes'],

}