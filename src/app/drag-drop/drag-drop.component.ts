import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploadService } from './file-upload.service';
import { UploadOutput } from './interface';

@Component({
  selector: 'drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.css']
})
export class DragDropComponent implements OnInit {

  filesToUpload: Array<any> = [];
  imagePreview:Array<any>= [];
  domRemove = null;
  domHover = null;
  drop = null;
  loader = null;
  output: UploadOutput;
  filesPreview: any[] = [];

  @Input('multi') multi:boolean; // true = multi image false = single image
  @Input('width') width:number; // preview width optional
  @Input('height') height:number; // preview height optional
  @Input('url') url:string; // upload url
  @Input('fileName') fileName:string; // file name by default 'file' - single 'file[]' - multi
  @Input('info') data:any; // data to send with files optional
  @Input('accept') accept:any; // accept files
  @Input('limit') limit:any;
  @Input('class') botClass: any;
  @Input('uploadBtn') uBtn:string; //  optional
  @Input('resetBtn') rBtn:string; //  optional
  @Input('resetOff') resetOff:string; //  optional
  @Output('upload') upload:EventEmitter<any> = new EventEmitter(); // triger upload method to show alert

  
  constructor(
    private fServ: FileUploadService
  ){}

  ngOnInit() {}
 
  inputFile(f){
    let fileList = f.target.files;
    if(fileList){
      if(this.multi){
        this.multiFile(fileList);
      } else { 
        this.clear();
        this.imageView(fileList[0]);
      }
    }
    f.target.value = '';
  }

  multiFile(file){
    for(let i of file){
      this.imageView(i);
    }
  }

  imageView(i){ 
    let size = this.fServ.checkFileSize(i, this.limit || 2);
    if(size) {
      this.filesToUpload.push(i);
      if(this.checkImage()) {
        let reader = new FileReader();
        reader.onload =  (e)=>{
          this.imagePreview.push(reader.result);
        };
        reader.readAsDataURL(i);
      } else {
        let obj = {};
        obj['name'] = i.name;
        obj['size'] = Math.round((i.size / 1024) * 100) / 100;
        this.filesPreview.push(obj);
      }
    } else {
      // message for size checking
    }
  }

  checkImage() {
    return this.accept ? this.accept.includes('image') : true;
  }

  // clear all preview
  clear() {
    this.filesToUpload = [];
    this.imagePreview = [];
    this.filesPreview = [];
    this.loader = null;
  }

  // remove single image
  removeFile(i){
    this.filesToUpload.splice(i,1);
    this.imagePreview.splice(i,1);
    this.filesPreview.splice(i,1);
  }

  uploadFile () {
    this.loader = true;
  //  console.log(this.filesToUpload)
    if(this.filesToUpload && this.filesToUpload.length>0){
      this.fServ.upload({
        files: this.filesToUpload,
        multiple: this.multi,
        file_name: this.fileName,
        method: 'POST',
        headers: {Authorization: 'Bearer '}, // Add your token 
        url: this.url,
        data: this.data
      }).subscribe(res => {
          this.output = res;
          // console.log(res);
          if (this.output.type === 'done') {
              if (this.output.status.status === 'OK') {
                  this.upload.emit(this.output);
                  this.clear();
                  this.output = null;
              } else {
                //'Sorry!!! Failed to upload. Please try again.'
                this.output = null;
                this.loader = null;
              }
          }
        },
        error => {
          //'Sorry!!! Failed to upload. Please try again.'
          this.output = null;
          this.loader = null;
        }
      ); 
    }
  }

  // button color

  uploadBtn(){
    return this.uBtn? this.uBtn:'btn-primary';
  }

  resetBtn(){
    return this.rBtn? this.rBtn:'btn-danger';
  }

  widtClass() {
    return this.botClass? this.botClass:'col-sm-6';
  }

}
