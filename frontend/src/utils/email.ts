import emailjs from "emailjs-com";

export const sendLowBalanceEmail = (
  to_email: string,
  username: string,
  balance: number
) => {
  const templateParams = {
    to_email,
    username,
    balance,
  };

  emailjs
     .send(
      "service_vilmide",        // Your EmailJS Service ID
      "template_aa3su32",      // Your EmailJS Template ID
      templateParams,
      "zLQhEGhZiHRhJpmAi"    // Your EmailJS Public Key
    )
    .then(
      (res) => {
        console.log("📧 Email sent:", res.status, res.text);
      },
      (err) => {
        console.error("❌ Email failed:", err);
      }
    );
};
