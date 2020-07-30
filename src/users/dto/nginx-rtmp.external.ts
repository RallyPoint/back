
export interface NginxRtmpExternal {
    app: string;
    flashver: string;
    swfurl: string;
    tcurl: string;
    pageurl: string;
    addr: string;
    clientid: string;
    call: string;
    name: string;
    psk: string;
}

export interface INginxRtmpRecordNotification {
    app:  string;
    flashver:  string;
    swfurl: string;
    tcurl:  string;
    pageurl:  string;
    addr:  string;
    clientid:  string;
    call:  string;
    recorder:  string;
    name:  string;
    path:  string;
}
