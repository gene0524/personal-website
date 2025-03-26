export interface ContactInfo {
  email?: string;
  phone?: string;
  location?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export const contactInfo: ContactInfo = {
  email: 'gene-yu-tw@gmail.com',
  phone: '+44 7904 548 316',
  location: 'London, UK',
  socialLinks: {
    github: 'https://github.com/gene0524',
    linkedin: 'https://www.linkedin.com/in/gene-yu-tw/',
    instagram: 'https://www.instagram.com/gene_0524_',
  },
}; 