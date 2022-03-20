import { Status } from "../enum/status.enum";

/**
 * 
 * @author Syed Osama Hassan
 */
export interface Server{
    id: number;
    ipAddress: string;
    name: string;
    memory: string;
    type: string;
    imageUrl: string;
    status: Status;
}