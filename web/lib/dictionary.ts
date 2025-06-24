// lib/dictionary.ts
import { cache } from 'react'
import type { AppDictionary } from '../types/dictionary'

// Define supported locales
export type Locale = 'en' | 'ar'

// Cache dictionary to prevent redundant loads
export const getDictionary = cache(async (locale: string): Promise<AppDictionary> => {
    // Validate locale to ensure it's supported
    const validLocale = ['en', 'ar'].includes(locale) ? locale as Locale : 'en'

    try {
        // Dynamic import for better code splitting
        return (await import(`../app/dictionaries/${validLocale}.json`)).default as AppDictionary
    } catch (error) {
        console.error(`Failed to load dictionary for locale: ${validLocale}`, error)
        // Fallback to English if translation file is missing
        return (await import(`../app/dictionaries/en.json`)).default as AppDictionary
    }
})