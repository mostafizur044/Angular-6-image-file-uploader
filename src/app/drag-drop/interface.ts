import {Subscription} from 'rxjs';


export enum UploadStatus {
    Queue,
    Uploading,
    Done,
    Cancelled
}

export interface FileInput {
    files: File[];
    method: string;
    data?: { [key: string]: string | Blob };
    file_name: string;
    multiple: boolean;
    headers?: { [key: string]: string };
    url: string;
    withCredentials?: boolean;
}

export interface UploadProgress {
    status: UploadStatus;
    data?: {
        percentage: number;
        speed: number;
        speedHuman: string;
        startTime: number | null;
        endTime: number | null;
        eta: number | null;
        etaHuman: string | null;
    };
}

export interface UploadFile {
    id: string;
    fileIndex: number;
    // lastModifiedDate: Date;
    name: string;
    size: number;
    type: string;
    form: FormData;
    progress: UploadProgress;
    response?: any;
    responseStatus?: number;
    sub?: Subscription | any;
    nativeFile?: File;
    responseHeaders?: { [key: string]: string };
}

export interface UploadOutput {
    type: 'addedToQueue' | 'allAddedToQueue' | 'uploading' | 'done' | 'start' | 'cancelled' 
    | 'removed' | 'removedAll' | 'rejected';
    file?: UploadFile;
    nativeFile?: File;
    status?:any
}



