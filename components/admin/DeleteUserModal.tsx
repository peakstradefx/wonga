import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import useDeleteUser from '@/hooks/mutations/useDeleteUser';
import { Icons } from '../icons';
import { AxiosError } from 'axios';

interface DeleteUserModalProps {
    userId: string;
}

function DeleteUserModal({ userId }: DeleteUserModalProps) {
    const [open, setOpen] = React.useState(false)
    const { mutate, isPending } = useDeleteUser()

    const handleDelete = (userId: string) => {
        mutate({ userId }, {
            onSuccess: (response) => {
                toast.success(response?.data?.message)
                setOpen(false)
            },
            onError: (error) => {
                const axiosError = error as AxiosError<{ message: string }>;
                toast.error(axiosError?.response?.data?.message)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="inline-flex bg-none text-red-600 hover:text-red-600/70 h-9 px-4 py-2 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
            </DialogTrigger>
            <DialogContent className="max-h-[550px] overflow-scroll">
                <DialogHeader>
                    <DialogTitle className='text-center'>Confirm Delete?</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-4 items-center justify-center'>
                    <p>Are you sure you want to delete this user?</p>
                    <Button className='max-w-[200px]' disabled={isPending} variant="destructive" onClick={() => handleDelete(userId)}>
                        {isPending ? (<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />) : ''}
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteUserModal
