export interface MessageInfo {
    key:              Partial<Key>;
    messageTimestamp: number;
    pushName:         string;
    broadcast:        boolean;
    message:          Message;
}

interface Message {
    extendedTextMessage: ExtendedTextMessage;
    senderKeyDistributionMessage: any;
    messageContextInfo: any;
    stickerMessage: StickerMessage;
}

interface ExtendedTextMessage {
    text: string;
    contextInfo?: ContextInfo;
}

interface ContextInfo{
    mentionedJid: string[];
    expiration: number;
    deviceListMetadata?: any;
}

export interface Key{
    remoteJid: string;
    fromMe: boolean;
    id: string;
    participant?: string;
}

export interface StickerMessage {
    url:               string;
    fileSha256:        string[];
    fileEncSha256:     string[];
    mediaKey:          string[];
    mimetype:          string;
    height:            number;
    width:             number;
    directPath:        string;
    fileLength:        string[];
    mediaKeyTimestamp: string[];
    contextInfo:       string[];
    stickerSentTs:     string[];
}