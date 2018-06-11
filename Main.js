import React, { Component } from 'react';
import {StyleSheet, Text, View, TextInput, Button, Picker, DatePickerAndroid} from "react-native";

var getCurrentDate = function(){
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    let zero = "0"
    if(month >= 10) zero = "";
    return "" + year + "-" + zero + month + "-" + day;
}

var getDateUnix = function(date){
    return (new Date(date)).getTime() / 1000;
}

var flavourTextSad = ["Yikes.", "Better luck next time!", "Guess you didn't hop on the bandwagon fast enough...", "Hopefully you still have a job..", "It's bound to go back up!"];
var flavourTextNeutral = ["Not bad, not great.", "It could be worse.", "It'll explode in no time!", "It could be better.", "Just keep on waiting..."];
var flavourTextHappy = ["You're rich!", "You're crazy for holding that long ... but congrats!", "You should probably sell quick!", "Well, time to quit your job.", "Lucky!"];

var getFlavourText = function(investedMoney, currentPrice, purchasePrice){
    var flavourText;
    var randomNum = Math.floor(Math.random() * 5);
    if(investedMoney === 0){
        flavourText = "";    
    }else if(currentPrice/purchasePrice >= 100){
        flavourText = flavourTextHappy[randomNum];
    }else if(currentPrice/purchasePrice < 1){
        flavourText = flavourTextSad[randomNum];
    }else{
        flavourText = flavourTextNeutral[randomNum];
    }
    return flavourText;
}

var dateStrToNum = function(date){
    return [parseInt(date.substring(0, 4)), parseInt(date.substring(5,7)) - 1, parseInt(date.substring(8))];
}

export default class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
            investedMoney: 0,
            cryptoCurr: "BTC",
            minDate: "2010-08-17",
            currentDate: getCurrentDate(new Date()),
            currentPrice: 0,
            purchaseDate: "2010-08-17",
            purchasePrice: 0,
            status: "Fetch Data",
            flavourText: "\n"
        }
        this.submitData = this.submitData.bind(this);
        this.updateDateRange = this.updateDateRange.bind(this);
    }

    async selectDate(minDate, purchaseDate){
        try{
            purchaseDate = dateStrToNum(purchaseDate);
            minDate = dateStrToNum(minDate);
            const {action, year, month, day} = await DatePickerAndroid.open({
                date: new Date(...purchaseDate),
                minDate: new Date(...minDate),
                maxDate: new Date(),
                mode: "default"
            });
            console.log()
            if(action !== DatePickerAndroid.dismissedAction) return {year, month: month + 1, day};
        } catch ({code, message}) {
            console.warn("Could not open picker: " + message);
        }
    }
    
    submitData(){
        this.setState({
            ...this.state, 
            status: "Fetching..."
        });
        var purchaseDate = this.state.purchaseDate;
        var cryptoCurr = this.state.cryptoCurr;
        var purchasePrice, oldURL, currentURL;
        oldURL = "https://min-api.cryptocompare.com/data/pricehistorical?fsym=" + cryptoCurr + "&tsyms=USD&ts=" + getDateUnix(purchaseDate);
        currentURL = "https://min-api.cryptocompare.com/data/pricehistorical?fsym=" + cryptoCurr + "&tsyms=USD&ts=" + Date.now();
        fetch(oldURL)
        .then((res) => res.json())
        .then((data) => {
            purchasePrice = parseFloat(data[cryptoCurr]["USD"], 10);
            fetch(currentURL)
            .then((res) => res.json())
            .then((data) => {
                var currentPrice = parseFloat(data[cryptoCurr]["USD"], 10);
                this.setState({
                    currentPrice: currentPrice,
                    purchasePrice: purchasePrice,
                    status: "Fetch Data",
                    flavourText: getFlavourText(this.state.investedMoney, currentPrice, purchasePrice)
                });
            });
        });
    }
    
    updateDateRange(itemValue){
        var newMin;
         if(itemValue === "ADA"){
            newMin = "2017-10-01";
        }else if(itemValue === "BTC"){
            newMin = "2010-08-17";
        }else if(itemValue === "BCH"){
            newMin = "2017-08-01";
        }else if(itemValue === "DASH"){
            newMin = "2014-02-03";
        }else if(itemValue === "DOGE"){
            newMin = "2015-12-06";
        }else if(itemValue === "ETH"){
            newMin = "2015-09-01";
        }else if(itemValue === "LTC"){
            newMin = "2013-09-29";
        }else if(itemValue === "NEO"){
            newMin = "2016-09-07";
        }else if(itemValue === "XRP"){
            newMin = "2015-02-01";
        }
        this.setState({
            minDate: newMin,
            cryptoCurr: itemValue,
            purchaseDate: newMin,
            purchasePrice: 0,
            currentPrice: 0
        });
    }
    
    render() {
        var amountMade = (this.state.investedMoney / this.state.purchasePrice * this.state.currentPrice) || 0;
        var rounding = 2;
        if(this.state.cryptoCurr === "XRP" || this.state.cryptoCurr === "ADA" ) rounding = 4;
        if(this.state.cryptoCurr === "DOGE") rounding = 6;
        return (
            <View style={styles.widget}>
                <View backgroundColor="#888">
                    <Text style={styles.title}>What if you... </Text>
                </View>
                <View backgroundColor="#222" paddingTop={3}>
                    <Text style={styles.labels}>Put ($USD)</Text>
                    <TextInput style={{color: "white", backgroundColor:"#222", marginLeft: 8, fontSize: 18}} 
                        keyboardType="numeric" value={ "" + this.state.investedMoney} 
                        onChangeText={(itemValue) => {
                            if(itemValue.length < 1 || parseInt(itemValue) == NaN) itemValue = 0;
                            this.setState({investedMoney: parseInt(itemValue)});
                        }} />
                    <Text style={styles.labels}>Into</Text>
                    <Picker style={{color: "white"}} fontSize={20}
                        selectedValue={this.state.cryptoCurr} onValueChange={this.updateDateRange}>
                        <Picker.Item value="BTC" label="Bitcoin (BTC)"/>
                        <Picker.Item value="BCH" label="Bitcoin Cash (BCH)"/>
                        <Picker.Item value="ADA" label="Cardano (ADA)"/>
                        <Picker.Item value="DASH" label="Dash (DASH)"/>
                        <Picker.Item value="DOGE" label="Dogecoin (DOGE)"/>
                        <Picker.Item value="ETH" label="Ethereum (ETH)"/>
                        <Picker.Item value="LTC" label="Litecoin (LTC)"/>
                        <Picker.Item value="NEO" label="NEO (NEO)"/>
                        <Picker.Item value="XRP" label="Ripple (XRP)" />  
                    </Picker>
                    <Text style={styles.labels}>On</Text>
                    <View style={{flexDirection: "row", marginBottom: 8}}>
                        <Text style={{fontSize: 18, marginLeft: 8, color: "white"}}>{this.state.purchaseDate}</Text>
                        <View flex={1} flexDirection="row" justifyContent="flex-end">
                            <Button 
                            onPress={() => {
                                promise = this.selectDate(this.state.minDate, this.state.purchaseDate);
                                promise.then((date) => {
                                    if(date.month < 10) date.month = "0" + ("" + date.month);
                                    if(date.day < 10) date.day = "0" + ("" + date.day);
                                    this.setState({purchaseDate: `${date.year}-${date.month}-${date.day}`});
                                });
                            }} 
                            title={"Select Date"}
                            />
                        </View>
                    </View>
                    <Button style={{marginBottom:10, marginLeft: 20, marginRight: 20}} 
                        onPress={this.submitData} title={this.state.status}/>
                    <Text style={styles.text}>
                        It costed ${this.state.purchasePrice.toFixed(rounding)} for 1 {this.state.cryptoCurr}
                    </Text>
                    <Text style={styles.text}>
                        It is now ${this.state.currentPrice.toFixed(rounding)} for 1 {this.state.cryptoCurr}
                    </Text>
                    <Text style={styles.text}>
                        You currently have ${amountMade.toFixed(rounding)} worth of {this.state.cryptoCurr}
                    </Text>
                    <Text style={styles.text}>
                        {this.state.flavourText}
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        marginLeft: 5,
        color: "white"
    },
    labels: {
        fontSize: 20,
        marginLeft: 5,
        color: "#888"
    },
    text: {
        fontSize: 18,
        marginLeft: 5,
        color: "white"
    },
    widget: {
        marginLeft: 8,
        marginRight: 8,
        marginBottom: 20
    }
});