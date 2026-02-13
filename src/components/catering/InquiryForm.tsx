"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/shared/Button";

interface FormData {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guestCount: string;
  packagePreference: string;
  message: string;
  website: string; // honeypot
}

interface FormErrors {
  name?: string;
  email?: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  eventDate: "",
  guestCount: "",
  packagePreference: "",
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

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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

    return newErrors;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
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

    // Phase 7 will wire the server action. For now, show success.
    setSubmitted(true);
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
            className={`${inputStyles} ${errors.email ? errorInputStyles : ""}`}
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email}</p>
          )}
        </div>

        {/* Row 2: Phone, Event Date */}
        <div>
          <label htmlFor="inquiry-phone" className={labelStyles}>
            Phone
          </label>
          <input
            type="tel"
            id="inquiry-phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
            className={inputStyles}
          />
        </div>

        <div>
          <label htmlFor="inquiry-eventDate" className={labelStyles}>
            Event Date
          </label>
          <input
            type="date"
            id="inquiry-eventDate"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            className={inputStyles}
          />
        </div>

        {/* Row 3: Guest Count, Package Preference */}
        <div>
          <label htmlFor="inquiry-guestCount" className={labelStyles}>
            Guest Count
          </label>
          <input
            type="number"
            id="inquiry-guestCount"
            name="guestCount"
            value={formData.guestCount}
            onChange={handleChange}
            placeholder="Number of guests"
            min={1}
            className={inputStyles}
          />
        </div>

        <div>
          <label htmlFor="inquiry-packagePreference" className={labelStyles}>
            Package Preference
          </label>
          <select
            id="inquiry-packagePreference"
            name="packagePreference"
            value={formData.packagePreference}
            onChange={handleChange}
            className={inputStyles}
          >
            <option value="">Not sure</option>
            <option value="small">Small Gathering</option>
            <option value="medium">Medium Event</option>
            <option value="large">Large Event</option>
          </select>
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

      <div className="mt-6">
        <Button variant="primary" size="lg" type="submit">
          Send Inquiry
        </Button>
      </div>
    </form>
  );
}
