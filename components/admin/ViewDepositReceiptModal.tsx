import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import Image from 'next/image'
import { Button } from '../ui/button'
import useUpdatePayment from '@/hooks/mutations/useUpdatePayment';
import { Icons } from '../icons';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

interface DepositDetails {
    _id: number;
    amount: number;
    proofURL: string;
    wallet: string;
}
interface ViewDepositReceiptModalProps {
    depositDetails: DepositDetails | null;
    name: string;
}
type UpdatePaymentRequest = {
    paymentId: string;
    status: string;
}

function ViewDepositReceiptModal({ depositDetails, name }: ViewDepositReceiptModalProps) {
    const [open, setOpen] = React.useState(false)
    const { mutate, isPending } = useUpdatePayment()
    const handleUpdatePayment = () => {
        const data = {
            paymentId: depositDetails?._id?.toString() || "",
            status: "validated"
        } as UpdatePaymentRequest;
        mutate(data, {
            onSuccess: (response) => {
                toast.success(response?.data.message)
                setOpen(false)
            },
            onError: (error) => {
                const axiosError = error as AxiosError<{ message: string }>;
                toast.error(axiosError?.response?.data.message)
            }
        })
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="inline-flex bg-none border text-black hover:bg-neutral-50/90 h-9 px-4 py-2 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold">
                View receipt
            </DialogTrigger>
            <DialogContent className="max-h-[550px] overflow-scroll">
                <DialogHeader>
                    <DialogTitle className='text-center'>Deposit receipt</DialogTitle>
                </DialogHeader>
                <div>
                    {!depositDetails ? (
                        <div className="text-center text-xl my-7">No deposit receipt uploaded</div>
                    ) : (
                        <div>
                            <p className='text-center'>Verify that <span className='font-semibold'>{name}</span> has made a deposit of <span className='font-semibold'>${depositDetails?.amount}</span> using <span className='font-semibold'>{depositDetails?.wallet}</span> as payment method</p>
                            <div className="min-h-[310px] flex flex-col items-center rounded-lg my-6 border p-4 border-[#8A8A99]">
                                <div className="w-full h-[280px] border flex justify-center">
                                    <Image
                                        src={depositDetails?.proofURL}
                                        width={350}
                                        height={250}
                                        className="h-full w-auto"
                                        alt=""
                                    />
                                </div>
                            </div>
                            <div className='flex justify-center'>
                                <Button
                                    className="min-w-[120px]"
                                    disabled={isPending}
                                    onClick={handleUpdatePayment}
                                >
                                    {isPending && (
                                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Verify payment
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ViewDepositReceiptModal
