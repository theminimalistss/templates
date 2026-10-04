import { useState } from "react";
import { emptyInquiry } from "../constants/inquiry";
import { prepareInquiry } from "../services/contact.service";
import type { Brief, Inquiry, InquiryErrors } from "../types/content";
export function useContact() {
  const [values, setValues] = useState<Inquiry>(emptyInquiry);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [brief, setBrief] = useState<Brief | null>(null);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  const change = (key: keyof Inquiry, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setBrief(null);
  };
  const submit = async () => {
    setBusy(true);
    setFailure("");
    try {
      const result = await prepareInquiry(values);
      if (result.ok) {
        setBrief(result.brief);
        setErrors({});
        return true;
      }
      setErrors(result.errors);
      return false;
    } catch {
      setFailure("Your brief could not be prepared. Please try again.");
      return false;
    } finally {
      setBusy(false);
    }
  };
  const download = () => {
    if (!brief) return;
    const url = URL.createObjectURL(
      new Blob([brief.content], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = brief.filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return { values, errors, brief, busy, failure, change, submit, download };
}
