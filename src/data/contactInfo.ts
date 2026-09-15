import { personalInfo } from './personalInfo';

// Single source of truth lives in personalInfo; this is a thin view for the
// Contact section so it never drifts from the hero / metadata again.
export const contactInfo = {
  email: personalInfo.contact.email,
  location: personalInfo.contact.location,
  socialLinks: personalInfo.social,
};
