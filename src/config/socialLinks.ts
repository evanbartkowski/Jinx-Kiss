/**
 * Social links and author configuration for Jinx Kiss
 * Configure the destination URLs for the footer links below.
 */
export interface SocialLinkConfig {
  name: string;
  url: string;
  icon: 'linkedin' | 'github' | 'email';
}

export interface AuthorConfig {
  displayName: string;
  tagline: string;
  socials: SocialLinkConfig[];
}

export const AUTHOR_CONFIG: AuthorConfig = {
  displayName: 'Evan',
  tagline: 'Created by Evan',
  socials: [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/evanbartkowski', // Configurable LinkedIn profile
      icon: 'linkedin',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/evanbartkowski', // Configurable GitHub profile
      icon: 'github',
    },
    {
      name: 'Email',
      url: 'mailto:evanbartkowski1@gmail.com', // Configurable contact email
      icon: 'email',
    },
  ],
};

