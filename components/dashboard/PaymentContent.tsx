"use client";
import React from 'react'
import { Icons } from '../icons'
import { Button } from '../ui/button'
import { toast } from 'sonner';
import useMakePayment from '@/hooks/mutations/useMakePayment';
import { FieldValues, useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { AxiosError } from 'axios';
import Image from 'next/image';
import FormControl from '../FormControl';
import { walletDetails } from '@/utils/walletDetails';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type WalletDetail = {
    name: string;
    value: string;
    address: string;
    qrCode: string;
}

function PaymentContent() {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const { handleSubmit, register, formState: { errors }, setValue } = useForm<FieldValues>({ mode: "onChange" });

    const searchParams = useSearchParams();
    const amount = searchParams.get("amount");

    const { mutate } = useMakePayment();

    const onSubmit = (data: FieldValues) => {
        const formData = new FormData();
        formData.append('wallet', data.wallet);
        formData.append('amount', amount || '0');
        formData.append('proof', data.proof[0]);

        setIsLoading(true);

        mutate(formData, {
            onSuccess: (response) => {
                toast.success(response.data.message);
            },
            onError: (error) => {
                const axiosError = error as AxiosError<{ message: string }>;
                toast.error(axiosError.response?.data?.message || 'An error occurred');
            }
        });
    };

    const [copiedWallet, setCopiedWallet] = React.useState<string | null>(null);
    const handleCopy = (address: string) => {
        navigator.clipboard.writeText(address)
            .then(() => {
                setCopiedWallet(address);
                setTimeout(() => {
                    setCopiedWallet(null);
                }, 2000);
            })
            .catch((error) => {
                console.error("Failed to copy address:", error);
                toast.error('Failed to copy address');
            });
    };

    const renderIcon = (iconName: string) => {
        const IconComponent = Icons[iconName.toLowerCase() as keyof typeof Icons];
        return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
    };
    return (
        <>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                Make a payment of ${amount ? parseFloat(amount) : "0.00"}
            </h2>
            <div className='text-sm text-muted-foreground mb-6'>
                Send the exact amount to the designated wallet and upload the payment proof below.
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {walletDetails.map((wallet: WalletDetail, idx) => {
                    const isCopied = copiedWallet === wallet.address;

                    return (
                        <Card key={idx} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-bold">
                                    {wallet.name}
                                </CardTitle>
                                {renderIcon(wallet.value)}
                            </CardHeader>
                            <CardContent>
                                <div className='flex justify-center mt-2'>
                                    <Image
                                        src={wallet.qrCode}
                                        width={200}
                                        height={200}
                                        alt={`${wallet.name} QR Code`}
                                        className="rounded-lg"
                                    />
                                </div>
                                <div className="text-center mt-4">
                                    <p className="text-xs text-muted-foreground break-all">
                                        {wallet.address}
                                    </p>
                                    <Button
                                        variant="outline"
                                        className='h-fit px-4 py-2 text-primary font-medium text-sm mt-3'
                                        onClick={() => handleCopy(wallet.address)}
                                        disabled={isCopied}
                                    >
                                        {isCopied ? 'Copied!' : 'Copy Address'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl font-semibold tracking-tight">
                        Upload Payment Proof
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-[320px]'>
                        <FormControl
                            as="select"
                            inputStyle
                            options={walletDetails}
                            labelText='Select payment method'
                            placeholder="Select payment method"
                            {...register('wallet', { required: 'Please select a payment method' })}
                            error={typeof errors.wallet?.message === 'string' ? errors.wallet.message : undefined}
                            setValue={setValue}
                        />

                        <div className="mt-4">
                            <label className='block text-sm font-medium text-gray-700'>
                                Upload Payment Proof
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                className="mt-2 block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-violet-50 file:text-violet-700
                                hover:file:bg-violet-100
                                border rounded-lg p-2"
                                {...register("proof", {
                                    required: 'Payment proof is required',
                                    validate: {
                                        fileType: (files) =>
                                            !files[0] || files[0].type.startsWith('image/') ||
                                            'Only image files are allowed',
                                        fileSize: (files) =>
                                            !files[0] || files[0].size <= 5 * 1024 * 1024 ||
                                            'File size must be less than 5MB'
                                    }
                                })}
                            />
                            {errors.proof && (
                                <p className="mt-2 text-red-600 text-xs">
                                    {typeof errors.proof.message === 'string' ? errors.proof.message : 'Invalid file'}
                                </p>
                            )}
                        </div>

                        <Button
                            className='w-full mt-6'
                            disabled={isLoading}
                            type="submit"
                        >
                            {isLoading ? (
                                <>
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : 'Submit Payment'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </>

    )
}

export default PaymentContent
