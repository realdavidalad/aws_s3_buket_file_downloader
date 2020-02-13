//import express from "express";
const express=require("express");
const app = express();
//to serialize/extract data from request session
const body_parser=require("body-parser");
const url=require("url");
const querystring=require("querystring");
const morgan=require("morgan");
//aws sdk for interacting with aws plaform programmatically.
const AWS = require('aws-sdk');
//to access file system
const fs = require('fs');
const path =require("path");



//initailizations
app.use(morgan("dev"));
//parse url encoded data to req.body object as properties.
app.use(body_parser.urlencoded({ extended: false }));
//parse json data to req.body object as properties.
app.use(body_parser.json());


//end points//
//to generate fitness cert./result
app.post("/download_file", (req, res, next)=>{
    const reqBody=req.body;
    let statusCode=0, resMessage="";
    const params={
        bucketName:reqBody.bucketName,
        fileKey:reqBody.fileKey
    }
    const filePath=path.join(__dirname, params.fileKey);
    if(downloadFile(filePath, reqBody.bucketName, reqBody.fileKey)){
        statusCode=200; resMessage="File downloaded successfully";
    }else{
        statusCode=500; resMessage="Unable to downlaod file from s3";
    };
    res.status(statusCode).send({resMessage});
});


//reusable components

const downloadFile = (filePath,bucketName, key) => {

    var s3 = new AWS.S3();
  const params = {
    Bucket: bucketName,
    Key: key
  };
  s3.getObject(params, (err, data) => {
    if(err){
        console.error(err);
        return false;
    }else{
        fs.writeFileSync(filePath, data.Body.toString());
        //console.log(`${filePath} has been created!`);
        return true;
    }
    
  });
};



//run app
app.listen(3000, ()=>console.log("App is running on port 3000 locally and over intranet."));






