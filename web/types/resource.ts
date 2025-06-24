export interface Resource {
    id: number;
    title: string;
    authors: string[];
    publication_date: string;
    doi: string;
    abstract: string;
    type: string;
    language: string;
    paid: 'free' | 'premium';
    file_public_id: string;
    category_id: number;
    category_name: string;
    downloads: number;
    download_url: string;
}

export interface ResourceFilters {
    search?: string;
    type?: string;
    category_id?: string;
    language?: string;
    year?: string;
}
export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
}
export interface Category {
    id: number;
    name: string;
    resource_count: number;
}