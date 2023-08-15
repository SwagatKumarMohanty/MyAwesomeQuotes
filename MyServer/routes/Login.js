const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const express=require('express');
const { request } = require('http');
const apptoLogin=express.Router();
const mysql=require('mysql');
const connection=mysql.createConnection(
   {
    host:'localhost',
    database:'aws_quotes',
    password:'manager',
    user:'root'
   }
);
//t={"isvalid":"false"};
//and password= binary '${request.body.password}'
apptoLogin.post("/",(request,response)=>
{//response.setHeader("Content-Type","appication/json");
    var query=`select * from users where email= binary '${request.body.username}'`;

    connection.query(query,(error,result)=>{
         if(error==null)
         {
               //var t={"isvalid":""};
               var data=JSON.stringify(result);
               if(data!="[]")
               {
                
                var temp=new Array();
                temp=JSON.parse(data);
                console.log(temp);
                bcrypt.compare(request.body.password.toString(),temp[0].password,(err,resp)=>{
                  var t={"isvalid":"false"};
                  if(resp)
                     {
                        console.log(temp[0].first_name);
                     console.log(temp[0].last_name);
                     t={"isvalid":temp[0].id, "firstName":temp[0].first_name, "lastName":temp[0].last_name};

                     }
                     
                     response.setHeader("Content-Type","appication/json");
                     response.write(JSON.stringify(t));
                     response.end();

                  
                  // if(resp=="")
                  // {
                  //    console.log("Empty result");
                  //    t={"isvalid":"false"};
                  //    //response.setHeader("Content-Type","appication/json");
                  //    //response.write(JSON.stringify(t));
                  //    //console.log(response);

                  // }
                
                })
                   
                //console.log(temp[0].user_id);
                
                 //var topicname=sessionStorage.getItem("topicName");
                //sessionStorage.setItem("id",temp[0].user_id);
                
    
               }
               else
               {
                var t={"isvalid":"false"};
                response.setHeader("Content-Type","appication/json");
                response.write(JSON.stringify(t));
                response.end();
                 
               }
               // response.setHeader("Content-Type","appication/json");
               // response.write(JSON.stringify(t));
         }  
         // else
         // {
         //    var t={"isvalid":"false"};
         //    response.setHeader("Content-Type","appication/json");
         //    response.write(JSON.stringify(t));
         // }   
         //response.end();
    });

})
module.exports=apptoLogin;