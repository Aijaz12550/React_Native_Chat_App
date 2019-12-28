import React from 'react';
import { StyleSheet, Text, View, TextInput,Alert, Button, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import { signup} from '../config/firebase'
export default class Signup extends React.Component {
    constructor(){
        super();
        this.state={
          email:null,password:null,confirm_password:null,name:null,
        }
    }
    async register(){
      let { email, password, name } = this.state;
      try{
        await signup(email,password,name);
        Alert.alert('succes');
        
      }
      catch(e){
        Alert.alert(e.message)

      }
    }

    render(){

        return (
          <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
             
                <Text style={styles.heading}>Sign up</Text>

              <View>
              <TextInput 
                style={styles.input}
                placeholder='Name '
                onChangeText={(text)=>this.setState({name:text})}
                />
                <TextInput 
                style={styles.input}
                placeholder='Email '
                onChangeText={(text)=>this.setState({email:text})}
                />
                <TextInput
                type='password'
                style={styles.input}
                placeholder='Password'
                onChangeText={(text)=>this.setState({password:text})}
                />
                <TextInput
                style={styles.input}
                placeholder='Confirm Password'
                />
              </View>

              <View>
                <TouchableOpacity onPress={()=>this.register()} >
                  <Text style={styles.button}>Submit</Text>
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

  }
});