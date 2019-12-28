import React , { Component } from 'react'
import { View, Text, Image, Button } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions'
import * as MediaLibrary from 'expo-media-library';
import { options } from '../config/firebase';
export default class Img extends Component{
    constructor(){
        super();
        this.state={
            permission:null,img:null,

        }
    }
  async  componentDidMount(){
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({permission:status === 'granted'})

       
    }

    picImage= async ()=>{
       let result =await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
        })
        // if(!result.cancelled){
            this.setState({
                img:result.uri
            })
        // }

    }
    

    render(){
        const asset =  MediaLibrary.getAssetsAsync(options);
        console.log('asser>>>>>>>>>>>>>>>>++',asset.uri)
        return(
            <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center' }}>
                <Image
                style={{width:300,height:300,}}
                source={{uri:this.state.img}}
                />
                <Button
                title='Pic Image from'
                onPress={()=>{this.picImage()}}
                />

            </View>
        )
    }
}