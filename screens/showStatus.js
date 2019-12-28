import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'

import { Ionicons,AntDesign,FontAwesome,Entypo,MaterialIcons,Feather} from '@expo/vector-icons';
import firebase, { sendStatus,getAllStatus } from '../config/firebase';

export default class ShowStatus extends Component {
    constructor(){
        super();
        this.state={
            s_to_show:[],
        }
    }
    async status(){
        let s_data= await getAllStatus();
        let { navigation } = this.props;
  let userId = navigation.getParam('userId','no_id');
  let s_to_show = s_data.filter(val=>val.userId == userId)
  this.setState({s_to_show})
    }
     componentDidMount(){
        this.status()
    }
    render() {
        let { s_to_show } = this.state;
        console.log('ssssssss===========>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',s_to_show)
        return (
           <View style={{flex:1}}>
               {s_to_show && s_to_show.map(v=>{

                  return <Image 
                  style={{flex:1}}
                   source={{uri:v.status}}
                   />
                })}
           </View>
        )
    }
}
