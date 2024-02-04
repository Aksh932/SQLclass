const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride =require("method-override");


app.use(methodOverride("_method"));
app.use(express.urlencoded({extended :true}));
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "/views"));

const connection = mysql.createConnection({
    host     : "localhost",
    user     : "root",
    password : "1234",
    database : "delta_app"
  });

// let q ="INSERT INTO user (id,username,email,password) VALUES ?";
// let user=[
//           ["1223","a2skdh" ,"s2da@sdfsdf","1223e"],
//           ["12213","a12skdh" ,"s21da@sdfsdf","12213e"]
// ];

let getRendomeUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

// let data =[];
// for(let i=0;i<=100;i++){
//   data.push(getRendomeUser()) ; 
// }


// try {
//     connection.query(q,[data], (err , result) => {
//         if (err) throw err;
//         console.log(result);
//       });
// } catch (err) {
//     console.log(err);
// }
// connection.end();


//home page cout data 
app.get("/" , (req ,res) => {
  let q = `SELECT count(*) from user`;
  try{
    connection.query(q , (err,result) => {
      if (err) throw err;
      console.log(result);
      let count = result[0]["count(*)"]
      res.render("home.ejs",{ count });
    })
  }catch{
    console.log(err);
    res.send("database error")
  }
});
// show data for table
app.get("/user" , (req,res) => {
  let q = `SELECT * FROM user`;
  try{
    connection.query(q , (err ,users) => {
      if(err) throw err;
      res.render("showuser.ejs" ,{ users });
    });
  }catch{
    res.send("database error");
  }
});

//1.edit data for edit.ejs page
app.get("/user/:id/edit" , (req,res) => {
  let { id } = req.params;
  let q=`SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(q , (err,result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs" , {user});
    })
  }catch{
    res.send("database err");
  }
});
//2.update data for edit page
app.patch("/user/:id" , (req,res) =>{
  let { id } = req.params;
  let { password: formpass , username : formname} =req.body;
  let q=`SELECT * FROM user WHERE id='${id}'`;

  try{
    connection.query(q , (err,result) => {
      if (err) throw err;
      let user = result[0];
      if(formpass != user.password){
        res.send("wrong password");
      }else{
        let q2=`UPDATE user SET username='${formname}' WHERE id='${id}'`;
        connection.query(q2 , (err,result) =>{
          if (err) throw err;
          res.redirect("/user");
        });
      }
    });
  }catch{
    res.send("database err");
  }
  
});


 
app.listen(port , () => {
  console.log("hello");
})