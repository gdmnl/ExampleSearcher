const express = require("express");
const cors = require('cors');
const app = express();
const LORA = require("./build/Release/LORA");
const keyPairing = [];
app.use(cors({ origin: true }));
app.use(express.json());

app.get('/', (req,res)=>{
    res.send("App is working");
}) 

app.post('/generateKey', (req,res)=>{
    try{

        LORA.createPair(req.body['key']);
        keyPairing.push({key:req.body['key'], count:0})
        console.log(keyPairing);
        res.send({
            success: true,
            message: "Pair Created"})
    }
    catch(e){
        console.log("Error", e);
        res.send({
            success: false,
            message: "Check Log"
        })
    }
    
})

app.post('/deleteKey', (req,res)=>{
    try{

        LORA.deletePair(req.body['key']);
        const index = keyPairing.findIndex(x => x.key === req.body['key']);
        keyPairing.splice(index,1);
        console.log(keyPairing);
        res.send({
            success: true,
            message: "Pair Deleted"})
    }
    catch(e){
        console.log("Error", e);
        res.send({
            success: false,
            message: "Check Log"
        })
    }
    
})

app.post('/runLORA', (req,res)=>{
    
    try{
        const queryTrack = req.body['query'];
        const datalist = req.body['datalist'];
        const key = String(req.body['key']);
        console.log(queryTrack, req.body['K'], key, datalist.length)
        for(var i = 0; i < datalist.length; i++){
            LORA.readDatabase(i,datalist[i]['name'],datalist[i]['geometry']['lat'],datalist[i]['geometry']['lng'],
            datalist[i]['types'] ,datalist[i]['attribute'], key);
        }
        LORA.readQuery(queryTrack, key);
        const results_rate = LORA.runLORA(Number(req.body['K']), key).toString();
        const results = results_rate.split("**");
        const result_list = results[0].split("*");
        
        if(result_list[0] !== ""){
            res.send({
                success: true,
                message: "LORA ran",
                results: result_list,
                result_rate:  results[1].split("*") 
            })
    }
    else{
        res.send({
            success: false,
            message: "LORA did not run",
            
        })
    }
    
}
catch(e){
    console.log(e)
}
});

app.post('/clearData', (req,res)=>{
    
    try{
        const key = String(req.body['key']);
        const index = keyPairing.findIndex(x => x.key === key);
        keyPairing[index].count = 0;
        LORA.reset(key);
        res.send({
            success: true,
            message: "Data cleared",
    })
    
}
catch(e){
    console.log(e)
}
});

const server = app.listen(process.env.PORT || 5000, () => {
    const port = server.address().port;
    console.log(`Express is working on port ${port}`);
  });