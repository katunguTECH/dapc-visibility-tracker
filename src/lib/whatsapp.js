// src/lib/whatsapp.js

/**
 * Send a WhatsApp message using the official WhatsApp Cloud API
 */

export async function sendWhatsAppMessage(phoneNumber, message) {
  // Validate phone number
  if (!phoneNumber) {
    throw new Error('Phone number is required');
  }

  // Clean the phone number (remove spaces, dashes, etc.)
  const cleanedNumber = phoneNumber.replace(/[\s\-()]/g, '');
  
  // Ensure the number has the country code (default to Kenya +254 if not present)
  let formattedNumber = cleanedNumber;
  if (!cleanedNumber.startsWith('+')) {
    // If it starts with 0, replace with +254 (Kenya)
    if (cleanedNumber.startsWith('0')) {
      formattedNumber = '+254' + cleanedNumber.substring(1);
    } else {
      // Assume it's already a valid number without +
      formattedNumber = '+' + cleanedNumber;
    }
  }

  // Get the phone number ID and access token from environment variables
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    throw new Error('WhatsApp credentials are not configured. Please set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN.');
  }

  // Prepare the API request
  const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;

  const requestBody = {
    messaging_product: 'whatsapp',
    to: formattedNumber,
    type: 'text',
    text: {
      body: message
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('WhatsApp API Error:', data);
      throw new Error(data.error?.message || 'Failed to send WhatsApp message');
    }

    return {
      success: true,
      messageId: data.messages?.[0]?.id,
      data: data
    };
  } catch (error) {
    console.error('WhatsApp send error:', error);
    throw error;
  }
}

/**
 * Format a personalized message for a lead
 */
export function formatWhatsAppMessage(lead) {
  return `Hello ${lead.name || 'there'}! 👋

Thank you for being a valued business partner. This is a message from DAPC Visibility Tracker.

We're here to help you grow your business. If you have any questions or need assistance, feel free to reach out.

Best regards,
DAPC Team`;
}