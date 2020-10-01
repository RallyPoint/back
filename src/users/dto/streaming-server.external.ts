
export interface StreamingServerDoneRecordExternal extends StreamingServerExternal{
    recordFile: string;
}
export interface StreamingServerDoneExternal extends StreamingServerExternal{
    publishStreamName: string;
}
export interface StreamingServerAuthExternal extends StreamingServerExternal{
    ip: string;
    publishStreamName: string;
}
export interface StreamingServerPublishExternal extends StreamingServerExternal{
    publishStreamName: string;
}
export interface StreamingServerExternal {
    publishMetaData: StreamingServerAuthentificationDto;
}
export class StreamingServerAuthentificationDto {
    publishStreamPath?:string;
    liveKey?: string;
    pseudo?: string;
    [key: string]: any;
}
