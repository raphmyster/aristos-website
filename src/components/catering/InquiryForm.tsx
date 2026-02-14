"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/shared/Button";
import { sendCateringInquiry } from "@/actions/sendCateringInquiry";
import { Loader2 } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guestCount: string;
  message: string;
  website: string; // honeypot
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  eventDate?: string;
  guestCount?: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  eventDate: "",
  guestCount: "",
  message: "",
  website: "",
};

const inputStyles =
  "bg-muted border-[1.5px] border-border rounded-md py-3 px-4 text-base font-body w-full placeholder:text-secondary transition-colors focus:border-primary focus:ring-[3px] focus:ring-primary/10 focus:outline-none";

const errorInputStyles = "border-destructive";

const labelStyles = "block text-sm font-medium text-foreground mb-1.5";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function InquiryForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear server error when user starts typing
    if (serverError) {
      setServerError(null);
    }

    // Clear error for this field when the user starts typing
    if (name in errors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof FormErrors];
        return next;
      });
    }
  }

  function validate(): FormErrors {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (!formData.eventDate.trim()) {
      newErrors.eventDate = "Event date is required.";
    }

    if (!formData.guestCount.trim()) {
      newErrors.guestCount = "Guest count is required.";
    }

    return newErrors;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Honeypot check — if filled in, silently "succeed"
    if (formData.website) {
      setSubmitted(true);
      return;
    }

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    const result = await sendCateringInquiry(formData);

    setSubmitting(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      setServerError(result.error ?? "Something went wrong.");
    }
  }

  if (submitted) {
    return (
      <div className="bg-[#ECFDF5] border border-[#065F46]/20 rounded-md p-4 text-[#065F46] text-sm">
        Thank you for your inquiry. We&apos;ll be in touch soon.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Row 1: Name, Email */}
        <div>
          <label htmlFor="inquiry-name" className={labelStyles}>
            Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="inquiry-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            disabled={submitting}
            className={`${inputStyles} ${errors.name ? errorInputStyles : ""}`}
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="inquiry-email" className={labelStyles}>
            Email <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            id="inquiry-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            disabled={submitting}
            className={`${inputStyles} ${errors.email ? errorInputStyles : ""}`}
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email}</p>
          )}
        </div>

        {/* Row 2: Phone, Event Date */}
        <div>
          <label htmlFor="inquiry-phone" className={labelStyles}>
            Phone <span className="text-destructive">*</span>
          </label>
          <input
            type="tel"
            id="inquiry-phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
            disabled={submitting}
            className={`${inputStyles} ${errors.phone ? errorInputStyles : ""}`}
          />
          {errors.phone && (
            <p className="text-sm text-destructive mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label htmlFor="inquiry-eventDate" className={labelStyles}>
            Event Date <span className="text-destructive">*</span>
          </label>
          <input
            type="date"
            id="inquiry-eventDate"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            disabled={submitting}
            className={`${inputStyles} ${errors.eventDate ? errorInputStyles : ""}`}
          />
          {errors.eventDate && (
            <p className="text-sm text-destructive mt-1">{errors.eventDate}</p>
          )}
        </div>

        {/* Row 3: Guest Count */}
        <div>
          <label htmlFor="inquiry-guestCount" className={labelStyles}>
            Guest Count <span className="text-destructive">*</span>
          </label>
          <input
            type="number"
            id="inquiry-guestCount"
            name="guestCount"
            value={formData.guestCount}
            onChange={handleChange}
            placeholder="Number of guests"
            min={1}
            disabled={submitting}
            className={`${inputStyles} ${errors.guestCount ? errorInputStyles : ""}`}
          />
          {errors.guestCount && (
            <p className="text-sm text-destructive mt-1">{errors.guestCount}</p>
          )}
        </div>

        {/* Message — full width within the grid */}
        <div className="md:col-span-2">
          <label htmlFor="inquiry-message" className={labelStyles}>
            Message
          </label>
          <textarea
            id="inquiry-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            placeholder="Tell us about your event..."
            disabled={submitting}
            className={inputStyles}
          />
        </div>
      </div>

      {/* Honeypot field — hidden from real users */}
      <input
        type="text"
        name="website"
        value={formData.website}
        onChange={handleChange}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {serverError && (
        <div className="mt-4 bg-destructive/10 border border-destructive/20 rounded-md p-3 text-destructive text-sm">
          {serverError}
        </div>
      )}

      <div className="mt-6">
        <Button variant="primary" size="lg" type="submit" disabled={submitting}>
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Sending...
            </span>
          ) : (
            "Send Inquiry"
          )}
        </Button>
      </div>
    </form>
  );
}
