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

export const getAllSuggestionsByAdmin = async (): Promise<ISuggestion[]> => {
    return await Suggestion.find({});
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