//import bcrypt from 'bcrypt';
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const express=require('express');
const { request } = require('http');
const apptoInsert=express.Router();
const mysql=require('mysql');
const connection=mysql.createConnection(
   {
    host:'localhost',
    database:'aws_quotes',
    password:'manager',
    user:'root'
   }
);
const salt=10;

apptoInsert.post("/",async (request,response)=>
{
      
    var pass= await bcrypt.hash(request.body.password.toString(),salt);
    console.log(pass);
    var query=`insert into users(first_name,last_name,email,password,mobile) values('${request.body.first_name}','${request.body.last_name}','${request.body.email}','${pass}','${request.body.mobile}')`;
     connection.query(query,(error,result)=>
     {
        if(error==null)
        {
            console.log("Passed");
            var data=JSON.stringify(result);
            response.setHeader("Content-Type","application/json");
            response.write(data);
        }
        else
        {
            console.log("Failed");
            var data=JSON.stringify(error);
            response.setHeader("Content-Type","application/json");
            response.write(data);

        }
        response.end();
     })
});

module.exports=apptoInsert;