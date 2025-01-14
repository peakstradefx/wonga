import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { Metadata } from 'next'
import Link from 'next/link'
import React, { Suspense } from 'react'

export const metadata: Metadata = {
    title: "PeakTrade FX | Reset Password OTP",
}

function ResetPasswordOTP() {
    return (
        <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        One-Time-Password
                    </h1>
                    <p>Enter the code sent to your email address</p>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <ResetPasswordForm />
                </Suspense>
                <div className='flex justify-center text-sm mt-4'>
                    <Link href="/auth/login" className='font-bold hover:opacity-80 ml-1 text-primary'>
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ResetPasswordOTP