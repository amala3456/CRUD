// Task1: initiate app and run server at 3000
const express=require('express');
const mongoose=require('mongoose');
const app=express();
const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));
app.use(express.json());
app.listen(3000,()=>{
    console.log("server is up and running");
});
// Task2: create mongoDB connection 
const mongoDB_URL='mongodb+srv://amala:amalajames@cluster0.kumlfz2.mongodb.net/Employee?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoDB_URL).then(()=>{
    console.log('DB connected');
});

//creating schema
const employeeSchema=mongoose.Schema({
    location:String,
    name:String,
    position:String,
    salary:Number
});

//create model
const employeeModel=mongoose.model('employees',employeeSchema);


//Task 2 : write api with error handling and appropriate api mentioned in the TODO below

//TODO: get data from db  using api '/api/employeelist'

app.get('/api/employeelist',async(req,res)=>{
    try {
        const employeeId= await employeeModel.find();
        res.json(employeeId);  
    } catch (error) {
        console.log('error message:',error.message);
        
    }
})

//TODO: get single data from db  using api '/api/employeelist/:id'

app.get('/api/employeelist/:id',async(req,res)=>{
    try {
        const user=await employeeModel.findById({_id:req.params.id});
        res.json(user);
    } catch (error) {
        console.log('error message:',error.message);
    }

});



//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post('/api/employeelist',async(req,res)=>{
    try {

        const addemployee=req.body;
        const add1=new employeeModel(addemployee);
        const add2=await add1.save();
        res.json(add2).status(200);
        
    } catch (error) {
        console.log('error message:',error.message);
    }
})


// TODO: Update  a employee data from db by using api '/api/employeelist'
// Request body format:{name:'',location:'',position:'',salary:''}
app.put('/api/employeelist',async(req,res)=>{
    try {
        const data=await employeeModel.findById(req.body._id);
        if (!data) {
            return res.status(404).send('Employee not found');
        }
        data.name=req.body.name;
        data.salary=req.body.salary;
        data.location=req.body.location;
        data.position=req.body.position;
       const data1=await data.save();
        res.json(data1).status(200);    
    } catch (error) {
        console.log('error message:',error.message);
    }
});
//TODO: delete a employee data from db by using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id',async(req,res)=>{
    try {
        const data=await employeeModel.deleteOne({_id:req.params.id});
        if(data.deletedCount===0){
            return res.json({error:'no data found'}).status(404);
        }
        res.json(data).status(200);
    } catch (error) {
        console.log('error message:',error.message);
    }
})

//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});



