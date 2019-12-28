import React ,{Component} from 'react'
import { View, Text, TouchableOpacity,StyleSheet,Image,ScrollView,Alert,Button,AsyncStorage } from 'react-native'
import { Ionicons,AntDesign,FontAwesome,Entypo} from '@expo/vector-icons';
import firebase, { getUsers, createRoom, signout } from '../config/firebase'
export default class Users extends Component{
    constructor(){
        super();
        this.state={
            users:[],

    }
}
componentDidMount(){

    this.users()
    
}

async users(){
    let users = await getUsers()
    this.setState({users})
}
async startChat(friendId,name){
    try{
        let room = await createRoom(friendId);
        // console.log('room===>',room);
        this.props.navigation.navigate('Chat',{
            'room_id':room._id,name,
        })
    }catch(e){
        alert.alert('error',e.message)

    }
}

async logOut(){
    try {
        
        await signout().then(()=>{
         try {
             
          AsyncStorage.removeItem('uid')
         this.props.navigation.navigate('Signin')
         } catch (error) {
             
         }
       })
    } catch (error) {
        Alert.alert('Error : ', error.message)
    }
   
}

    render(){
        let { users } = this.state;
        // console.log('users>>',users);
        
        return(
            <ScrollView  style={styles.container}>
                <View style={{flexDirection:'row',width:'100%',height:50,justifyContent:'space-around',alignContent:'center',backgroundColor:'#fffde7'}}>
                {

firebase.auth().currentUser &&   users.map((val,ind)=>{
       if(val._id === firebase.auth().currentUser.uid ){

           return<TouchableOpacity  key={ind} style={styles.bItems} >
<Image
style={styles.image}
source={{uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3ag28ODXXYsmpNSwDenT5ayiQkjtRzNyfhpMoeQc_DX4u3KqV1A"}}
/>
<Text style={{textAlign:'center',margin:10}}>{val.name} </Text>

</TouchableOpacity>
}
})
}
<TouchableOpacity 
style={{alignSelf:'center',color:'green'}}
onPress={()=>this.props.navigation.navigate('Status')}>
<Text style={{alignSelf:'center',color:'green'}}>Status</Text>
</TouchableOpacity>

<TouchableOpacity 
style={{alignSelf:'center',color:'red'}}
onPress={()=>this.logOut()}>
<AntDesign name='logout'size={32}  style={{alignSelf:'center',color:'red'}}/>
</TouchableOpacity>


</View>
{/* Favourite List */}
                <View>
                    <Text style={{textAlign:'center',backgroundColor:'lightgray',padding:5}}>Favourites</Text>
                    <View style={styles.list} >

                <TouchableOpacity style={styles.favItems} >
                    <Image
                    style={styles.image}
                    source={{uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3ag28ODXXYsmpNSwDenT5ayiQkjtRzNyfhpMoeQc_DX4u3KqV1A"}}
                    />
                    <Text>Aijaz Abbasi </Text>
                    
                </TouchableOpacity>

                <TouchableOpacity style={styles.favItems} >
                    <Image
                    style={styles.image}
                    source={{uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3ag28ODXXYsmpNSwDenT5ayiQkjtRzNyfhpMoeQc_DX4u3KqV1A"}}
                    />
                    <Text>Aijaz Abbasi </Text>
                    
                </TouchableOpacity>
                <TouchableOpacity style={styles.favItems} >
                    <Image
                    style={styles.image}
                    source={{uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3ag28ODXXYsmpNSwDenT5ayiQkjtRzNyfhpMoeQc_DX4u3KqV1A"}}
                    />
                    <Text>Aijaz Abbasi </Text> 
                </TouchableOpacity>
                    </View>
                </View>

{/* BirthDay list */}

                <View>
                    <Text style={{textAlign:'center',backgroundColor:'lightgray',padding:5}}>BirthDays</Text>
                    <View style={styles.blist} >

                <TouchableOpacity style={styles.bItems} >
                    <Image
                    style={styles.image}
                    source={{uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3ag28ODXXYsmpNSwDenT5ayiQkjtRzNyfhpMoeQc_DX4u3KqV1A"}}
                    />
                    <Text style={{textAlign:'center',margin:10}}>Aijaz Abbasi </Text>
                    
                </TouchableOpacity>
                <TouchableOpacity style={styles.bItems} >
                    <Image
                    style={styles.image}
                    source={{uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3ag28ODXXYsmpNSwDenT5ayiQkjtRzNyfhpMoeQc_DX4u3KqV1A"}}
                    />
                    <Text  style={{textAlign:'center',margin:10}}>Aijaz Abbasi </Text> 
                </TouchableOpacity>
                    </View>
                </View>

{/* online */}


<View>
                    <Text style={{backgroundColor:'lightgray',padding:5}}>Online</Text>
                    <View style={styles.blist} >
                        {

                         firebase.auth().currentUser &&   users.map((val,ind)=>{
                                if(val._id != firebase.auth().currentUser.uid ){

                                    return<TouchableOpacity onPress={()=>this.startChat(val._id,val.name)} key={ind} style={styles.bItems} >
                    <Image
                    style={styles.image}
                    source={{uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3ag28ODXXYsmpNSwDenT5ayiQkjtRzNyfhpMoeQc_DX4u3KqV1A"}}
                    />
                    <Text style={{textAlign:'center',margin:10}}>{val.name} </Text>
                    
                </TouchableOpacity>
                }
                })
                }

             
                    </View>
                </View>




                



            </ScrollView>
        )
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