const processPayment = async () => {
  let cleanNumber = phoneNumber.replace(/\D/g, "");

  if (cleanNumber.startsWith("0")) {
    cleanNumber = "254" + cleanNumber.substring(1);
  } else if (cleanNumber.startsWith("7") || cleanNumber.startsWith("1")) {
    cleanNumber = "254" + cleanNumber;
  }

  if (cleanNumber.length !== 12) {
    alert("Enter valid number e.g. 0712345678");
    return;
  }

  try {
    const res = await fetch("/api/mpesa/stk-push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber: cleanNumber,
        amount: amount,
        planName: planName,
        userId: "user", // replace later with Clerk ID
      }),
    });

    const data = await res.json();

    console.log("STK RESPONSE:", data);

    if (data.success) {
      alert("STK Push sent. Check your phone.");
      setIsOpen(false);
    } else {
      alert("Payment failed");
    }
  } catch (err) {
    console.error(err);
    alert("Error sending payment");
  }
};