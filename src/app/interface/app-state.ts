import { DataState } from "../enum/data-state.enum";

/**
 * 
 * @author Syed Osama Hassan
 */
export interface AppState<T>{
    dataState: DataState;
    appData?: T;
    error?: string;
}