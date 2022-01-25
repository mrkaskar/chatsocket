const User = require('../models/User');
const Message = require('../models/Message');
const {v4} = require('uuid');
ObjectId = require('mongodb').ObjectID;

module.exports = (app) => {
   app.get('/api/users',(req,res)=>{
       User.find(
           {_id:{$ne:req.user._id}}
       )
       .exec((err,data)=>{
           if(err){
               res.json({
                   err
               })
           }else{
               var newdata = [];
               newdata = data.filter(ele=>{
                        if(ele.contacts.length > 0){
                   
                        for(var i=0; i < ele.contacts.length; i++){
                            if(ele.contacts[i].id === req.user._id.toString()){
                            return false;
                            }
                        }
                    }
                    if(ele.request.length > 0){
                   
                        for(var i=0; i < ele.request.length; i++){
                            if(ele.request[i].id === req.user._id.toString())
                            return false;
                        }
                    }

                    if(ele.response.length > 0){
                
                        for(var i=0; i < ele.response.length; i++){
                            if(ele.response[i].id === req.user._id.toString()){
                            return false;
                            }
                        }
                    }
                        return true;
               })
               res.json(newdata);
           }
       })
   })

   app.get('/api/user',(req,res)=>{
    User.find({_id:req.user._id})
    .exec((err,data)=>{
        if(err){
            res.json({
                err
            })
        }else{
            res.json(data)
        }
    })
})

   app.get('/api/requestcontact/:userid',(req,res)=>{
    const userid = req.params.userid;
    User.find({_id:userid}).exec((err,data)=>{
        if(!data){
            res.status(400).json({
                error:'there is no user with the id'
            })
        }
        else{
            User.find({_id:req.user._id,'contacts':{$elemMatch:{id:userid}}})
            .exec((err,data)=>{
                if(data.length < 1){
                    const uuid = v4();
                    User.findOneAndUpdate({_id:req.user._id},{
                        $push:{
                            request:{
                                 id:userid,
                                 room:uuid
                            }
                        }
                    }).exec((err,data)=>{
                        User.findOneAndUpdate({_id:userid},{
                            $push:{
                                response:{
                                     id:req.user._id.toString(),
                                     room:uuid
                                }
                            }
                        }).exec((err,data)=>{
                            res.json(data)
                        })
                       
                    })
                }
                
            })
        }
    })
   

})

app.get('/api/responseaccept/:userid',(req,res)=>{
    const userid = req.params.userid;
    const uuid = v4();
    User.findOneAndUpdate({_id:req.user._id},
        {
            $push:{
                contacts:{
                    id:userid,
                    room: uuid
                }
            },
            $pull:{
                response:{
                    id:userid
                }
            }
        },
       
        ).exec((err,data)=>{
            User.findOneAndUpdate({_id:userid},
                {
                    $push:{
                        contacts:{
                            id:req.user._id.toString(),
                            room: uuid
                        }
                    },
                    $pull:{
                        request:{
                            id:req.user._id.toString()
                        }
                    }
                },
              
                ).exec((err,data2)=>{
                    res.json(data2)
                })
        })

 
});
app.get('/api/responsedeny/:userid',(req,res)=>{
    const userid = req.params.userid;
    User.findOneAndUpdate({_id:req.user._id},
        {
            $pull:{
                response:{
                    id:userid
                }
            }
        }
        ).exec((err,data)=>{
            User.findOneAndUpdate({_id:userid},
                {
                    $pull:{
                        request:{
                            id:req.user._id.toString()
                        }
                    }
                }
                ).exec((err,data)=>{
                    
                })
        })

        res.json("success")

});

app.get('/api/deletecontact/:userid/:room',(req,res)=>{
    const userid = req.params.userid;
    const room = req.params.room;
    User.findOneAndUpdate({_id:req.user._id},{
        $pull:{
            contacts:{
                id:userid
            }
        }
    }).exec((err,data)=>{

        User.findOneAndUpdate({_id:userid},{
            $pull:{
                contacts:{
                    id:req.user._id.toString()
                }
            }
        }).exec((err,data)=>{
            Message.deleteMany({
                room:room
            }).exec()
            res.json("success")
        })
       
    })
   
 
})


app.get('/api/contacts/',(req,res)=>{
    const userid = req.user._id;
    User.find({_id:userid})
    
    .exec(async (err,data)=>{
        if(data[0].contacts.length > 0){
            const contacts = data[0].contacts;
            const contact_array = [];
            let count = 0;
            contacts.map((contact)=>{
                count++;
                const contact_obj = {};
                contact_obj.id = contact.id;
                contact_obj.room = contact.room;
                User.find({_id:contact_obj.id}).exec((err,data)=>{
                    contact_obj.pic = data[0].pic;
                    contact_obj.name = data[0].name;
                    contact_array.push(contact_obj);
                    if(count === contact_array.length)
                    res.json(contact_array)
                })
            })
        }else{
            res.json([])
        }
  
        })
 })

 app.get('/api/request/',(req,res)=>{
    const userid = req.user._id;
    User.find({_id:userid})
    
    .exec((err,data)=>{
        if(data[0].request.length > 0){
        const request = data[0].request;
   
            const request_array = [];
            let count = 0;
            request.map((requ)=>{
                count++;
                const request_obj = {};
                request_obj.id = requ.id;
                request_obj.room = requ.room;
                User.find({_id:request_obj.id}).exec((err,data)=>{
                    request_obj.pic = data[0].pic;
                    request_obj.name = data[0].name;
                    request_array.push(request_obj);
                    if(count === request_array.length)
                    res.json(request_array)
                })
            })
     
        }else{
            res.json([])
        }
       
    })
 })

 app.get('/api/response/',(req,res)=>{
    const userid = req.user._id;
    User.find({_id:userid})
    
    .exec((err,data)=>{
        if(data[0].response.length > 0){
            const response = data[0].response;
            const response_array = [];
            let count = 0;
            response.map((resp)=>{
                count++;
                const response_obj = {};
                response_obj.id = resp.id;
                response_obj.room = resp.room;
                User.find({_id:response_obj.id}).exec((err,data)=>{
                    response_obj.pic = data[0].pic;
                    response_obj.name = data[0].name;
                    response_array.push(response_obj);
                    if(count === response_array.length)
                    res.json(response_array)
                })
            })

        }else{
            res.json([])
        }

        })
 })

 app.get('/api/messages/:roomId/:limit',(req,res)=>{
    const room = req.params.roomId;
    const limit = parseInt(req.params.limit);
    Message.find({$or:[{from:req.user._id,room},{to:req.user._id,room}]})
    .sort([['createdAt','desc']])
    .limit(limit)
    .exec((err,data)=>{
        res.json(data);
        
    })
 })

 app.get('/api/deletemessage/:uuid',(req,res)=>{
     const uuid = req.params.uuid;
     Message.deleteOne({uuid}).then(()=>{
         res.json('success deleted')
     })
 })

}  

