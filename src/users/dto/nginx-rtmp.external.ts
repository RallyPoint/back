
export interface NginxRtmpExternal {
    action: string;
    client_id: number;
    ip: string;
    vhost: string;
    app: string;
    tcUrl: string;
    stream: string;
    param: string;
}

export interface INginxRtmpRecordNotification {
    action: string;
    client_id: number;
    ip: string;
    vhost: string;
    app: string;
    stream: string;
    param: string;
    cwd: string;
    file: string;
}
