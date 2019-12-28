import * as firebase from 'firebase'
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  };
  let options = {
    keyPrefix: "Album/",
    bucket: "awesometzumt",
    region: "ap-south-2",
    accessKey: "",
    secretKey: "",
    successActionStatus: 201,
  }

 firebase.initializeApp(firebaseConfig);
 const auth = firebase.auth();
 const db = firebase.firestore();

 function signin(email,password){
  return auth.signInWithEmailAndPassword(email,password)
 }

 function signup(email,password,name){
   return new Promise((resolve,reject)=>{
     auth.createUserWithEmailAndPassword(email,password).then(user=>{
       db.collection('users').doc(user.user.uid).set({
         email,name,
         createdAt: Date.now()
       })
       .then(()=>{
         resolve({message:'Registerd successfully(-:'})
       })
       .catch((error)=>{
         reject({message:error.message})
       })
     })
     .catch(error=>{
       console.log(error)
       reject({message:error.message})
     })
   })
 }

 function getUsers(){
   return new Promise((resolve,reject)=>{
     db.collection('users').get().then(snap=>{
       let users = []
       snap.forEach(val=>{
         if(val.data().email){

           let dt = val.data()
           users.push({email:dt.email,_id:val.id,name:dt.name})
          }
       })
       resolve(users)
     })
   })
 }

 //room
 function createRoom(friendId){
   const userId = auth.currentUser.uid;
   let chatExist = false;

   return new Promise((resolve,reject)=>{
     db.collection('chatrooms')
     .where('users.'+userId,'==', true )
     .where('users.'+friendId,'==',true)
     .get().then(snap=>{

       snap.forEach(val=>{
         chatExist = {
           data:val.data(),
           _id:val.id
         };
       })

       if(!chatExist){
         //room bany ga..
         const obj ={
           createdAt: Date.now(),
           users:{
             [friendId]:true,
             [userId] :true
           }
         }
         db.collection('chatrooms').add(obj).then(snap=>{
           resolve({data:obj,_id:snap.id})
         })
       }else{
         resolve(chatExist)
       }
     })
   })
 }

 function sendMessage(roomId, message){
   console.log('message',message)
   const obj ={
     message,
     userId:firebase.auth().currentUser.uid,
     timestamp:Date.now()
   }
   return db.collection('chatrooms').doc(roomId).collection('messages').add(obj)
 }

 function sendStatus(status){
  let userId = firebase.auth().currentUser.uid
   const status_obj = {
     status,
     userId,
     timestamp:Date.now(),
   }
   return db.collection('status').doc(userId).set(status_obj)
 }
 function getAllStatus(){
   return new Promise((resolve,reject)=>{
     db.collection('status').get().then((snap)=>{
       let status = []
       snap.forEach(val=>{
         console.log('stttt',val.data())
         status.push(val.data())
       })
       resolve(status)
     })
   })
 }

 function facebooklogin(token) {
  const credential = firebase.auth.FacebookAuthProvider.credential(token);

  // Sign in with credential from the Facebook user.
  return firebase.auth().signInWithCredential(credential);
}
function signout(){
   return auth.signOut()
}

 export {
   signup,
   getUsers,
   createRoom,
   sendMessage,
   options,
   signin,
   sendStatus,
   getAllStatus,
   facebooklogin,
   signout,

 }
 export default firebase;
