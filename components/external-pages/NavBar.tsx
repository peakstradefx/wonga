"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { NavMenu } from './NavMenu'
import Image from 'next/image'
import { logo } from '@/public/assets/images'
import { X } from 'lucide-react'

function NavBar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        // Close menu on route change
        setIsOpen(false)
    }, [pathname])

    useEffect(() => {
        // Lock/unlock body scroll when menu opens/closes
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        // Cleanup function to ensure scroll is restored when component unmounts
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    return (
        <nav className="py-5 lg:fixed w-full bg-white transition-all duration-500 z-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="w-full flex flex-col lg:flex-row">
                    <div className="flex justify-between lg:flex-row">
                        <Link href="/" className="flex items-center">
                            <Image src={logo} width={200} height={40} alt='Peak FX logo' />
                            <span className='font-semibold text-lg whitespace-nowrap sr-only'>PeakTrade FX</span>
                        </Link>
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            aria-controls="navbar-default"
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                        clipRule="evenodd"></path>
                                </svg>
                            )}
                        </button>
                    </div>
                    {/* Desktop Navigation */}
                    <div className="hidden w-full lg:flex lg:pl-11" id="navbar">
                        <NavMenu />
                        <div className="flex gap-4 md:items-center justify-start flex-col lg:flex-row max-lg:gap-4 lg:flex-1 lg:justify-end">
                            <Link href="/auth/login"><Button variant="secondary">Login</Button></Link>
                            <Link href="/auth/register"><Button>Sign up</Button></Link>
                        </div>
                    </div>
                    {/* Mobile Navigation */}
                    {isOpen && (
                        <div className="lg:hidden fixed inset-0 top-[73px] z-50 bg-white overflow-y-auto">
                            <div className="flex h-full flex-col px-4 pt-4 pb-6">
                                <NavMenu />
                                <div className="mt-6 flex flex-col gap-4">
                                    <Link href="/auth/login">
                                        <Button variant="secondary" className="w-full">Login</Button>
                                    </Link>
                                    <Link href="/auth/register">
                                        <Button className="w-full">Sign up</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default NavBar