export interface ModelOption {
    id: string;
    name: string;
    sdkImport: string;
    sdkCall: string;
    packageName: string;
}

export interface Provider {
    name: string;
    models: ModelOption[];
}

export interface ToolOption {
    id: string;
    name: string;
    description: string;
    code: string;
}