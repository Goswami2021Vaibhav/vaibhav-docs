// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Vaibhav Docs',
  tagline: 'Everything I learn, organized.',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://Goswami2021Vaibhav.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/vaibhav-docs/',

  // GitHub pages deployment config.
  organizationName: 'Goswami2021Vaibhav', // Usually your GitHub org/user name.
  projectName: 'vaibhav-docs', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/Goswami2021Vaibhav/vaibhav-docs/tree/main/',
        },
        blog: false, // docs-only site, no blog
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      ({
        id: 'interview',
        path: 'docs-interview',
        routeBasePath: 'interview',
        sidebarPath: './sidebarsInterview.js',
        editUrl:
          'https://github.com/Goswami2021Vaibhav/vaibhav-docs/tree/main/',
      }),
    ],
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      // Note: no @type annotation here — the plugin's exported PluginOptions
      // type isn't structurally compatible with Docusaurus's expected
      // DeepPartial<PluginOptions> (missing string index signature), which
      // causes a false-positive ts(2322) error under `@ts-check`.
      ({
        hashed: true,
        language: ['en'],
        docsRouteBasePath: ['docs', 'interview'],
        indexBlog: false,
        indexPages: false,
        highlightSearchTermsOnTargetPage: true,
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Vaibhav Docs',
        logo: {
          alt: 'Vaibhav Docs Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            docsPluginId: 'interview',
            sidebarId: 'interviewSidebar',
            position: 'left',
            label: 'Interview Prep',
          },
          {
            type: 'docSidebar',
            docsPluginId: 'default',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Dev Notes',
          },
          {
            href: 'https://github.com/Goswami2021Vaibhav/vaibhav-docs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
       
        copyright: `Copyright © ${new Date().getFullYear()} Vaibhav Goswami. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;