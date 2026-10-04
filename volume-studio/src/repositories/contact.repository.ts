import type { Brief, Inquiry } from "../types/content";
export interface ContactRepository {
  prepare(inquiry: Inquiry): Promise<Brief>;
}
export const contactRepository: ContactRepository = {
  async prepare(inquiry) {
    return {
      filename: "volume-project-brief.txt",
      content: `VOLUME STUDIO / PROJECT BRIEF\n\nNAME: ${inquiry.name}\nEMAIL: ${inquiry.email}\nPROJECT TYPE: ${inquiry.type}\nLOCATION: ${inquiry.location}\nESTIMATED SIZE: ${inquiry.size || "To be discussed"}\n\n${inquiry.message}\n\nPrepared locally. This brief has not been sent.`,
    };
  },
};
