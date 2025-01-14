"use client"

import React, { Suspense } from 'react'
import PaymentContent from './PaymentContent'

function PaymentWrapper() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <PaymentContent />
        </Suspense>
    )
}

export default PaymentWrapper