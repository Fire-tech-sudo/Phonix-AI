// Koi import nahi chahiye! Node 18+ me fetch built-in hota hai.

const sendOtpEmail = async (email, otp) => {
  const url = "https://api.brevo.com/v3/smtp/email";

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      // Ab hamari full key yahan securely pass hogi bina spaces ke
      "api-key": process.env.BREVO_API_KEY.trim(),
    },
    body: JSON.stringify({
      sender: {
        name: "Pixora AI",
        email: process.env.EMAIL_USER.trim(),
      },
      to: [{ email: email }],
      subject: "Your Registration OTP",
      htmlContent: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2>Welcome to Pixora AI!</h2>
                    <p>Your one-time password (OTP) for registration is:</p>
                    <h1 style="color: #4f46e5; letter-spacing: 5px;">${otp}</h1>
                    <p>This code is valid for 5 minutes. Do not share it with anyone.</p>
                </div>
            `,
    }),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      // Agar API key ya email me abhi bhi koi minor error hogi, toh ye exactly bata dega
      const errorData = await response.json();
      console.error("Brevo API Direct Error:", errorData);
      throw new Error(`Brevo Error: ${errorData.message}`);
    }

    console.log("🔥 Email sent successfully via Direct Fetch API!");
    return true;
  } catch (error) {
    console.error("Email Sending Failed:", error);
    throw error;
  }
};

export default sendOtpEmail;
