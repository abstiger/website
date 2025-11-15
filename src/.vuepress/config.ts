import { defineUserConfig } from "vuepress";
import hopeTheme from "./theme.js";

export default defineUserConfig({
  locales: {
    "/":{
      lang: "zh-CN",
      title: "Tiger's Website",
      description: "Absolute and Simple~",
    }
  },

  theme: hopeTheme,
});
