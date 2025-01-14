"use client"
import DashboardContainer from '@/components/dashboard/DashboardContainer'
import SkeletonTable from '@/components/dashboard/SkeletonTable'
import ReusableTable from '@/components/dashboard/Table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useGetPayments from '@/hooks/queries/useGetPayments'
import useGetWithdrawals from '@/hooks/queries/useGetWithdrawals'
import { formatDateTime } from '@/utils/formatDateAndTime'
import { formatWithCommas } from '@/utils/formatNumberWithComma'
import { shortenId } from '@/utils/shortenId'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

type WthdrawalDataRow = {
    id: number;
    amount: number;
    charges: number;
    receivingMode: string;
    status: string;
    date: string;
};

type PaymentDataRow = {
    id: string;
    amount: number;
    paymentMethod: string;
    status: string;
    date: string;
};

function TransactionHistoryPage() {

    const { data: withdrawals, isLoading: isWithdrawalsLoading } = useGetWithdrawals()
    const { data: listPayments, isLoading: isPaymentLoading } = useGetPayments();


    const withdrawalTableData = (withdrawals?.data?.withdrawals ?? []).map((item: {
        _id: string;
        amount: number;
        wallet: string;
        paymentMethod: string;
        status: string;
        createdAt: string;
    }) => ({
        id: shortenId(item._id),
        amount: `$${formatWithCommas(item.amount)}`,
        charges: `$${(item.amount * 0.15).toFixed(2)}`,
        receivingMode: item.paymentMethod,
        status: item.status,
        date: formatDateTime(item.createdAt),
    })) as WthdrawalDataRow[];

    const paymentTableData = (listPayments?.data ?? []).map((item: {
        _id: string;
        amount: number;
        wallet: string;
        status: string;
        createdAt: string;
    }) => ({
        id: shortenId(item._id),
        amount: `$${formatWithCommas(item.amount)}`,
        paymentMethod: item.wallet,
        status: item.status,
        date: formatDateTime(item.createdAt),
    })) as PaymentDataRow[];

    const paymentColumns: ColumnDef<PaymentDataRow>[] = [
        { accessorKey: 'id', header: 'ID' },
        { accessorKey: 'amount', header: 'Amount' },
        { accessorKey: 'paymentMethod', header: 'Payment Method' },
        { accessorKey: 'status', header: 'Status' },
        { accessorKey: 'date', header: 'Date - Time' },
    ];

    const withdrawalColumns: ColumnDef<WthdrawalDataRow>[] = [
        { accessorKey: 'id', header: 'ID' },
        { accessorKey: 'amount', header: 'Amount requested' },
        { accessorKey: 'charges', header: 'Charges' },
        { accessorKey: 'receivingMode', header: 'Receiving mode' },
        { accessorKey: 'status', header: 'Status' },
        { accessorKey: 'date', header: 'Date' },
    ];

    return (
        <DashboardContainer>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Transaction History</h2>
            <Tabs defaultValue="deposit">
                <TabsList className="my-4">
                    <TabsTrigger value="deposit">Deposit</TabsTrigger>
                    <TabsTrigger value="withdrawal">Withdrawal</TabsTrigger>
                </TabsList>
                <TabsContent value="deposit">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isPaymentLoading ? (
                                <SkeletonTable columnsCount={paymentColumns.length} rowsCount={5} />
                            ) : paymentTableData.length === 0 ? (
                                <div className="py-10 text-center text-lg text-muted-foreground">
                                    No payment history
                                </div>
                            ) : (
                                <ReusableTable data={paymentTableData} columns={paymentColumns} />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="withdrawal">
                    <Card>
                        <CardHeader>
                            <CardTitle>Withdrawal History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isWithdrawalsLoading ? (
                                <SkeletonTable columnsCount={withdrawalColumns.length} rowsCount={5} />
                            ) : withdrawalTableData.length === 0 ? (
                                <div className="py-10 text-center text-lg text-muted-foreground">
                                    No withdrawal history
                                </div>
                            ) : (
                                <ReusableTable data={withdrawalTableData} columns={withdrawalColumns} />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>


        </DashboardContainer>
    );
}

export default TransactionHistoryPage;
