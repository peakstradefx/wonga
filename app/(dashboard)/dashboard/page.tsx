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
  const investment = data?.data
  const accountBalance = investment?.accountBalance || 0
  const investmentAmount = investment?.activeInvestments?.[0]?.amount || 0
  const profit = investment?.activeInvestments?.[0]?.dailyProfit || 0
  const expectedProfit = investment?.activeInvestments?.[0]?.expectedTotalProfit || 0
  const investmentPlan = investment?.activeInvestments?.[0]?.plan || "No plan"
  const daysRemaining = investment?.activeInvestments?.[0]?.daysRemaining

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
              Investment amount
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
            <div className="text-2xl font-bold">${formatWithCommas(investmentAmount)}</div>
            {/* <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Profit
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
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+ ${formatWithCommas(profit)}</div>
            <p className="text-xs text-muted-foreground">
              +14.9% every day for 7 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Expected Profit
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
            <div className="text-2xl font-bold">${formatWithCommas(expectedProfit)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Package
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
              width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22 12v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a1 1 0 0 1-1-1V8a2 2 0 0 1 2-2h3.17A3 3 0 0 1 6 5a3 3 0 0 1 3-3c1 0 1.88.5 2.43 1.24v-.01L12 4l.57-.77v.01C13.12 2.5 14 2 15 2a3 3 0 0 1 3 3a3 3 0 0 1-.17 1H21a2 2 0 0 1 2 2v3a1 1 0 0 1-1 1M4 20h7v-8H4zm16 0v-8h-7v8zM9 4a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1m6 0a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1M3 8v2h8V8zm10 0v2h8V8z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{investmentPlan}</div>
            {daysRemaining && (
              <p className="text-xs text-muted-foreground">
                {daysRemaining} days remaining
              </p>
            )}
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
