// types/dictionary.d.ts
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
export interface AppDictionary {
    navigation: {
        home: string;
        resources: string;
        menuTitle: string; // Add this line
        categories: {
            educational: string;
            scientific: string;
            literature: string;
        };
        library: {
            title: string;
            books: string;
            research: string;
            articles: string;
        };
        about: string;
        contact: string;
    };
    auth: {
        login: string;
        signup: string;
        profile: string;
        username: string;
        password: string;
        phone: string;
        logout: string;
        loginSuccess: string;
        registerSuccess: string;
        invalidCredentials: string;
        userNotFound: string;
        usernameExists: string;
    };

    common: {
        logo: string;
        search: string;
        language: string;
        theme: string;
    };
    home: {
        hero: {
            title: string;
            description: string;
            explore: string;
            learnMore: string;
        };
        stats: {
            books: string;
            journals: string;
            articles: string;
            users: string;
        };
        categories: {
            title: string;
            description: string;
        };
    };
    categories: {
        title: string;
        description: string;
        academic: {
            title: string;
            description: string;
        };
        research: {
            title: string;
            description: string;
        };
        literature: {
            title: string;
            description: string;
        };
    };
    search: {
        title: string;
        description: string;
        placeholder: string;
        categoryPlaceholder: string;
        categories: {
            all: string;
            books: string;
            articles: string;
            journals: string;
        };
        button: string;
    };
    footer: {
        about: {
            title: string;
            description: string;
        };
        quickLinks: {
            title: string;
            links: Array<{
                label: string;
                href: string;
            }>;
        };
        resources: {
            title: string;
            links: Array<{
                label: string;
                href: string;
            }>;
        };
        newsletter: {
            title: string;
            description: string;
            placeholder: string;
            button: string;
        };
        copyright: string;
    };
    auth: {
        login: string;
    };
    resources: {
        title: string;
        description: string;
        resultsCount: string;

        filters: {
            title: string;
            subtitle: string;
            category: string;
            type: string;
            year: string;
            language: string;
            apply: string;
            clear: string;
            searchPlaceholder: string;
            allTypes: string;
            allYears: string;
            allLanguages: string;
            allCategories: string;
        };
        details: {
            abstract: string;
            authors: string;
            published: string;
            category: string;
            type: string;
            downloads: string;
            citations: string;
            keywords: string;
            doi: string;
            publisher: string;
            pages: string;
            download: string;
            cite: string;
            share: string;
            view: string;
            relatedResources: string;
        };
        types: {
            Thesis: string;
            Journal: string;
            Book: string;
            Article: string;
            Report: string;
            Other: string;
        };
        premium: string;
        free: string;
        noResults: string;
        loading: string;
        error: string;
        retry: string;
        backToList: string;
        notFound: {
            title: string;
            description: string;
        };
    };
}