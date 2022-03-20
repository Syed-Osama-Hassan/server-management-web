import { Server } from "./server";

/**
 * 
 * @author Syed Osama Hassan
 */
export interface CustomResponse{
    timeStamp: Date;
    statusCode: number;
    status: string;
    reason: string;
    message: string;
    developerMessage: string;
    data: { servers?: Server[], server?: Server}
}