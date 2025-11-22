import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar";
import sidebar from "./sidebar";

// https://theme-hope.vuejs.press/zh/config/theme/
export default hopeTheme({
  // https://theme-hope.vuejs.press/zh/config/theme/basic.html
  hostname: "https://abstiger.com",
  author: {
    name: "abstiger",
    url: "https://abstiger.com",
  },

  // https://theme-hope.vuejs.press/zh/config/theme/layout.html
  logo: "/avatar.png",
  // repo: "abstiger/website",
  navbar: navbar,
  sidebar: sidebar,
  lastUpdated: false,
  contributors: false,
  footer: "Powered By <a href=https://github.com/vuepress-theme-hope/vuepress-theme-hope>Vuepress Theme Hope</a>",
  displayFooter: true,

  // https://theme-hope.vuejs.press/zh/config/theme/feature.html
  blog: {
    description: "Absolute and Simple~",
    intro: "/about/",
    medias: {
      Email: "mailto:abstiger@qq.com",
      GitHub: "https://github.com/abstiger",
      Rss: "https://abstiger.com/rss.xml",
    },
  },

  // https://theme-hope.vuejs.press/zh/config/markdown/
  markdown: {
    align: true,
    tasklist: true,
    tabs: true,
    codeTabs: true,
    figure: true,
    imgLazyload: true,
    imgMark: true,
    imgSize: true,
    mermaid: true,
  },

  // https://theme-hope.vuejs.press/zh/config/plugins/intro.html
  plugins: {
    icon: {
      assets: "iconify",
    },

    blog: {
      excerpt: true,
    },

    feed: {
      atom: true,
      rss: true,
    },

    comment: {
      provider: "Giscus",
      repo: "abstiger/website",
      repoId: "R_kgDOIgApmA",
      category: "Announcements",
      categoryId: "DIC_kwDOIgApmM4CSwCY",
    },

    slimsearch: {
      indexContent: true,
    },

    watermark: {
      enabled: false,
    },
  },
});
