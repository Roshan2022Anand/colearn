"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import Loader from "../Loader"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { MyContext } from "../Mycontext"

export default function Component() {
    const { data: session, status } = useSession()
    const { setNewUser, setuserEmail, router } = useContext(MyContext);
    const [showExistingUserModal, setShowExistingUserModal] = useState(false);

    //function to check if the user is new or not
    const checkUser = async () => {
        try {
            const res = await axios.post("/api/checkEmail", { email: session.user.email })
            console.log(res.data)

            //if user already exists 
            if (res.data.exists) {
                setNewUser(false)
                setShowExistingUserModal(true)
            }
            //if user is new
            else {
                setNewUser(true)
                router.push("/mainPg/onboarding")
            }
        }
        catch (error) {
            console.log("error occurred")
        }
    }

    useEffect(() => {
        if (session) {
            console.log("session formed")
            setuserEmail(session.user.email);
            checkUser()
        }
    }, [session])

    if (status === "loading") return <Loader /> // or a loading spinner

    return (
        <div className="flex flex-col">
            {showExistingUserModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 max-w-sm w-full shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Oops!</h2>
                        <p className="text-center text-gray-600 mb-6">
                            It looks like you already have an account with us.
                        </p>
                        <div className="flex justify-center">
                            <button
                                onClick={() => router.push('/LoginPg')}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <button className="btn-style-one flex items-center justify-center  py-2 px-4 text-white rounded-md mb-4" onClick={() => signIn('google')}>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="currentColor" />
                </svg>
                Continue with Google
            </button>

            <button className="btn-style-one flex items-center justify-center py-2 px-4 text-white rounded-md" onClick={() => signIn('github')}>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="currentColor" />
                </svg>
                Continue with GitHub
            </button>
        </div>
    )
}