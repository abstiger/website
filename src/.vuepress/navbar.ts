import { navbar } from "vuepress-theme-hope";

export default navbar([
  { text: "工程", icon: "mdi:folder-multiple", link: "/projects/" , children: [
    { text: "概览", icon: "material-symbols:overview-outline", link: "/projects/"},
    { text: "实时流处理", icon: "mdi:database-sync", link: "/projects/krproject/"},
    { text: "玩极客家居", icon: "mdi:home-automation", link: "/projects/homelab/"},
  ]},
  // { text: "书籍", icon: "mdi:book-open-variant", link: "/books/" , children: [
  //   { text: "概览", icon: "material-symbols:overview-outline", link: "/books/"},
  //   { text: "计算机基础", icon: "mdi:computer", link: "/books/jsjjc/"},
  // ]},
  { text: "博客", icon: "mdi:blog", link: "/blog/" },
  { text: "关于", icon: "mdi:about", link: "/about" },
]);
