import { error } from "console";
import { resolve } from "dns";
import { instance } from "../../../axios";

let createNewWhitelistPartnership = (formData:any) => new Promise(function(resolve, reject) {    
    instance.post( '/createNewWhitelistPartnership', formData ).then((result)=>{
        resolve(result)
    }).catch((error)=>{
        reject(error)
    })
});

let updateWhitelistPartnership = (id:string,formData:any) => new Promise(function(resolve, reject) {    
    instance.post(`/updateWhitelistPartnership/${id}`, formData).then((result)=>{
        resolve(result)
    }).catch((error)=>{
        reject(error)
    })
});


let setWhiteListFormData = (data:any,serverId?:string,discordGuildId?:string)=>new Promise(function(resolve, reject){
    const { image, ...rest } = data;
    const rawData = {
        ...rest,
        source_server: data.source_server || serverId,
        target_server:data.source_server || discordGuildId,
    };
    delete rawData.id
    delete rawData.imagePath
    const formData = new FormData();

    Object.entries(rawData).forEach(([key, value]) => {
        if (value) formData.append(key, value as string);
    });
    formData.append('image', data.imagePath || image);
    resolve(formData)
})

let getAllRoles = (serverId:string,present:any)=>new Promise(function(resolve,reject){
    const errMsg = () => {
        present({
            message: 'Unable to get the roles from the new mint server. Please make sure the SOL Decoder bot is in that server!',
            color: 'danger',
            duration: 10000,
        });
    }
    instance.get(`/getAllRoles/${serverId}`).then((result)=>{
        if(result.data.data){
            resolve(result)
        }else{
            errMsg()
            reject([])
        }            
    }).catch((error)=>{
        errMsg()
        reject(error)
    })
})


let getWhitelistPartnership = (id:string)=>new Promise(function (resolve,reject){
    instance.get( `/getWhitelistPartnership/${id}`).then((result)=>{
        resolve(result)
    }).catch((error)=>{
        reject(error)
    })
})

export {createNewWhitelistPartnership, updateWhitelistPartnership,setWhiteListFormData,getAllRoles,getWhitelistPartnership}