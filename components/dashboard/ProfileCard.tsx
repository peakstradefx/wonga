"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import useGetUserDetails from '@/hooks/queries/useGetUserDetails'

function ProfileCard() {
    const { data } = useSession()
    const { data: userData } = useGetUserDetails(data?.user?.id?.toString() || "")
    console.log("userData", userData?.data?.user)
    const user = userData?.data?.user
    if (!userData) {
        return (<Card className='animate-pulse h-[50px]'></Card>)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="sr-only">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <Image
                    src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48cGF0aCBmaWxsPSIjMmY4OGZmIiBzdHJva2U9IiMwMDAiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMCIgZD0iTTUuMDAzNzIgNDIuMjMxMUM1LjAwMzcyIDQyLjY1NTcgNS4zNTgwNyA0Mi45OTk5IDUuNzk1MjEgNDIuOTk5OUw0Mi4yMDIzIDQzQzQyLjYzOTQgNDMgNDIuOTkzOCA0Mi42NTU4IDQyLjk5MzggNDIuMjMxM1Y0MS4zMTMxQzQzLjAxMiA0MS4wMzY0IDQzLjA0OSAzOS42NTU1IDQyLjEzODggMzguMTI4OUM0MS41NjQ4IDM3LjE2NjMgNDAuNzMxOCAzNi4zMzQ3IDM5LjY2MjggMzUuNjU3M0MzOC4zNjk2IDM0LjgzNzggMzYuNzI0NSAzNC4yNDQgMzQuNzM0NyAzMy44ODY1QzM0LjcyIDMzLjg4NDYgMzMuMjQ0NiAzMy42ODkgMzEuNzMzMSAzMy4zMDNDMjkuMTAxIDMyLjYzMDcgMjguODcwOSAzMi4wMzU3IDI4Ljg2OTQgMzIuMDI5OUMyOC44NTM5IDMxLjk3MTEgMjguODMxNSAzMS45MTQ2IDI4LjgwMjggMzEuODYxNUMyOC43ODEzIDMxLjc1MDUgMjguNzI4MSAzMS4zMzI4IDI4LjgyOTggMzAuMjEzNkMyOS4wODggMjcuMzcxIDMwLjYxMjggMjUuNjkxIDMxLjgzOCAyNC4zNDEyQzMyLjIyNDQgMjMuOTE1NSAzMi41ODkzIDIzLjUxMzQgMzIuODcwNCAyMy4xMTkxQzM0LjA4MjcgMjEuNDE4MSAzNC4xOTUyIDE5LjQ4MzkgMzQuMjAwMyAxOS4zNjRDMzQuMjAwMyAxOS4xMjExIDM0LjE3MjQgMTguOTIxNCAzNC4xMTI3IDE4LjczNjNDMzMuOTkzNyAxOC4zNjU5IDMzLjc2OTggMTguMTM1MSAzMy42MDYzIDE3Ljk2NjZMMzMuNjA1MiAxNy45NjU0QzMzLjU2NCAxNy45MjMgMzMuNTI1MSAxNy44ODI4IDMzLjQ5MzMgMTcuODQ1OUMzMy40ODEyIDE3LjgzMTggMzMuNDQ5IDE3Ljc5NDUgMzMuNDc4MyAxNy42MDNDMzMuNTg1OSAxNi44OTgxIDMzLjY1MDUgMTYuMzA3OSAzMy42ODE1IDE1Ljc0NTZDMzMuNzM2NyAxNC43NDM4IDMzLjc3OTggMTMuMjQ1NiAzMy41MjE0IDExLjc4NzVDMzMuNDg5NSAxMS41Mzg1IDMzLjQzNDcgMTEuMjc1NSAzMy4zNDk0IDEwLjk2MjJDMzMuMDc2NCA5Ljk1ODE0IDMyLjYzNzggOS4wOTk3MSAzMi4wMjg0IDguMzkxMjRDMzEuOTIzNiA4LjI3NzIyIDI5LjM3NTYgNS41OTI4IDIxLjk3ODggNS4wNDIwMUMyMC45NTYgNC45NjU4NiAxOS45NDQ5IDUuMDA2ODggMTguOTQ5NiA1LjA1Nzc1QzE4LjcwOTcgNS4wNjk2MSAxOC4zODEyIDUuMDg1ODkgMTguMDczOCA1LjE2NTU0QzE3LjMxMDEgNS4zNjMzNyAxNy4xMDYzIDUuODQ3NDMgMTcuMDUyOCA2LjExODM0QzE2Ljk2NDEgNi41NjcwOCAxNy4xMiA2LjkxNjE1IDE3LjIyMzEgNy4xNDcxOEwxNy4yMjMxIDcuMTQ3MkwxNy4yMjMxIDcuMTQ3MjNDMTcuMjM4MSA3LjE4MDcyIDE3LjI1NjYgNy4yMjIxMyAxNy4yMjQzIDcuMzI5OTdDMTcuMDUyNiA3LjU5NTg4IDE2Ljc4MjUgNy44MzU2MSAxNi41MDcxIDguMDYyNzNDMTYuNDI3NSA4LjEzMDM4IDE0LjU3MjcgOS43Mjk2OCAxNC40NzA3IDExLjgxODlDMTQuMTk1NyAxMy40MDc4IDE0LjIxNjUgMTUuODgzNCAxNC41NDE3IDE3LjU5NDRDMTQuNTYwNiAxNy42ODg5IDE0LjU4ODUgMTcuODI4OCAxNC41NDMyIDE3LjkyMzNMMTQuNTQzMiAxNy45MjMzQzE0LjE5MzUgMTguMjM2NyAxMy43OTcxIDE4LjU5MTkgMTMuNzk4MSAxOS40MDI0QzEzLjgwMjMgMTkuNDgzOSAxMy45MTQ4IDIxLjQxODEgMTUuMTI3MiAyMy4xMTkxQzE1LjQwOCAyMy41MTMxIDE1Ljc3MjYgMjMuOTE0OSAxNi4xNTg3IDI0LjM0MDNMMTYuMTU5NiAyNC4zNDEyTDE2LjE1OTYgMjQuMzQxM0MxNy4zODQ4IDI1LjY5MTEgMTguOTA5NSAyNy4zNzEgMTkuMTY3OCAzMC4yMTM1QzE5LjI2OTQgMzEuMzMyNyAxOS4yMTYyIDMxLjc1MDUgMTkuMTk0NyAzMS44NjE0QzE5LjE2NiAzMS45MTQ1IDE5LjE0MzYgMzEuOTcxIDE5LjEyODIgMzIuMDI5OEMxOS4xMjY2IDMyLjAzNTYgMTguODk3NCAzMi42Mjg3IDE2LjI3NzIgMzMuMjk5NkMxNC43NjU2IDMzLjY4NjcgMTMuMjc3NSAzMy44ODQ1IDEzLjIzMzEgMzMuODkwOUMxMS4yOTk0IDM0LjIxNzMgOS42NjQzOCAzNC43OTYzIDguMzczNTEgMzUuNjExNUM3LjMwODEzIDM2LjI4NDQgNi40NzM1NCAzNy4xMTc1IDUuODkyODkgMzguMDg3N0M0Ljk2NTE3IDM5LjYzNzkgNC45OTAyNSA0MS4wNDk3IDUuMDAzNzIgNDEuMzA3NFY0Mi4yMzExWiIvPjwvc3ZnPg=="
                    alt="Profile Picture"
                    className="rounded-full w-32 h-32 mb-4 bg-slate-100"
                    width={128}
                    height={128}
                />
                <div>
                    <p className='text-center'>Name: <span>{`${user?.firstName} ${user?.lastName}`}</span></p>
                    <p className='text-center'>Email: <span>{user?.email}</span></p>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProfileCard
