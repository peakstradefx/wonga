"use client"
import React from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import FormControl from './FormControl'
import { Icons } from './icons'
import useCreateInvestment from '@/hooks/mutations/useCreateInvestment'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'

type PricingCardProps = {
    planName: string;
    minDeposit: number;
    maxDeposit: number;

}

function PricingModal({ planName, minDeposit, maxDeposit }: PricingCardProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const { handleSubmit, formState: { errors }, control } = useForm<FieldValues>({
        mode: "onChange", defaultValues: {
            investmentAmount: minDeposit
        }
    });

    const router = useRouter()

    const { mutate } = useCreateInvestment()

    const onSubmit = (data: FieldValues) => {
        setIsLoading(true)
        const formData = new FormData();
        formData.append('plan', planName);
        formData.append('amount', data.investmentAmount);
        console.log("formData:", formData)
        mutate(formData, {
            onSuccess: (response) => {
                setIsLoading(false)
                toast.success(response.data.message)
                router.push("/dashboard")
            },
            onError: (error) => {
                const axiosError = error as AxiosError<{ message: string }>;
                toast.error(axiosError?.response?.data.message)
                if (axiosError?.response?.data.message === "You have an active investment already") {
                    router.push(`/dashboard`)
                } else {
                    router.push(`/dashboard/deposit/payment?amount=${data.investmentAmount}`)
                }
                setIsLoading(false)
            }
        })
    }
    return (
        <Dialog>
            <DialogTrigger className="inline-flex bg-primary text-white text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold">
                Select plan
            </DialogTrigger>
            <DialogContent className="top-[30%]">
                <DialogHeader>
                    <DialogTitle>{`${planName} Plan`} <span className='text-muted-foreground text-sm font-normal'>{`(Min deposit: $${minDeposit}, max deposit: $${maxDeposit})`}</span></DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4">
                    <div>
                        <Controller
                            name="investmentAmount"
                            control={control}
                            rules={{
                                required: 'Amount is required',
                                pattern: {
                                    value: /^[0-9]+(\.[0-9]+)?$/,
                                    message: 'Please enter numbers only',
                                },
                                min: {
                                    value: minDeposit,
                                    message: `Minimum deposit amount is $${minDeposit} for this plan`,
                                },
                                max: {
                                    value: maxDeposit,
                                    message: `Maximum deposit amount is $${maxDeposit} for this plan`,
                                },
                            }}
                            render={({ field }) => (
                                <FormControl
                                    as="input"
                                    labelText="Enter the amount you want to invest (USD)"
                                    placeholder="Enter amount in USD $"
                                    type="tel"
                                    {...field}
                                    error={getErrorMessage(errors.investmentAmount)}
                                />
                            )}
                        />
                    </div>
                    <Button disabled={isLoading}>
                        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                        Continue
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default PricingModal
