import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {FileInput, UploadFile, UploadOutput, UploadStatus} from './interface';

export function humanizeBytes(bytes: number): string {
    if (bytes === 0) {
        return '0 Byte';
    }
    const k = 1024;
    const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i: number = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

@Injectable()
export class FileUploadService {
    constructor() {
    }

    upload(input: FileInput): Observable<UploadOutput> {
        return new Observable(observer => {
            const xhr = new XMLHttpRequest();
            const file: UploadFile = this.makeUploadFile(input.files[0], 0);
            // console.log(input);
            // return;
            const method = input.method || 'POST';
            const time: number = new Date().getTime();
            let progressStartTime: number = (file.progress.data && file.progress.data.startTime) || time;
            let speed = 0;
            let eta: number | null = null;

            xhr.upload.addEventListener('progress', (e: ProgressEvent) => {
                if (e.lengthComputable) {
                    const percentage = Math.round((e.loaded * 100) / e.total);
                    const diff = new Date().getTime() - time;
                    speed = Math.round(e.loaded / diff * 1000);
                    progressStartTime = (file.progress.data && file.progress.data.startTime) || new Date().getTime();
                    eta = Math.ceil((e.total - e.loaded) / speed);

                    file.progress = {
                        status: UploadStatus.Uploading,
                        data: {
                            percentage: percentage,
                            speed: speed,
                            speedHuman: `${humanizeBytes(speed)}/s`,
                            startTime: progressStartTime,
                            endTime: null,
                            eta: eta,
                            etaHuman: this.secondsToHuman(eta)
                        }
                    };

                    observer.next({type: 'uploading', file: file});
                }
            }, false);

            xhr.upload.addEventListener('error', (e: Event) => {
                observer.error(e);
                observer.complete();
            });

            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    const speedAverage = Math.round(file.size / (new Date().getTime() - progressStartTime) * 1000);
                    file.progress = {
                        status: UploadStatus.Done,
                        data: {
                            percentage: 100,
                            speed: speedAverage,
                            speedHuman: `${humanizeBytes(speedAverage)}/s`,
                            startTime: progressStartTime,
                            endTime: new Date().getTime(),
                            eta: eta,
                            etaHuman: this.secondsToHuman(eta || 0)
                        }
                    };

                    file.responseStatus = xhr.status;

                    try {
                        file.response = JSON.parse(xhr.response);
                    } catch (e) {
                        file.response = xhr.response;
                    }
                    // console.log(file)
                    observer.next({type: 'done', file: file, status:file.response});

                    observer.complete();
                }
            };
            xhr.open(method, input.url, true);
            xhr.withCredentials = input.withCredentials;

            try {
                if (input.data) {
                    Object.keys(input.data).forEach(key => {
                        file.form.append(key, input.data[key]);
                    });
                }
                Object.keys(input.headers).forEach(key => {
                    xhr.setRequestHeader(key, input.headers[key]);
                });
                for (let i = 0; i < input.files.length; i++) {
                    if(input.multiple){
                        file.form.append('file[]', input.files[i]);
                    } else {
                        file.form.append('file', input.files[i]);
                    }
                    // console.log(input.files[i]);
                }
                // console.log(file);
                xhr.send(file.form);
            } catch (e) {
                observer.error(e);
                observer.complete();
            }

            return () => {
                xhr.abort();
            };
        });
    }

    private generateId(): string {
        return Math.random().toString(36).substring(3);
    }


    secondsToHuman(sec: number): string {
        return new Date(sec * 1000).toISOString().substr(11, 8);
    }

    private makeUploadFile(file: File, index: number): UploadFile {
        return {
            fileIndex: index,
            id: this.generateId(),
            name: file.name,
            size: file.size,
            type: file.type,
            form: new FormData(),
            progress: {
                status: UploadStatus.Queue,
                data: {
                    percentage: 0,
                    speed: 0,
                    speedHuman: `${humanizeBytes(0)}/s`,
                    startTime: null,
                    endTime: null,
                    eta: null,
                    etaHuman: null
                }
            },
            // lastModifiedDate: file.lastModifiedDate,
            sub: undefined,
            nativeFile: file
        };
    }

    getPreviews(files: File[], load: EventEmitter<string[]>) {
        const previews = [];
        // console.log(files);
        for (let i = 0; i < files.length; i++) {
            const renderer = new FileReader();
            renderer.onload = (e) => {
                previews.push(renderer.result);
                load.emit(previews);
            };
            renderer.readAsDataURL(files[i]);
        }
    }

    checkFileSize(file, limit){
        let FileSize = file.size / 1024 / 1024;
        if(FileSize > limit) return false;
        return true;
    }



}

