// Render forest.com
import React from 'react';
import Audio from './audio'
import { Ionicons,AntDesign,FontAwesome,Entypo} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { StyleSheet, Text, View, TextInput, Button,
   KeyboardAvoidingView,Alert, ScrollView,Image,Dimensions
  , TouchableOpacity} from 'react-native';

import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';

import { sendMessage } from '../config/firebase'
import firebase from '../config/firebase';
import MapView, {
  Marker,
  AnimatedRegion,
} from 'react-native-maps';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const db = firebase.firestore();
export default class Chat extends React.Component {
    constructor(){
        super();
        this.state={
         
          hasCameraPermission: null,
          type: Camera.Constants.Type.back,open_camera:false,
          video:false,audio:false
          ,
          // messages
          msgs:[],text:'',url:'none',
        }
    }

    askPermission = async (v) => {
      if(v == 'video'){

        const { status } = await Permissions.askAsync(Permissions.CAMERA,Permissions.AUDIO_RECORDING);
        this.setState({ hasCameraPermission: status === 'granted',video:true });
      }else{
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
      }
      };

  

snap = async () => {
  // console.log('snap()>>',this.camera)
  if (this.camera) {
    let photo = await this.camera.takePictureAsync();
    this.setState({photo})
  }
};
video = async () =>{
  if (this.camera) {
    let vid = await this.camera.recordAsync();
    this.setState({vid,video:false})
  }
}
async getAllmessages(){
  let { navigation } = this.props;
  let room_id = navigation.getParam('room_id','no_id');

  db.collection('chatrooms').doc(room_id).collection('messages')
  .orderBy('timestamp')
  .onSnapshot(snap=>{
    let msgs = [];
    snap.forEach(val=>{
      msgs.push({data:val.data(),_id:val.id})
    })
    // console.log('msgs>>>',msgs)
    this.setState({msgs})
  })

}
sendmsg(){
  let { navigation } = this.props;
  let room_id = navigation.getParam('room_id','no_id');

  sendMessage(room_id, this.state.text)
  this.setState({text:''})

}

//Send pic ===========================================)

upLoadImage = async () => {
  let { photo } =this.state;
  const response = await fetch(photo.uri);
  const blob = await response.blob();
  let { navigation } = this.props;
  let room_id = navigation.getParam('room_id','no_id');
  var ref = firebase.storage().ref().child("imagesCht/imageme");
  await ref.put(blob).on('state_changed',()=>{},()=>{},()=>ref.getDownloadURL().then(url=>{
    console.log('uuu',url)
    sendMessage(room_id,{url})
  }
 ));
}

sendPic= async()=>{
 
  
  await this.upLoadImage().then(suc=>{
   
  console.log('jj',suc)
    // Alert.alert('alll',this.state.url)
    this.setState({photo:''})
  }).catch(e=>{
    console.log('err',e.message)
    Alert.alert(e.message)
  })

}

//=======================================================UPLOAD VIDEO===============================================//
upLoadVideo = async () => {
  let { vid } =this.state;
  const response = await fetch(vid.uri);
  const blob = await response.blob();
  let { navigation } = this.props;
  let room_id = navigation.getParam('room_id','no_id');
  var ref = firebase.storage().ref().child("videos/imageme");
  await ref.put(blob).on('state_changed',()=>{},()=>{},()=>ref.getDownloadURL().then(video=>{
    console.log('uuu',video)
    sendMessage(room_id,{video})
  }
 ));
}
sendVideo= async()=>{
 
  
  await this.upLoadVideo().then(suc=>{
   
  console.log('jj',suc)
    // Alert.alert('alll',this.state.url)
    this.setState({vid:''})
  }).catch(e=>{
    console.log('err',e.message)
    Alert.alert(e.message)
  })

}
//get All messages ===========================)
componentDidMount(){
  this.getAllmessages()
}
componentWillUnmount(){
  this.setState({
    msgs:[],text:''
  })
}

    render(){
      let { hasCameraPermission,msgs } = this.state;
      let { navigation } = this.props;
  let name = navigation.getParam('name','no_name');
  let room_id = navigation.getParam('room_id','no_id');

      if(!hasCameraPermission){
        return (
          <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
             <View style={styles.header}>
               <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                 <Text style={{textAlign:'center',marginTop:2,fontSize:30}}>{'<|'}</Text>
               </TouchableOpacity>
             <Image
                    style={styles.image}
                    source={{uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3ag28ODXXYsmpNSwDenT5ayiQkjtRzNyfhpMoeQc_DX4u3KqV1A"}}
                    />
               <Text style={{textAlign:'center',marginTop:9}}>{name}</Text>
               <View style={{flex:1}}></View>
                
                <TouchableOpacity style={styles.icons}><Text><Ionicons  name="md-call" size={26}  /></Text></TouchableOpacity> 
               <TouchableOpacity style={styles.icons}><Text><FontAwesome  name="video-camera" size={26}  /></Text></TouchableOpacity> 
               <TouchableOpacity style={styles.icons}><Text><Entypo  name="dots-three-vertical" size={26}  /></Text></TouchableOpacity> 
                
             </View>
            
               <ScrollView
                ref={ref => this.ScrollView = ref}
                onContentSizeChange={(contentWidth,contentHeight)=>{
                  this.ScrollView.scrollToEnd({animated:true})
                }}
                
               >
                 <LinearGradient 
                  colors={['#fff9c4', '#b9f6ca', '#c8e6c9']}
                 >

                 {/* <View style={{flex:1,flexDirection:'column',justifyContent:'flex-end',}}> */}

               {msgs.map((message,key)=>{
                 const mediaStyle = message.data.userId === firebase.auth().currentUser.uid?
                 styles.style0:styles.style1
                 const messageStyle = message.data.userId === firebase.auth().currentUser.uid?
                 styles.text1:styles.text
                 console.log('mmmm',message.data.message)
                  if(message.data.message.location){
                    return<MapView
                    style={mediaStyle}
                    key={key}
                    initialRegion={{
                      latitude: message.data.message.location.latitude,
                      longitude: message.data.message.location.longitude,
                      latitudeDelta: LATITUDE_DELTA,
                      longitudeDelta: LONGITUDE_DELTA,
                      
                    }}
                    >
                      <Marker
                       
                       coordinate={{
                         latitude: message.data.message.location.latitude,
                         longitude: message.data.message.location.longitude
                        }}
                        />
            
                    </MapView>
                  }

                  if(message.data.message.video){
                   return <Video
                   key={key}
                   source={{ uri: message.data.message.video}}
                   rate={1.0}
                   volume={1.0}
                   isMuted={false}
                   resizeMode="cover"
                   shouldPlay
                   isLooping
                   style={mediaStyle}
                   />
                  }
                 if(message.data.message.url){
                   return <Image key={key} style={mediaStyle} source={{uri:message.data.message.url}}></Image>
                 }
                 if(!message.data.message.url && !message.data.message.video && !message.data.message.location ){
                   
                   return<Text key={key} style={messageStyle}>{message.data.message}</Text>
                  }
                })}


{/* <Text style={styles.text1}>My Text lllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll</Text> */}

               
                 {/* </View> */}
                </LinearGradient>
               </ScrollView>
               


                 <View style={{display:'flex',flexDirection:"row",}}>

                 <TouchableOpacity onPress={()=>this.askPermission('video')} style={styles.icons}><Text><FontAwesome  name="video-camera" size={26}  /></Text></TouchableOpacity> 
                <TouchableOpacity onPress={()=>this.askPermission()}  style={styles.icons}><Text><AntDesign   name="camera" size={26}  /></Text></TouchableOpacity> 
                   <TouchableOpacity onPress={()=>this.props.navigation.navigate('Audio')} style={styles.icons}><Text><FontAwesome  name="microphone" size={26}  /></Text></TouchableOpacity> 
                   <TouchableOpacity style={styles.icons}><Text><Entypo  name="emoji-happy" size={26}  /></Text></TouchableOpacity> 
                   <TouchableOpacity onPress={()=>this.props.navigation.navigate('Location',{room_id:room_id})} style={styles.icons}><Text> <Entypo  name="location-pin" size={26}  /></Text></TouchableOpacity> 
                 <TouchableOpacity onPress={()=>this.props.navigation.navigate('ImagePicker')} style={styles.icons}><Text><AntDesign  name="picture" size={26}  /></Text></TouchableOpacity> 
                 <TouchableOpacity style={styles.icons}><Text><AntDesign  name="addfile" size={26}  /></Text></TouchableOpacity> 
                   
                 </View>


               <View style={{display:'flex',flexDirection:'row'}}>

                <TextInput 
                style={styles.input}
                placeholder='Type massege here.. '
                onChangeText={(t)=>this.setState({text:t})}
                />
                 <TouchableOpacity onPress={()=>{this.sendmsg(this.state.text)}}  style={styles.button}>
                  <Text>Send</Text>
                </TouchableOpacity>
                </View>
                
           
                </KeyboardAvoidingView>
                
                );
              }else{
                return(
                  !this.state.photo?
                <View style={{ flex: 1 }}>
                <Camera style={{ flex: 1 }} type={this.state.type}
                 ref={ref => {
                  this.camera = ref;
                }}
                >
{/*  */}
              
                  {/*  */}
                  <TouchableOpacity
                      style={{
                        flex: 0.3,
                        alignSelf: 'flex-end',
                        alignItems: 'flex-end',
                        marginTop:30,
                        marginRight:10,
                      }}
                      onPress={() => {
                        this.setState({
                          hasCameraPermission:null
                        });
                      }}>
                  
                      <AntDesign name='closecircleo' size={32} style={{ marginBottom: 10, color: 'red' }}/>
                    </TouchableOpacity>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: 'transparent',
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        flex:0.2,
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        alignSelf: 'flex-end',
                        justifyContent:'flex-end'
                      }}>

                        {
                          this.state.vid
                          ?
                          
                          <Video
  source={{ uri: this.state.vid.uri }}
  rate={1.0}
  volume={1.0}
  isMuted={false}
  resizeMode="cover"
  shouldPlay
  isLooping
  style={{ width: 300, height: 300 }}
/>

:
                    <Image
                    style={styles.image}
                    source={{uri: this.state.photo ? this.state.photo.uri :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3ag28ODXXYsmpNSwDenT5ayiQkjtRzNyfhpMoeQc_DX4u3KqV1A"}}
                    />
                  }
                   </View>
                   {
                     this.state.video
                     ?
                     <View>
                     <Button
                     
                     title="Send"
                     onPress={()=>{this.sendVideo()}}
                     />
                     <Text>=====================================</Text>
                     <TouchableOpacity
                     style={{
                       flex: 0.65,
                       alignSelf: 'flex-end',
                        alignItems: 'center',
                      }}
                      onPress={() => {this.video()}}>
                      <Entypo name='circle' size={45} style={{ marginBottom: 10, color: 'white' }}/> 
                    </TouchableOpacity>
                      </View>
:
<TouchableOpacity
                      style={{
                        flex: 0.65,
                        alignSelf: 'flex-end',
                        alignItems: 'center',
                      }}
                      onPress={() => {this.snap()}}>
                      <Entypo name='circle' size={45} style={{ marginBottom: 10, color: 'white' }}/> 
                    </TouchableOpacity>
                    }
                    <TouchableOpacity
                      style={{
                        flex: 0.15,
                        alignSelf: 'flex-end',
                        alignItems: 'flex-end',
                        marginRight:10,
                      }}
                      onPress={() => {
                        this.setState({
                          type:
                            this.state.type === Camera.Constants.Type.back
                              ? Camera.Constants.Type.front
                              : Camera.Constants.Type.back,
                        });
                      }}>
                      <Ionicons name='ios-reverse-camera' size={38} style={{  marginBottom: 10, color: 'white' }}/> 
                    </TouchableOpacity>
                  </View>
                </Camera>
              </View>
              :
              <View style={{flex:1}}>
                   <TouchableOpacity
                      style={{
                        flex: 0.1,
                        alignSelf: 'flex-end',
                        alignItems: 'flex-end',
                        marginTop:30,
                        marginRight:10,
                      }}
                      onPress={() => {
                        this.setState({
                          hasCameraPermission:null
                        });
                      }}>
                  
                      <AntDesign name='closecircleo' size={32} style={{ marginBottom: 10, color: 'red' }}/>
                    </TouchableOpacity>
                        <Image
                        style={{flex:1}}
                        source={{uri: this.state.photo ? this.state.photo.uri :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3ag28ODXXYsmpNSwDenT5ayiQkjtRzNyfhpMoeQc_DX4u3KqV1A"}}
                       / >
                    

                  <View>

                <Button
                title="Send"
                onPress={()=>{this.sendPic()}}
                />
                <Button
                title='Re-take'
                onPress={()=>{this.setState({photo:''})}}
                />
                </View>

              </View>
              )
              }
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:20,
  },
  header:{
    display:'flex',
    flexDirection:'row',
    height:50,
    backgroundColor:'lightgray',
    justifyContent:'center',
    marginTop:5
  },
  image:{
    height:35,
    width:35,
    marginRight:25,
    margin:7,
    borderRadius:25,
},
  heading:{
    fontSize:25,
    marginBottom:30,
  }
  ,input:{
    width:'89%',
    height:50,
    paddingLeft:10,
    padding:8,
    backgroundColor:'#eeeeee',
    fontSize:18,
  },
  button:{
    width:60,
    height:50,
    backgroundColor:'#eeeeee',
    textAlign:'center',
    fontSize:20, 
    paddingTop:13,
    

  },
  msgs:{
    display:'flex',
    justifyContent:'flex-end',
    minHeight:510,

  },
  icons:{
    marginRight:10,
    margin:10,
  },
  text:{
    maxWidth:200,
    backgroundColor:'#2196f3',
    left:0,color:'white',
    padding:4,
    borderTopRightRadius:25,
    borderTopLeftRadius:10,
    borderBottomLeftRadius:10,
    paddingRight:15,
    alignSelf:'flex-start',
    marginTop:3,
  },
  text1:{
    maxWidth:200,
    backgroundColor:'teal',
    left:0,color:'white',
    padding:4,
    borderTopLeftRadius:25,
    borderTopRightRadius:10,
    borderBottomRightRadius:10,
    paddingLeft:15,
    alignSelf:'flex-end',
    marginTop:3,
  },
  style0:{
    width: 200, 
    height: 120,
    alignSelf:'flex-end',
    marginTop:5
  },
  style1:{
    width: 200, 
    height: 120,
    alignSelf:'flex-start',
    marginTop:5
  }
});



// Over the year