import React from 'react';
import { StyleSheet, Text, View, TextInput,Alert, Button, KeyboardAvoidingView, TouchableOpacity,AsyncStorage} from 'react-native';
import firebase, { signin, facebooklogin , signup} from '../config/firebase'

import * as Facebook from 'expo-facebook';

export default class Signin extends React.Component {
    constructor(){
        super();
        this.state={
          email:null,password:null,
        }
    }
    async login() {
      const { email, password } = this.state;
try{

 await signin(email, password);
 
 //AsyncStorage
 try {
    await AsyncStorage.setItem('uid',firebase.auth().currentUser.uid)
  } catch (error) {
    Alert.alert('Error :',error.message)
  }
  
  Alert.alert('Logged in Succefully..')

  this.props.navigation.navigate('Users')
}
catch(e){
  Alert.alert(e.message)
}
  }

  async loginWithFacebook() {
    const {
      type,
      token,
      expires,
      permissions,
      declinedPermissions,
    } = await Facebook.logInWithReadPermissionsAsync('1432852876854768', {
      permissions: ['public_profile'],
    })


    if (type === 'success') {
      // Get the user's name using Facebook's Graph API
      const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
      const res = await response.json();
      console.log('res==>', res)
      try {
        var user = await facebooklogin(token);

        //AsyncStorage
        try {
          await AsyncStorage.setItem('uid',user.user.uid)
        } catch (error) {

          Alert.alert('Error :',error.message)
        }


        console.log('user ===>', user);
        console.log('user.uid ===>', user.user.uid);
        let name = await user.additionalUserInfo.profile.first_name +' ' + user.additionalUserInfo.profile.last_name
        await signup(`${user.user.uid}@gmail.com`,'nonenone',name);
        Alert.alert('Logged in!', `Hi ${(name)}!`);
        this.props.navigation.navigate('Users')
      } catch (e) {
        if(e.message == 'The email address is already in use by another account.'){
          await signin(`${user.user.uid}@gmail.com`,'nonenone')
          //AsyncStorage
 try {
  await AsyncStorage.setItem('uid',firebase.auth().currentUser.uid)
} catch (error) {
  Alert.alert('Error :',error.message)
}

Alert.alert('Logged in Succefully..')

this.props.navigation.navigate('Users')
          console.log('e ===>', e)
        }
      }
    } else {
      console.log('else',type)
    }
    console.log('result ===>', 'hhh');
  }

  async storeData_localStorage(uid){
    try {
      await AsyncStorage.setItem('uid',uid)
      
    } catch (error) {
      
    }
  }
  async componentDidMount(){
    try {
     let uid = await AsyncStorage.getItem('uid');
     if(uid){

       this.props.navigation.navigate('Users')
      }
    } catch (error) {
      
    }
  }

    render(){

        return (
          <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
             
                <Text style={styles.heading}>Sign In</Text>

              <View>
                <TextInput 
                style={styles.input}
                placeholder='Email '
                onChangeText={(text)=>this.setState({email:text})}
                />
                <TextInput
                style={styles.input}
                placeholder='Password'
                onChangeText={(text)=>this.setState({password:text})}
                />
               
              </View>

              <View>
                <TouchableOpacity onPress={()=>this.login()} >
                  <Text style={styles.button}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.loginWithFacebook()}} >
                  <Text style={styles.button1}>Facebook Login</Text>
                </TouchableOpacity>
              </View>
              <View>
               <Text> Do not have any account? </Text>
                  <TouchableOpacity onPress={()=>this.props.navigation.navigate('Signup')}>
                    <Text>Sign Up</Text>
                    </TouchableOpacity>
                   
              </View>
           
                </KeyboardAvoidingView>
  );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading:{
    fontSize:25,
    marginBottom:30,
  }
  ,input:{
    width:300,
    borderWidth:2,
    borderRadius:20,
    paddingLeft:10,
    padding:5,
    backgroundColor:'white',
    // color:'white',
    marginBottom:10,
    // backgroundColor:'#296'

  },
  button:{
    width:300,
    borderRadius:35,
    textAlign:'center',
    fontSize:20,
    backgroundColor:'orange',
    padding:5,
    marginTop:10,

  },
  button1:{
    width:300,
    borderRadius:35,
    textAlign:'center',
    fontSize:20,
    backgroundColor:'#3b5998',
    padding:5,
    marginTop:10,
    color:'white',

  }
});