// Inside your ResultCode === 0 block in the callback route:
await prisma.transaction.update({
  where: { checkoutRequestId: CheckoutRequestID },
  data: {
    status: "COMPLETED",
    mpesaReceipt: receipt,
    resultDesc: ResultDesc,
    // We update the subscription separately
  },
});

// Update or Create Subscription
await prisma.subscription.upsert({
  where: { userId: transaction.userId },
  update: {
    status: "ACTIVE",
    plan: "PRO",
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // 1 month from now
  },
  create: {
    userId: transaction.userId,
    status: "ACTIVE",
    plan: "PRO",
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  },
});