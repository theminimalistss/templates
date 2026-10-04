import {
  contactRepository,
  type ContactRepository,
} from "../repositories/contact.repository";
import { projectTypes } from "../constants/inquiry";
import type { Inquiry, InquiryErrors } from "../types/content";
export function validateInquiry(input: Inquiry): InquiryErrors {
  const errors: InquiryErrors = {};
  if (input.name.trim().length < 2 || input.name.length > 100)
    errors.name = "Enter your name (2–100 characters).";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()) ||
    input.email.length > 254
  )
    errors.email = "Enter a valid email address.";
  if (!projectTypes.some((type) => type === input.type))
    errors.type = "Choose a project type.";
  if (input.location.trim().length < 2 || input.location.length > 150)
    errors.location = "Enter a project location (2–150 characters).";
  if (
    input.size &&
    (!/^\d+(\.\d+)?$/.test(input.size) ||
      Number(input.size) <= 0 ||
      Number(input.size) > 1000000)
  )
    errors.size = "Enter an area between 1 and 1,000,000 sqm.";
  if (input.message.trim().length < 10 || input.message.length > 3000)
    errors.message =
      "Tell us a little about your project (10–3,000 characters).";
  return errors;
}
export async function prepareInquiry(
  input: Inquiry,
  repository: ContactRepository = contactRepository,
) {
  const errors = validateInquiry(input);
  if (Object.keys(errors).length) return { ok: false as const, errors };
  const clean = Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, value.trim()]),
  ) as unknown as Inquiry;
  const brief = await repository.prepare(clean);
  return { ok: true as const, brief };
}
