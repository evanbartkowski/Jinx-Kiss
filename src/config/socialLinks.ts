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
  displayName: 'Evan Bartkowski',
  tagline: 'Created by Evan Bartkowski',
  socials: [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/evan-bartkowski-31274b299',
      icon: 'linkedin',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/evanbartkowski',
      icon: 'github',
    },
    {
      name: 'Email',
      url: 'mailto:evanbartkowski1@gmail.com',
      icon: 'email',
    },
  ],
};
