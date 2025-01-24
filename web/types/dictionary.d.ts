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
        // resultsFound: ReactNode;
        title: string;
        filters: {
            title: string;
            category: string;
            type: string;
            year: string;
            language: string;
            apply: string;
            clear: string;
            searchPlaceholder: string;
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
            relatedResources: string;
        };
        types: {
            book: string;
            paper: string;
            article: string;
            thesis: string;
        };
        noResults: string;
        loading: string;
        error: string;
    };
}