import type { Locale } from '../config/i18n-config'

// Add more languages as needed
const dictionaries = {
    en: () => import('../app/dictionaries/en.json').then(module => module.default),
    ar: () => import('../app/dictionaries/ar.json').then(module => module.default)
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]()