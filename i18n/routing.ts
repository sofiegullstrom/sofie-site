import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["sv", "en"],
  defaultLocale: "en",
  localeDetection: false,   // always start in English; user switches manually
});
