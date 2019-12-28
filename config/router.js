import React from "react";
import * as Routes from './index'
import { createStackNavigator, createAppContainer,createBottomTabNavigator,createDrawerNavigator } from "react-navigation";


const AppNavigator = createStackNavigator({
  Signin:{screen: Routes.Signin,},
  Users:{screen: Routes.Users,},
  Chat:{screen:Routes.Chat},
  Signup:{screen:Routes.Signup,},
  Audio:{screen:Routes.Audio},
  ImagePicker:{screen:Routes.Img},
  Location:{screen:Routes.Location},
  Status:{screen:Routes.Status},
  ShowStatus:{screen:Routes.ShowStatus},
  
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
 }
);

export default createAppContainer(AppNavigator);