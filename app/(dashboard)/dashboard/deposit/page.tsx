"use client"
import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import ReusableTable from '@/components/dashboard/Table';
import { Button } from '@/components/ui/button';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Controller, useForm } from 'react-hook-form';
import FormControl from '@/components/FormControl';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useGetPayments from '@/hooks/queries/useGetPayments';
import { formatDateTime } from '@/utils/formatDateAndTime';
import { shortenId } from '@/utils/shortenId';
import SkeletonTable from '@/components/dashboard/SkeletonTable';

type DataRow = {
    id: string;
    amount: number;
    paymentMethod: string;
    status: string;
    date: string;
};

type Payload = {
    investmentAmount: number;
};

const columns: ColumnDef<DataRow>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'amount', header: 'Amount' },
    { accessorKey: 'paymentMethod', header: 'Payment Method' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'date', header: 'Date - Time' },
];

const DepositPage = () => {
    const [isLoadingBtn, setIsLoadingBtn] = React.useState<boolean>(false);

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<Payload>({
        mode: 'onChange',
        defaultValues: {
            investmentAmount: 1000,
        },
    });

    const router = useRouter();

    const { data: listPayments, isLoading } = useGetPayments();

    const tableData = (listPayments?.data ?? []).map((item: {
        _id: string;
        amount: number;
        wallet: string;
        status: string;
        createdAt: string;
    }) => ({
        id: shortenId(item._id),
        amount: `$${item.amount}`,
        paymentMethod: item.wallet,
        status: item.status,
        date: formatDateTime(item.createdAt),
    })) as DataRow[];


    const onSubmit = (data: Payload) => {
        setIsLoadingBtn(true);

        setTimeout(() => {
            setIsLoadingBtn(false);
            router.push(`/dashboard/deposit/payment?amount=${data.investmentAmount}`);
        }, 3000);
    };

    const getErrorMessage = (error: unknown): string | undefined => {
        if (!error) return undefined;
        if (typeof error === 'string') return error;
        if (error instanceof Error) return error.message;
        return undefined;
    };

    return (
        <DashboardContainer>
            <Dialog>
                <DialogTrigger className="inline-flex bg-primary text-white text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold">
                    <Plus />
                    New Deposit
                </DialogTrigger>
                <DialogContent className="top-[30%]">
                    <DialogHeader>
                        <DialogTitle>Make New Deposit</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
                                        value: 10,
                                        message: 'Minimum deposit amount is $10',
                                    },
                                    max: {
                                        value: 1000000,
                                        message: 'Maximum deposit amount is $1,000,000',
                                    },
                                }}
                                render={({ field }) => (
                                    <FormControl
                                        as="input"
                                        labelText="Enter the amount you want to deposit (USD)"
                                        placeholder="Enter amount in USD $"
                                        type="tel"
                                        {...field}
                                        error={getErrorMessage(errors.investmentAmount)}
                                    />
                                )}
                            />
                        </div>
                        <Button disabled={isLoadingBtn}>
                            {isLoadingBtn && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                            Continue
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <SkeletonTable columnsCount={columns.length} rowsCount={5} />
                    ) : tableData.length === 0 ? (
                        <div className="py-10 text-center text-lg text-muted-foreground">
                            No payment history
                        </div>
                    ) : (
                        <ReusableTable data={tableData} columns={columns} />
                    )}
                </CardContent>
            </Card>
        </DashboardContainer>
    );
};

export default DepositPage;
