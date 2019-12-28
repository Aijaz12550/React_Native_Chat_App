import React, { Component } from 'react'
import { View, Text, Button,TouchableOpacity,Image, StyleSheet } from 'react-native'
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import { Ionicons,AntDesign,FontAwesome,Entypo,MaterialIcons,Feather} from '@expo/vector-icons';
import firebase, { sendStatus,getAllStatus } from '../config/firebase'
import * as FileSystem from 'expo-file-system';

export default class Status extends Component {

    constructor(){
        super();
        this.state={
         
          hasCameraPermission: null,
          type: Camera.Constants.Type.back,open_camera:false,
          video:false,audio:false,media:null,
         
        }
    }
snap = async ()=>{
const { status } = await Permissions.askAsync(Permissions.CAMERA,Permissions.AUDIO_RECORDING);
this.setState({
    hasCameraPermission : status === 'granted'
})
}

takePicture=async()=>{
if(this.camera){
    let photo = await this.camera.takePictureAsync();
    this.setState({media:photo})
}
}

upLoadStatus=async ()=>{
    let { media } = this.state;
    let response = await fetch(media.uri);
    let blob =  await response.blob();

    // Storage
    let ref = firebase.storage().ref().child('Status/now');
    await ref.put(blob).on('state_changed',()=>{},()=>{},()=>ref.getDownloadURL().then(url=>{
        sendStatus(url);
        console.log('status',url)
    }).catch(e=>{
        console.log('Status_error',e.message)
    })
    )
}
async status(){
    let s_data= await getAllStatus()
    this.setState({s_data})
}
 componentDidMount(){
    this.status()
}
    render() {
        let { hasCameraPermission,media,s_data } = this.state;
        console.log('s_data>>',s_data)
        if(hasCameraPermission){
           return !media ? <Camera style={{ flex: 1 }} type={this.state.type}
            ref={ref => {
             this.camera = ref;
           }}
           >
          
                    <View
                    style={{
                      flex: 1,
                      backgroundColor: 'transparent',
                      flexDirection: 'row',
                    }}>
                                <TouchableOpacity
                      style={{
                        flex: 0.15,
                        alignSelf: 'flex-end',
                        alignItems: 'flex-start',
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
 
 {/* ==========================Take Picture====================== */}
                    <TouchableOpacity
                      style={{
                        flex: 0.35,
                        alignSelf: 'flex-end',
                        alignItems: 'flex-end',
                      }}
                      onPress={() => {this.takePicture()}}>
                      <Entypo name='circle' size={40} style={{ marginBottom: 10, color: 'white',marginRight:5 }}/> 
                    </TouchableOpacity>
                    
                    
                    <TouchableOpacity
                      style={{
                        flex: 0.35,
                        alignSelf: 'flex-end',
                        alignItems: 'flex-start',
                      }}
                      onPress={() => {this.snap()}}>
                      <Feather name='video' size={45} style={{ marginBottom: 10, color: 'white' }}/> 
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flex: 0.15,
                        alignSelf: 'flex-end',
                        alignItems: 'flex-end',
                        marginRight:5,
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
           :
             <View style={{flex:1}}>
             <Image
             style={{flex:1}}
             source={{uri:media.uri}}
             />
                 <View
                    style={{
                      flex: 0.1,
                      backgroundColor: 'transparent',
                      flexDirection: 'row',
                      justifyContent:'center'
                    }}>

                        {/* =======================Back===================== */}
                                <TouchableOpacity
                      style={{
                        flex: 0.3,
                        alignSelf: 'center',
                        alignItems: 'center',
                        marginRight:10,
                        color:'red'
                      }}
                      onPress={() => {
                      this.setState({hasCameraPermission:null})
                      }}>

             <AntDesign name = 'back' size={32} style={{color:'red'}}/>
                      </TouchableOpacity>




{/* ======================================Add ============================= */}
                      <TouchableOpacity
                      style={{
                        flex: 0.4,
                        alignSelf: 'center',
                        alignItems: 'center',
                        marginRight:10,
                      }}
                      onPress={() => {
                      this.upLoadStatus()
                      }}>

             <Ionicons name='ios-cloud-done' size={32} style={{color:'#296'}}/>
                      </TouchableOpacity>

{/* =========================================Re-Take================================== */}
                      <TouchableOpacity
                      style={{
                        flex: 0.3,
                        alignSelf: 'center',
                        alignItems: 'center',
                        marginRight:10,
                      }}
                      onPress={() => {
                      this.setState({photo:null})
                      }}>

             <MaterialIcons name='switch-camera' size={32} style={{color:'skyblue'}}/>
                      </TouchableOpacity>



                      </View>
         </View>

        }else{

            return (
                <View style={{marginTop:50}}>
            <Button
            title='Add Status'
            onPress={()=>this.snap()}
            />

            <View>
                {
                    this.state.s_data &&
                    this.state.s_data.map((val,indx)=>{

                        return<TouchableOpacity onPress={()=>this.props.navigation.navigate('ShowStatus',{
                            userId:val.userId
                        })}  key={indx} style={styles.bItems} >
                        <Image
                        style={styles.image}
                        source={{uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3ag28ODXXYsmpNSwDenT5ayiQkjtRzNyfhpMoeQc_DX4u3KqV1A"}}
                        />
                        <Text style={{textAlign:'center',margin:10}}>{val.userId} </Text>
                        
                    </TouchableOpacity>
                    })
                }
            </View>

         


          </View>

)
}
    }
}

const styles = StyleSheet.create({
    container:{
        marginTop:30,
    },
    image:{
        height:55,
        width:55,
    },
    list:{
        display:'flex',
        flexDirection:'row',
        borderWidth:1,
        padding:5,

    },
    favItems:{
        display:'flex',
        flexDirection:'column',
        marginLeft:20,
    },
    blist:{
        display:'flex',
        flexDirection:'column',
        borderWidth:1,

    },
    bItems:{
        display:'flex',
        flexDirection:'row',
        marginLeft:10,
        margin:5,
    }
})