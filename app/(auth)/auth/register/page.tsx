import { CreateAccountForm } from "@/components/auth/CreateAccountForm"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "PeakTrade FX | Create Account",
}

export default function RegisterPage() {
    return (
        <>
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Create a new account
                    </h1>
                </div>
                <CreateAccountForm />
                <div className='flex justify-center text-sm mt-4'>
                    <p>Already have an account?{" "}</p>
                    <Link href={"/auth/login"} className='font-bold hover:opacity-80 ml-1 text-primary'>
                        Login
                    </Link>
                </div>
                <p className="px-8 text-center text-sm text-muted-foreground">
                    By clicking continue, you agree to our{" "}
                    <Link
                        href="/terms"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                        href="/privacy"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </>
    )
}
