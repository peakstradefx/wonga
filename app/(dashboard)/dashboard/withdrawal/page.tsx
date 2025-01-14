"use client"
import DashboardContainer from '@/components/dashboard/DashboardContainer'
import SkeletonTable from '@/components/dashboard/SkeletonTable'
import ReusableTable from '@/components/dashboard/Table'
import FormControl from '@/components/FormControl'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useRequestWithdrawal from '@/hooks/mutations/useRequestWithdrawal'
import useGetWithdrawals from '@/hooks/queries/useGetWithdrawals'
import { formatDateTime } from '@/utils/formatDateAndTime'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { shortenId } from '@/utils/shortenId'
import { walletDetails } from '@/utils/walletDetails'
import { ColumnDef } from '@tanstack/react-table'
import { AxiosError } from 'axios'
import React from 'react'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { toast } from 'sonner'

type DataRow = {
    id: number;
    amount: number;
    charges: number;
    receivingMode: string;
    status: string;
    date: string;
};

function WithdrawalPage() {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const { handleSubmit, control, register, formState: { errors }, setValue, reset } = useForm<FieldValues>({
        mode: "onChange", defaultValues: {
            investmentAmount: '',
            walletOption: '',
            walletAddress: '',
        },
    });
    const { data: withdrawals, isLoading: isWithdrawalsLoading } = useGetWithdrawals()
    const { mutate } = useRequestWithdrawal()

    const onSubmit = (data: FieldValues) => {
        const formData = new FormData();
        formData.append('amount', data.investmentAmount);
        formData.append('paymentMethod', data.walletOption);
        formData.append('walletAddress', data.walletAddress);
        setIsLoading(true);
        mutate(formData, {
            onSuccess: (response) => {
                toast.success(response.data.message);
                reset()
                setIsLoading(false);
            },
            onError: (error) => {
                const axiosError = error as AxiosError<{ message: string }>;
                toast.error(axiosError?.response?.data.message);
                setIsLoading(false);
            }
        });
    };

    const tableData = (withdrawals?.data?.withdrawals ?? []).map((item: {
        _id: string;
        amount: number;
        wallet: string;
        paymentMethod: string;
        status: string;
        createdAt: string;
    }) => ({
        id: shortenId(item._id),
        amount: `$${item.amount}`,
        charges: `$${(item.amount * 0.15).toFixed(2)}`,
        receivingMode: item.paymentMethod,
        status: item.status,
        date: formatDateTime(item.createdAt),
    })) as DataRow[];

    const columns: ColumnDef<DataRow>[] = [
        { accessorKey: 'id', header: 'ID' },
        { accessorKey: 'amount', header: 'Amount requested' },
        { accessorKey: 'charges', header: 'Charges' },
        { accessorKey: 'receivingMode', header: 'Receiving mode' },
        { accessorKey: 'status', header: 'Status' },
        { accessorKey: 'date', header: 'Date' },
    ];

    return (
        <DashboardContainer>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Request for withdrawal</h2>
            <div className='text-sm'>
                To withdraw funds, enter the amount and payment method and proceed to process the withdrawal.
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="sr-only">Request for withdrawal</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-[320px]'>
                        <Controller
                            name="investmentAmount"
                            control={control}
                            rules={{
                                required: "Amount is required",
                                pattern: {
                                    value: /^[0-9]+(\.[0-9]+)?$/,
                                    message: "Please enter numbers only",
                                },
                                min: {
                                    value: 10,
                                    message: "Minimum withdrawal amount is $10",
                                },
                                max: {
                                    value: 1000000,
                                    message: "Maximum withdrawal amount is $1,000,000",
                                },
                            }}
                            render={({ field }) => (
                                <FormControl
                                    as="input"
                                    labelText="Enter the amount (USD)"
                                    type="tel"
                                    {...field}
                                    error={getErrorMessage(errors.investmentAmount)}
                                />
                            )}
                        />

                        <FormControl
                            as="select"
                            inputStyle
                            options={walletDetails}
                            labelText='Select payment method'
                            placeholder="Select payment method"
                            {...register('walletOption', { required: 'Wallet is required' })}
                            error={typeof errors.walletOption?.message === 'string' ? errors.walletOption.message : undefined}
                            setValue={setValue}
                        />
                        <Controller
                            name="walletAddress"
                            control={control}
                            rules={{
                                required: "Wallet address is required",
                                minLength: { value: 25, message: "Enter a valid wallet address" }
                            }}
                            render={({ field }) => (
                                <FormControl
                                    as='input'
                                    labelText='Enter wallet address'
                                    {...field}
                                    error={getErrorMessage(errors.walletAddress)}
                                />
                            )}
                        />
                        <div className='mt-4 w-full'>
                            <Button className='w-full' disabled={isLoading}>
                                {isLoading && (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Submit
                            </Button>
                        </div>
                    </form>

                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Withdrawal History</CardTitle>
                </CardHeader>
                <CardContent>
                    {isWithdrawalsLoading ? (
                        <SkeletonTable columnsCount={columns.length} rowsCount={5} />
                    ) : tableData.length === 0 ? (
                        <div className="py-10 text-center text-lg text-muted-foreground">
                            No withdrawal history
                        </div>
                    ) : (
                        <ReusableTable data={tableData} columns={columns} />
                    )}
                </CardContent>
            </Card>
        </DashboardContainer>
    );
}

export default WithdrawalPage;
