import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Resource, ResourceFilters, Category } from '@/types/resource';
import { getResources, getCategories } from '@/lib/api';

const ITEMS_PER_PAGE = 15;

export function useResourceFiltering(initialData: {
    data: Resource[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
}, initialFilters: ResourceFilters = {}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [resources, setResources] = useState<Resource[]>(initialData.data);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(initialData.page);
    const [totalPages, setTotalPages] = useState(initialData.totalPages);
    const [filterOptions, setFilterOptions] = useState({
        types: [] as string[],
        years: [] as number[],
        languages: [] as string[],
        categories: [] as Category[],
    });

    // Update URL helper - modified to handle clearing
    const updateUrl = (filters: ResourceFilters, page: number, shouldClear: boolean = false) => {
        if (shouldClear) {
            // Clear all params by pushing just the pathname
            router.push(pathname);
            return;
        }

        const params = new URLSearchParams(searchParams);

        // Clear existing filter params first
        ['search', 'type', 'category_id', 'language', 'year', 'page'].forEach(key => {
            params.delete(key);
        });

        // Add new filter params
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== "all" && value !== "") {
                params.set(key, value.toString());
            }
        });

        // Add page param if needed
        if (page > 1) {
            params.set("page", page.toString());
        }

        // Update URL
        const queryString = params.toString();
        router.push(queryString ? `${pathname}?${queryString}` : pathname);
    };

    // Separate useEffect for categories
    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await getCategories();
            setFilterOptions(prev => ({
                ...prev,
                categories,
            }));
        };

        fetchCategories();
    }, []);

    // Separate useEffect for other filter options
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const response = await getResources({ limit: 1000 });
                const allResources = response.data;

                setFilterOptions(prev => ({
                    ...prev,
                    types: Array.from(new Set(allResources.map(r => r.type))),
                    years: Array.from(new Set(allResources.map(r =>
                        new Date(r.publication_date).getFullYear()
                    ))).sort((a, b) => b - a),
                    languages: Array.from(new Set(allResources.map(r => r.language))),
                }));
            } catch (error) {
                console.error('Error fetching filter options:', error);
            }
        };

        fetchFilterOptions();
    }, []);

    // Handle filtering - modified to reset page
    const handleFilter = async (newFilters: ResourceFilters) => {
        setLoading(true);
        try {
            // Merge new filters with existing filters from URL
            const mergedFilters = { ...initialFilters, ...newFilters };
            
            const response = await getResources({
                ...mergedFilters,
                page: 1,
                limit: ITEMS_PER_PAGE
            });
            setResources(response.data);
            setTotalPages(response.totalPages);
            setCurrentPage(1);
            updateUrl(mergedFilters, 1);
        } catch (error) {
            console.error('Error filtering resources:', error);
            setResources(initialData.data);
        } finally {
            setLoading(false);
        }
    };

    // Handle page change
    const handlePageChange = async (page: number) => {
        setLoading(true);
        try {
            const response = await getResources({
                ...initialFilters,
                page,
                limit: ITEMS_PER_PAGE
            });
            setResources(response.data);
            setCurrentPage(response.page);
            setTotalPages(response.totalPages);
            updateUrl(initialFilters, page);
        } catch (error) {
            console.error('Error changing page:', error);
        } finally {
            setLoading(false);
        }
    };

    // Add clear filters function
    const clearFilters = async () => {
        setLoading(true);
        try {
            const response = await getResources({
                page: 1,
                limit: ITEMS_PER_PAGE
            });
            setResources(response.data);
            setTotalPages(response.totalPages);
            setCurrentPage(1);
            // Clear URL params
            updateUrl({}, 1, true);
        } catch (error) {
            console.error('Error clearing filters:', error);
            setResources(initialData.data);
        } finally {
            setLoading(false);
        }
    };

    return {
        resources,
        loading,
        currentPage,
        totalPages,
        filterOptions,
        handleFilter,
        handlePageChange,
        clearFilters,
    };
} 