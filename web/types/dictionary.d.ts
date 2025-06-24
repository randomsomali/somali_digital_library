// types/dictionary.d.ts

export interface AppDictionary {
    navigation: {
        home: string;
        resources: string;
        menuTitle: string;
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
        blog: string;
        create: string;
        joinCommunity: string;
    };
    auth: {
        login: string;
        signup: string;
        register: string;
        profile: string;
        username: string;
        email: string;
        name: string;
        password: string;
        phone: string;
        logout: string;
        loginSuccess: string;
        registerSuccess: string;
        invalidCredentials: string;
        userNotFound: string;
        usernameExists: string;
        emailExists: string;
        welcomeBack: string;
        createAccount: string;
        loginWithEmail: string;
        loginWithApple: string;
        loginWithGoogle: string;
        orContinueWith: string;
        forgotPassword: string;
        dontHaveAccount: string;
        alreadyHaveAccount: string;
        termsOfService: string;
        privacyPolicy: string;
        byContinuing: string;
        agreeTo: string;
        and: string;
        tabs: {
            user: string;
            student: string;
            institution: string;
        };
        institution: {
            select: string;
            placeholder: string;
            required: string;
        };
        form: {
            name: string;
            email: string;
            password: string;
            confirmPassword: string;
            institution: string;
            submit: string;
            loading: string;
        };
        errors: {
            required: string;
            invalidEmail: string;
            passwordTooShort: string;
            passwordTooLong: string;
            nameTooLong: string;
            emailTooLong: string;
            passwordsDontMatch: string;
            selectInstitution: string;
        };
    };

    common: {
        logo: string;
        search: string;
        language: string;
        theme: string;
        joinCommunity: string;
        create: string;
    };
    home: {
        hero: {
            announcement: string;
            title: string;
            subtitle: string;
            description: string;
            searchPlaceholder: string;
            explore: string;
            learnMore: string;
            joinCommunity: string;
            features: {
                design: {
                    title: string;
                    description: string;
                    action: string;
                };
                github: {
                    title: string;
                    description: string;
                    action: string;
                };
                community: {
                    title: string;
                    description: string;
                    action: string;
                };
            };
        };
        stats: {
            title: string;
            description: string;
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
    about: {
        hero: {
            badge: string;
            title: string;
            subtitle: string;
            description: string;
            exploreLibrary: string;
            joinUs: string;
        };
        stats: {
            title: string;
            description: string;
            books: string;
            booksDesc: string;
            users: string;
            usersDesc: string;
            institutions: string;
            institutionsDesc: string;
            years: string;
            yearsDesc: string;
        };
        mission: {
            badge: string;
            title: string;
            description: string;
            goals: string[];
        };
        vision: {
            title: string;
            description: string;
            pillars: string[];
        };
        values: {
            title: string;
            description: string;
            preservation: {
                title: string;
                description: string;
            };
            community: {
                title: string;
                description: string;
            };
            innovation: {
                title: string;
                description: string;
            };
            accessibility: {
                title: string;
                description: string;
            };
        };
        features: {
            title: string;
            description: string;
            digitalLibrary: {
                title: string;
                description: string;
            };
            educational: {
                title: string;
                description: string;
            };
            global: {
                title: string;
                description: string;
            };
        };
        cta: {
            title: string;
            description: string;
            joinNow: string;
            exploreLibrary: string;
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
    dashboard: {
        welcome: string;
        manageAccount: string;
        accountInfo: string;
        myResources: string;
        profileSettings: string;
        accessResources: string;
        updateProfile: string;
        viewResources: string;
        editProfile: string;
        comingSoon: string;
        personalizedDashboard: string;
        institutionDashboard: string;
        institutionPortal: string;
        totalStudents: string;
        activeSubscriptions: string;
        resourcesAccessed: string;
        engagementRate: string;
        institutionInfo: string;
        quickActions: string;
        manageStudents: string;
        viewReports: string;
        updateInstitutionInfo: string;
        institutionFeatures: string;
    };
}