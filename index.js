import express from 'express';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import cors from 'cors'
import { totalPhoneBill } from "./phoneBillFunction.js";

const app = express();
const PORT = process.env.PORT || 4011;

app.use(express.static('public')) //create a static folder
app.use(express.json())// ensure parse response is a json response
app.use(cors());


    const db = await sqlite.open({ // ensuring the database is opened with sqlite
    filename: './data_plan.db',
    driver: sqlite3.Database
});



await db.migrate();

//get all price plans

app.get('/api/price-plans', async (req, res)=>{
  try{
    const rows = await db.all('SELECT * FROM price_plan');
    res.json({data:rows})
  }catch (err){
    res.status(500).json({error:err.message});
  }
})

//calculate total bill
app.post('/api/phonebill', async (req, res) => {
  const {plan_name, actions} = req.body;

  if (!plan_name||!actions) {
    res.status(400).json ({error:'Please enter phone usage and the plan name.'});
    return;
  }
  try{
    const plan= await db.get('SELECT * FROM price_plan WHERE plan_name = ?', [plan_name]);
    if (!plan){
      res.status(400).json({error:'Invalid plan entered'});
      return;
    }
   const phoneBill= totalPhoneBill(actions, plan.call_price, plan.sms_price);
   const total = parseFloat(phoneBill.replace('R', ''));
    console.log({total})
   await db.run('INSERT INTO plan_total (total, plan_name) values(?,?)', [total, plan_name])

   res.json ({total});
} catch (err){
  res.status(500).json({err:err.message});
}
})

//creating my own price plan
app.post('/api/price-plan/create', async(req, res)=>{
  const{plan_name, sms_price, call_price}= req.body;

  if(!plan_name|| typeof sms_price !== 'number' || typeof call_price !== 'number') {
    res.status(400).json({error:'Invalid inputs entered'});
    return;
  }
  await db.run( //insert new plan into db
    'INSERT INTO price_plan(plan_name, sms_price, call_price) VALUES (?,?,?)',
    [plan_name, sms_price, call_price]
  );

 if
(res.status(201).json({message:'New price plan added!'})){
} else {
  res.status (500).json({error: 'Error creating new price plan'})
}
}
);

//Updating price plans
 app.post('/api/price-plan/update', async (req, res)=>{
  const{plan_name, sms_price, call_price}= req.body;
  await db.run('UPDATE  price_plan set sms_price = ?, call_price=? WHERE plan_name= ?',
    [plan_name, sms_price, call_price]
); 
if
(res.status(201).json({message:'Price plans updated!'})){
} else {
  res.status (500).json({error: 'Error updating price plan'})
}
});

//Deleting price plans
app.post('/api/price-plan/delete', async (req,res) =>{
  const {id} = req.body
  const remove = await db.run('DELETE from price_plan where id = ?',[id]);
  if
(res.status(201).json({message:'Price plan deleted!'})){
} else {
  res.status (500).json({error: 'Error deleting price plan'})
}
});

app.get('/api/highest_total', async (req, res) => {

  const totals = await db.all(''); // get it from 003-create-most...sql
  console.log();
  

  res.status(200)
      .json({totals})
} )


app.listen(PORT, () => console.log(`Server started ${PORT}`))