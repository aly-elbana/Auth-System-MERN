import { mailtrapClient, sender } from "./mailtrap.config.js";
import {
    VERIFICATION_EMAIL_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE
} from "./emailTemplates.js";

// ------------------------------------------------------------------------------------
// 📧 Send Verification Email
// ------------------------------------------------------------------------------------
export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];

    try {
        // Send email using Mailtrap with an HTML template
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        });

        console.log("✅ Verification email sent successfully");
    } catch (error) {
        console.error("❌ Error sending verification email:", error);
        throw new Error("Failed to send verification email");
    }
};

// ------------------------------------------------------------------------------------
// 🎉 Send Welcome Email After Successful Verification
// ------------------------------------------------------------------------------------
export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];

    try {
        // Send templated welcome email using Mailtrap's template UUID
        await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "f57e4007-667c-4d6d-b2a5-732f390e8b39", // Replace with your actual template UUID
            template_variables: {
                company_info_name: "My Company Name", // Customize company name here
                name: name,
            },
        });

        console.log("✅ Welcome email sent successfully");
    } catch (error) {
        console.error("❌ Error sending welcome email:", error);
        throw new Error("Failed to send welcome email");
    }
};

// ------------------------------------------------------------------------------------
// 🔑 Send Password Reset Email
// ------------------------------------------------------------------------------------
export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{ email }];

    try {
        // Send password reset email using HTML template
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset Your Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset"
        });

        console.log("✅ Password reset email sent successfully", response);
    } catch (error) {
        console.error("❌ Error sending password reset email:", error);
        throw new Error("Failed to send password reset email");
    }
};

// ------------------------------------------------------------------------------------
// ✅ Send Password Reset Success Email
// ------------------------------------------------------------------------------------
export const sendPasswordResetSuccessEmail = async (email, name) => {
    const recipient = [{ email }];

    try {
        // Send confirmation email after successful password reset
        await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Success",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset"
        });

        console.log("✅ Password reset success email sent successfully");
    } catch (error) {
        console.error("❌ Error sending password reset success email:", error);
        throw new Error("Failed to send password reset success email");
    }
};
