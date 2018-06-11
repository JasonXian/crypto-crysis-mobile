import React, { Component } from 'react';
import Main from "./Main";
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        numMain: 1
    }
  }

  render() {
    var mainComponents = [];
    for(let i = 0; i < this.state.numMain; i++){
      mainComponents.push(
        <Main key={i}/>
      );
    }
    return (
      <View style={{flex: 1, flexDirection: "column", backgroundColor: "#060606"}}>
        <View style={{height: 130, alignItems: "center"}}>
          <Text style={styles.title}>Crypto Crysis</Text>
          <View style={{flexDirection: "row", justifyContent: "space-between"}}>
            <Button color="#77b300"
              onPress={() => {this.setState({numMain: this.state.numMain+1})}}
              title="Add Widget"
            />
            <View flex={0.15}/>
            <Button color="#c00"
              onPress={() => {if(this.state.numMain > 1) this.setState({numMain: this.state.numMain-1})}}
              title="Remove Widget"
            />
          </View>
        </View>
        <ScrollView>
          {mainComponents}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title : {
    marginTop: 20,
    marginBottom: 5,
    fontSize: 40,
    color: "white"
  }
});
