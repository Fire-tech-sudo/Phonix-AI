import { isDisposableEmail } from "disposable-email-domains-js";

export const validateEmail = (email) => {
    if (!email) return { valid: false, message: "Email is required" };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, message: "Invalid email format" };
    }

    if (isDisposableEmail(email)) {
        return {
            valid: false,
            message: "Temporary or disposable email addresses are not allowed",
        };
    }

    return { valid: true };
};

export const validatePassword = (password) => {
    if (!password || password.length < 8) {
        return {
            valid: false,
            message: "Password must be at least 8 characters long",
        };
    }
    if (!/[A-Z]/.test(password)) {
        return {
            valid: false,
            message: "Password must contain at least one uppercase letter",
        };
    }
    if (!/[a-z]/.test(password)) {
        return {
            valid: false,
            message: "Password must contain at least one lowercase letter",
        };
    }
    if (!/[0-9]/.test(password)) {
        return {
            valid: false,
            message: "Password must contain at least one number",
        };
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return {
            valid: false,
            message: "Password must contain at least one special character",
        };
    }

    return { valid: true };
};
