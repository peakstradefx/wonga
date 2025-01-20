"use client"
import DashboardContainer from '@/components/dashboard/DashboardContainer'
import TradingViewTickerTape from '@/components/dashboard/TradingViewTickerTape'
import TradingViewWidget from '@/components/dashboard/TradingViewWidget'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import useGetInvestments from '@/hooks/queries/useGetInvestments'
import { formatWithCommas } from '@/utils/formatNumberWithComma'
import { useSession } from 'next-auth/react'
import React from 'react'

function DashboardHome() {
  const session = useSession()
  const firstName = session?.data?.user?.firstName || "User"
  const lastName = session?.data?.user?.lastName || ""

  const { data } = useGetInvestments()
  const investment = data?.data || []
  const accountBalance = investment?.account?.accountBalance || 0
  const totalInvestmentAmount = investment?.stats?.totalInvestmentAmount || 0
  const totalProfit = investment?.stats?.totalProfit || 0
  const totalPackage = investment?.summary?.totalLifetimeInvestments || 0
  const activePackage = investment?.summary?.activeInvestmentsCount || 0

  return (
    <DashboardContainer>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Welcome, <span>{firstName}</span> <span>{lastName}</span></h2>
      </div>
      <div className='text-sm'>
        Welcome to PeaksTrade FX, please note that this trade platform does not make use of any account manager and hence any payment made outside the address provided on this site is at user risk. Contact our support team at support@peakstradefx.com
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Account balance
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${formatWithCommas(accountBalance)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Investment Amount
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${formatWithCommas(totalInvestmentAmount)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Investment profit
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${formatWithCommas(totalProfit)}</div>
            {investment.investments?.active?.length > 0 && (
              <p className="text-xs text-muted-foreground">
                +14.9% from last month
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bonus
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{investment.investments?.active?.length > 0 ? "$50" : "$0"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Package
            </CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 1024 1024"
              className="h-4 w-4 text-muted-foreground">
              <path fill="currentColor" d="M872 394c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8H708V152c0-4.4-3.6-8-8-8h-64c-4.4 0-8 3.6-8 8v166H400V152c0-4.4-3.6-8-8-8h-64c-4.4 0-8 3.6-8 8v166H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h168v236H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h168v166c0 4.4 3.6 8 8 8h64c4.4 0 8-3.6 8-8V706h228v166c0 4.4 3.6 8 8 8h64c4.4 0 8-3.6 8-8V706h164c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8H708V394zM628 630H400V394h228z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPackage}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Package
            </CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 1024 1024"
              className="h-4 w-4 text-muted-foreground">
              <path fill="currentColor" d="M872 394c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8H708V152c0-4.4-3.6-8-8-8h-64c-4.4 0-8 3.6-8 8v166H400V152c0-4.4-3.6-8-8-8h-64c-4.4 0-8 3.6-8 8v166H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h168v236H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h168v166c0 4.4 3.6 8 8 8h64c4.4 0 8-3.6 8-8V706h228v166c0 4.4 3.6 8 8 8h64c4.4 0 8-3.6 8-8V706h164c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8H708V394zM628 630H400V394h228z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePackage}</div>
          </CardContent>
        </Card>
      </div>
      <TradingViewTickerTape />
      <div className="">
        <Card className='md:p-4 h-[550px]'>
          <TradingViewWidget />
        </Card>
      </div>
    </DashboardContainer>
  )
}

export default DashboardHome
