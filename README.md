# Angular Image File Uploader

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Inputs

`multi`: true/false;  
`width`: image width fore preview (optional);  
`height`: height of image div (optional);  
`url`: Upload url;  
`fileName`: file name by default 'file' - single 'file[]' - multi;  
`info`: sending data with image;  
`accept`: which type of file to upload, ex: image type/excel or csv type;  
`limit`: image/file size limit defualt 2 MB (optional);  

## Output

`upload`: event will call after uploading to get the response

## Note 

There is some extra `Input` for color button. If you use bootstrap, you will find use of those `Input`.
