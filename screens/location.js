import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet,Dimensions } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapView, {
    Marker,
    AnimatedRegion,
  } from 'react-native-maps';
  import { sendMessage } from '../config/firebase'
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class App extends Component {
  state = {
    location: null,
    errorMessage: null,
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };


  //==================================================SHARE LOCATION=========================================================\\
  share_location= async ()=>{
    let location = { latitude: this.state.location.coords.latitude,
      longitude: this.state.location.coords.longitude}
       let { navigation } = this.props;
  let room_id = navigation.getParam('room_id','no_id');

      sendMessage(room_id,{location})

  }

  //======================================================END================================================================\\
  render() {
    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }
    
const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

    return (
        
        this.state.location
        ?
        <View style={{flex: 0.5}}>

        <MapView
        style={{width:"100%",height:300}}
        
        initialRegion={{
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
            
        }}
        >
          <Marker
           
           coordinate={{
               latitude: this.state.location.coords.latitude,
               longitude: this.state.location.coords.longitude
            }}
            />

        </MapView>
      
        <TouchableOpacity  style={{width:120,height:50,backgroundColor:'lightgray',margin:5,alignSelf:'center',alignItems:'center',justifyContent:'center'}} onPress={()=>{this.share_location()}}>
          <Text>Share</Text>
        </TouchableOpacity>
<TouchableOpacity style={{width:120,height:50,backgroundColor:'lightgray',margin:5,alignSelf:'center',alignItems:'center',justifyContent:'center'}} onPress={()=>{this.props.navigation.navigate('Chat')}}>

        <Text  >Back</Text>
</TouchableOpacity>
       
            </View>
        :
              <View style={styles.container}>
                <Text style={styles.paragraph}>{text}</Text>
            
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});