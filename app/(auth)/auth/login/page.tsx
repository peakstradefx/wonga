import { LoginForm } from "@/components/auth/LoginForm"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "PeakTrade FX | Login",
}

export default function LoginPage() {
  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Login your account
          </h1>
        </div>
        <LoginForm />
        <div className='flex justify-center text-sm mt-4'>
          <p>Don&apos;t have an account?{" "}</p>
          <Link href={"/auth/register"} className='font-bold hover:opacity-80 ml-1 text-primary'>
            Create account
          </Link>
        </div>
      </div>
    </div>
  )
}
