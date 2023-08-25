import app from '.';
import mongoose from 'mongoose';

const PORT= process.env.PORT || 1212

mongoose.connect("mongodb://127.0.0.1:27017/mongosh").then((res)=>{

if(res){
     app.listen(PORT, (): void =>  console.log(`app is listening on port ${PORT}`))
        return {connectionStatus: true}
    }
}).then((status): void=>{
     console.log(`Connection status is ${status?.connectionStatus}`)
}).catch((err)=>  console.error(err))