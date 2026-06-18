import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Media distribution, press releases, and newsroom reach',
      description: 'Distribute media updates, press releases, campaign stories, and public announcements through a focused media distribution platform.',
      openGraphTitle: 'Media distribution, press releases, and newsroom reach',
      openGraphDescription: 'Discover media distribution posts, coverage updates, brand announcements, and press-ready stories.',
      keywords: ['media distribution', 'press release distribution', 'newsroom updates', 'brand announcements'],
    },
    hero: {
      badge: 'Media distribution network',
      title: ['Distribute stories', 'with newsroom precision'],
      description: 'Plan, publish, and route media updates with clean editorial packaging, searchable archives, and campaign-ready content built for reach.',
      primaryCta: { label: 'Browse media posts', href: '/updates' },
      secondaryCta: { label: 'Create distribution', href: '/create' },
      searchPlaceholder: 'Search releases, coverage, campaigns, and announcements',
      focusLabel: 'Distribution lanes',
      featureCardBadge: 'active campaign desk',
      featureCardTitle: 'Every published update becomes part of a structured media archive.',
      featureCardDescription: 'Headlines, summaries, source details, and campaign notes stay easy to scan across every page.',
    },
    intro: {
      badge: 'Distribution workflow',
      title: 'Built for announcements that need clarity before reach.',
      paragraphs: [
        'Media distribution works best when the message, context, and next step are clear. This site keeps releases, brand updates, and coverage notes organized around a focused reading flow.',
        'Editors, partners, and visitors can scan active campaigns, open detailed releases, and search the archive without wading through unrelated content.',
        'The layout favors strong headlines, useful summaries, and a calm route from discovery to action.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Text-first media cards for fast scanning.',
        'Real feed posts across archive and search pages.',
        'Focused distribution detail pages without extra date or overview labels.',
        'Authenticated publishing access with account-aware navigation.',
      ],
      primaryLink: { label: 'Browse distribution', href: '/media-distribution' },
      secondaryLink: { label: 'Start a release', href: '/create' },
    },
    cta: {
      badge: 'Start distribution',
      title: 'Turn announcements into organized media momentum.',
      description: 'Package releases, campaign updates, and public notices in one searchable distribution experience.',
      primaryCta: { label: 'Create media post', href: '/create' },
      secondaryCta: { label: 'Contact desk', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest media distribution posts in this section.',
    },
  },
  about: {
    badge: 'Distribution desk',
    title: 'A focused platform for media distribution work.',
    description: `${slot4BrandConfig.siteName} helps teams present announcements, campaign updates, and media stories with the structure needed for public discovery.`,
    paragraphs: [
      'The platform is designed for the practical side of media distribution: clear story packaging, fast archive browsing, and credible detail pages that do not bury the message.',
      'Instead of treating every post like a generic article, the experience gives every release room for a headline, summary, source context, and follow-up action.',
      'The result is a calmer distribution surface where visitors can understand what was published, why it matters, and where to go next.',
    ],
    values: [
      {
        title: 'Press-ready clarity',
        description: 'Every layout is shaped around scan-friendly titles, concise summaries, and direct calls to action.',
      },
      {
        title: 'Campaign continuity',
        description: 'Archive, search, and detail pages use the same visual language so distributed stories feel connected.',
      },
      {
        title: 'Operational trust',
        description: 'The interface keeps publishing access, contact paths, and post discovery visible without adding noise.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Get in touch with the media distribution desk.',
    description: 'Share the release, campaign, correction, or partnership request you want routed. We will help package the message and point it toward the right audience.',
    formTitle: 'Send a media request',
  },

  search: {
    metadata: {
      title: 'Search media distribution',
      description: 'Search releases, campaign stories, source updates, and media distribution posts across the site.',
    },
    hero: {
      badge: 'Search the media archive',
      title: 'Find releases, campaigns, and coverage notes faster.',
      description: 'Use keywords, categories, or content types to locate real published posts across the active media distribution feed.',
      placeholder: 'Search by release, source, campaign, or topic',
    },
    resultsTitle: 'Latest media distribution content',
  },
  create: {
    metadata: {
      title: 'Create media distribution post',
      description: 'Create and submit media distribution content for the site.',
    },
    locked: {
      badge: 'Distribution access',
      title: 'Login to open the media publishing desk.',
      description: 'Use your account to prepare releases, campaign posts, public notices, and media updates for the active sections of this site.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create a media distribution post.',
      description: 'Choose the distribution type, add source details, and prepare a clean post with headline, summary, links, image, and body content.',
    },
    formTitle: 'Release details',
    submitLabel: 'Submit media post',
    successTitle: 'Media distribution post saved successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for media distribution publishing access.',
      badge: 'Member access',
      title: 'Welcome back to the distribution desk.',
      description: 'Login to manage submissions, prepare media posts, and continue publishing from your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for media distribution publishing access.',
      badge: 'Distribution access',
      title: 'Create your account and start publishing media updates.',
      description: 'Create an account to access the publishing workspace, save release details, and submit media distribution content through the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested articles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit Official Site',
    },
  },
} as const
