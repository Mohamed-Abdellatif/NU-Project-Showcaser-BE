import { ISuggestion, Suggestion } from '../models/suggestionModel';

export const createSuggestion = async (suggestionObj: Partial<ISuggestion>): Promise<ISuggestion> => {
    const newSuggestion = new Suggestion(suggestionObj);
    return await newSuggestion.save();
};

export const getAllSuggestions = async (): Promise<ISuggestion[]> => {
    return await Suggestion.find();
};

export const getSuggestionById = async (id: string): Promise<ISuggestion | null> => {
    return await Suggestion.findById(id);
};

export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface SuggestionAdminFilters {
    title?: string;
    description?: string;
}

export const getAllSuggestionsByAdmin = async (
    page: number = 1,
    limit: number = 10,
    filters?: SuggestionAdminFilters
): Promise<PaginatedResult<ISuggestion>> => {
    const skip = (page - 1) * limit;

    // Build filter query
    const filterQuery: Record<string, unknown> = {};

    if (filters?.title) {
        filterQuery.title = { $regex: filters.title, $options: "i" };
    }
    if (filters?.description) {
        filterQuery.description = { $regex: filters.description, $options: "i" };
    }

    const [data, total] = await Promise.all([
        Suggestion.find(filterQuery).sort({ _id: -1 }).skip(skip).limit(limit),
        Suggestion.countDocuments(filterQuery),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages,
        },
    };
};

export const getSuggestionByAdmin = async (id: string): Promise<ISuggestion | null> => {
    return await Suggestion.findById(id);
};

export const editSuggestionByAdmin = async (
    suggestionId: string,
    suggestionData: Partial<ISuggestion>
): Promise<ISuggestion | null> => {
    return await Suggestion.findByIdAndUpdate(suggestionId, suggestionData, { new: true });
};

export const deleteSuggestionByAdmin = async (suggestionId: string): Promise<ISuggestion | null> => {
    return await Suggestion.findByIdAndDelete(suggestionId);
};