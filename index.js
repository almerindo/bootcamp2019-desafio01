const express = require('express');

const server = express();
server.use(express.json());

/**
 * Para lembrar:
 * 
 * Query params ==> ?nome=Almerindo
 * '/users'
 * const nome = req.query.nome 
 * 
 * 
 * Route params ==> /users/1
 '/users/:id'
 const {id} = req.query.id 
 *
 * Request body ==> {"nome":"Almerindo", "email": "almerindo.rehem@gmail.com"}
 * 
 */

const users = [{nome:"Almerindo", idade: 42}, 
              {nome: "Silvana", idade: 41}, 
              {nome:"Duda", idade:8}];



/****************************************************************
 * 
 *                    MIDDLEWARES
 * 
 ****************************************************************/
//Midleware Global
server.use((req,res,next)=>{
  console.time('TIME');
  next();

  console.log(`Method: ${req.method}; URL: ${req.url}; `);
  console.timeEnd('TIME');

});



//Midleware Local
function checkUSerInArray(req,res,next){
  let user = users[req.params.id];

  if (!user){
    return res.status(400).json({error:'User does not exist!'})
  }

  req.user = user;
  next();
}




/**************************************************************
 * 
 *                        ROTAS
 * 
 * *********************************************************** */ 
//Lista todos
server.get('/users',(req,res)=>{
  return res.json(users); 
});

//Returna um específico
server.get('/users/:id',checkUSerInArray,(req,res)=>{
  return res.json(req.user ); 
});

//Adiciona 
server.post('/users/add', (req,res)=>{
  let {nome, idade} = req.body;

  const user = {"nome":nome,"idade": idade};
  users.push(user);
  return res.json(users);
});

//Altera 
server.put('/users/:id',checkUSerInArray,(req,res)=>{
  let {id} = req.params;
  let {nome, idade} = req.body;
  const user = {"nome":nome,"idade": idade};

  users[id] = user;
  return res.json(users); 
});

//Delete 
server.delete('/users/:id',checkUSerInArray,(req,res)=>{
  let {id} = req.params;
 
  users.splice(id,1);
  
  return res.json(users); 
});


server.listen(3000);