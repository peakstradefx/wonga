import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Icons } from '../icons';
import useVerifyKYC from '@/hooks/mutations/useVerifyKYC';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

interface KYCDetails {
    idBackImg: string;
    idFrontImg: string;
    documentType: string;
    _id: string;
}
interface ViewKYCModalProps {
    KYCDetails: KYCDetails | null;
}

function ViewKYCModal({ KYCDetails }: ViewKYCModalProps) {
    const [open, setOpen] = React.useState(false)
    const { mutate, isPending } = useVerifyKYC()

    const handleVerifyKYC = () => {
        const data = {
            kycId: KYCDetails?._id?.toString() || "",
            status: "validated"
        };
        mutate(data, {
            onSuccess: (response) => {
                toast.success(response.data.message)
                setOpen(false)
            },
            onError: (error) => {
                const axiosError = error as AxiosError<{ message: string }>;
                toast.error(axiosError.response?.data?.message || 'An error occurred')
                setOpen(false)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="inline-flex bg-none border text-black hover:bg-neutral-50/90 h-9 px-4 py-2 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold">
                View document
            </DialogTrigger>
            <DialogContent className="max-h-[550px] overflow-scroll">
                <DialogHeader>
                    <DialogTitle className='text-center'>KYC document</DialogTitle>
                </DialogHeader>
                <div>
                    {!KYCDetails ? (
                        <div className="text-center text-xl my-7">No KYC document uploaded</div>
                    ) : (
                        <div>
                            <div className="min-h-[310px] flex flex-col items-center rounded-lg my-6 border p-4 border-[#8A8A99]">
                                <div className="w-full h-[280px] border flex justify-center">
                                    <Image
                                        src={KYCDetails?.idFrontImg}
                                        width={350}
                                        height={250}
                                        className="h-full w-auto"
                                        alt=""
                                    />
                                </div>
                                ID Front
                            </div>
                            <div className="min-h-[310px] flex flex-col items-center rounded-lg my-6 border p-4 border-[#8A8A99]">
                                <div className="w-full h-[280px] border flex justify-center">
                                    <Image
                                        src={KYCDetails?.idBackImg}
                                        width={350}
                                        height={250}
                                        className="h-full w-auto"
                                        alt=""
                                    />
                                </div>
                                ID Back
                            </div>
                            <div className="flex justify-center">
                                <Button
                                    className="min-w-[120px]"
                                    disabled={isPending}
                                    onClick={handleVerifyKYC}
                                >
                                    {isPending && (
                                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Verify KYC
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ViewKYCModal
