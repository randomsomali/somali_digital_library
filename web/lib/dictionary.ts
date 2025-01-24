import type { Locale } from '../config/i18n-config'

// Add more languages as needed
const dictionaries = {
    en: () => import('../app/dictionaries/en.json').then(module => module.default),
    ar: () => import('../app/dictionaries/ar.json').then(module => module.default)
}
export interface ResourceType {
    id: number;
    title: string;
    authors: string;
    abstract: string;
    publication_date: string;
    category_id: number;
    category_name: string;
    type: string;
    file_url: string;
    downloads: number;
    citations: number;
    keywords: string[];
    doi?: string;
    language: string;
    publisher: string;
    pages?: number;
    year_of_publication: number;
}
export const getDictionary = async (locale: Locale) => dictionaries[locale]()