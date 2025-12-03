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
