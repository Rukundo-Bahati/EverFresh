import en from "./en";
import rw from "./rw";

let currentLang: "en" | "rw" = "en";

export const t = (key: keyof typeof en) => {
    return currentLang === "en" ? en[key] : rw[key];
};

export const setLang = (lang: "en" | "rw") => {
    currentLang = lang;
};
