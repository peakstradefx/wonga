"use client"
import React, { useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'

import { CircleAlert } from 'lucide-react';
import { DialogClose } from '@radix-ui/react-dialog';


function AnnouncementModal() {
    const [open, setOpen] = React.useState(false)
    useEffect(() => {
        setOpen(true)
    }, [])
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-h-[550px] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className='text-center sr-only'>Announcement</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col items-center justify-center'>
                    <CircleAlert size={60} strokeWidth={1.2} color='#c9dae1' />
                    <div className='flex flex-col items-center'>
                        <h3 className='text-2xl font-semibold my-4'>Announcement!</h3>
                        <p className='text- text-center mb-4'>Welcome to PeakTrade FX. Please note that this trade platform does not make use of any account manager and hence any payment made outside the address provided on this site is at user&apos;s risk. Contact our support team at support@peakstradefx.com.</p>
                    </div>
                    <DialogClose className='bg-primary inline-flex justify-center items-center px-6 py-2 outline-none rounded-full text-white'>Okay</DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AnnouncementModal
