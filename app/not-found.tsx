import NavBar from '@/components/external-pages/NavBar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function NotFound() {
    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 text-center">
                    <div className="mb-8">
                        <h2 className="mt-6 text-6xl font-extrabold text-gray-900 dark:text-gray-100">404</h2>
                        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">Page not found</p>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
                    </div>
                    <div className="mt-8">
                        <Link href="/">
                            <Button>
                                <svg className="mr-2 -ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18m-9-9l9 9-9 9" />
                                </svg>
                                Go back home
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="mt-16 w-full max-w-2xl">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-2 bg-gray-100 dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">
                                If you think this is a mistake, please contact support
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NotFound
