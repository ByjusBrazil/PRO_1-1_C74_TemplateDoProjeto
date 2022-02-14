import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList
} from "react-native";
import { Avatar, ListItem, Icon } from "react-native-elements";
import firebase from "firebase";
import db from "../config";

export default class RideHistoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allTransactions: [],
      lastVisibleTransaction: null,
      searchText: ""
    };
  }
  componentDidMount = async () => {
    this.getTransactions();
  };

  getTransactions = () => {
    db.collection("transactions")
      .limit(10)
      .get()
      .then(snapshot => {
        snapshot.docs.map(doc => {
          this.setState({
            allTransactions: [...this.state.allTransactions, doc.data()],
            lastVisibleTransaction: doc
          });
        });
      });
  };

  handleSearch = async bikeId => {
    bikeId = bikeId.toUpperCase().trim();
    this.setState({
      allTransactions: []
    });
    if (!bikeId) {
      this.getTransactions();
    }

    db.collection("transactions")
      .where("bike_id", "==", bikeId)
      .get()
      .then(snapshot => {
        snapshot.docs.map(doc => {
          this.setState({
            allTransactions: [...this.state.allTransactions, doc.data()],
            lastVisibleTransaction: doc
          });
        });
      });
  };

  fetchMoreTransactions = async bikeId => {
    bikeId = bikeId.toUpperCase().trim();

    const { lastVisibleTransaction, allTransactions } = this.state;
    const query = await db
      .collection("transactions")
      .where("bike_id", "==", bikeId)
      .startAfter(lastVisibleTransaction)
      .limit(10)
      .get();
    query.docs.map(doc => {
      this.setState({
        allTransactions: [...this.state.allTransactions, doc.data()],
        lastVisibleTransaction: doc
      });
    });
  };

  renderItem = ({ item, i }) => {
    var date = item.date
      .toDate()
      .toString()
      .split(" ")
      .splice(0, 4)
      .join(" ");
    
    var transactionType =
      item.transaction_type === "rented" ? "alugada" : "retornada";
    return (
      <View style={{ borderWidth: 1 }}>
        <ListItem key={i} bottomDivider>
          <Icon type={"ionicon"} name={"bicycle"} size={40} />
          <ListItem.Content>
            <ListItem.Title style={styles.title}>
              {`${item.bike_type} ( ${item.bike_id} )`}
            </ListItem.Title>
            <ListItem.Subtitle style={styles.subtitle}>
              {`Essa bicicleta foi ${transactionType} por você.`}
            </ListItem.Subtitle>
            <View style={styles.lowerLeftContaiiner}>
              <View style={styles.transactionContainer}>
                <Text
                  style={[
                    styles.transactionText,
                    {
                      color:
                        item.transaction_type === "rented"
                          ? "#78D304"
                          : "#0364F4"
                    }
                  ]}
                >
                  {item.transaction_type.charAt(0).toUpperCase() +
                    item.transaction_type.slice(1)}
                </Text>
                <Icon
                  type={"ionicon"}
                  name={
                    item.transaction_type === "rented"
                      ? "checkmark-circle-outline"
                      : "arrow-redo-circle-outline"
                  }
                  color={
                    item.transaction_type === "rented" ? "#78D304" : "#0364F4"
                  }
                />
              </View>
              <Text style={styles.date}>{date}</Text>
            </View>
          </ListItem.Content>
        </ListItem>
      </View>
    );
  };

  render() {
    const { searchText, allTransactions } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.upperContainer}>
          <View style={styles.textinputContainer}>
            <TextInput
              style={styles.textinput}
              onChangeText={text => this.setState({ searchText: text })}
              placeholder={"Digite aqui"}
              placeholderTextColor={"#FFFFFF"}
            />
            <TouchableOpacity
              style={styles.scanbutton}
              onPress={() => this.handleSearch(searchText)}
            >
              <Text style={styles.scanbuttonText}>Pesquisar</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.lowerContainer}>

          {/* 
          <FlatList
            data={allTransactions}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={() => this.fetchMoreTransactions(searchText)}
            onEndReachedThreshold={0.7}
          />
          */}

           {/* 
          <FlatList
            data=allTransactions
            renderItem=this.renderItem
            keyExtractor={(item, index) => index.toString()}
            onEndReached={() => this.fetchMoreTransactions(searchText)}
            onEndReachedThreshold={0.7}
          />
          */}

           {/* 
          <FlatList
            data:{allTransactions}
            renderItem:{this.renderItem}
            keyExtractor:{(item, index) => index.toString()}
            onEndReached:{() => this.fetchMoreTransactions(searchText)}
            onEndReachedThreshold={0.7}
          />
          */}

           {/* 
          <FlatList
            data={"allTransactions"}
            renderItem={"this.renderItem"}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={() => this.fetchMoreTransactions(searchText)}
            onEndReachedThreshold={0.7}
          />
          */}

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D0E6F0"
  },
  upperContainer: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center"
  },
  textinputContainer: {
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "#4C5D70",
    borderColor: "#4C5D70"
  },
  textinput: {
    width: "57%",
    height: 50,
    padding: 10,
    borderColor: "#4C5D70",
    borderRadius: 10,
    borderWidth: 3,
    fontSize: 18,
    backgroundColor: "#F88379",
    fontFamily: "Rajdhani_600SemiBold",
    color: "#FFFFFF"
  },
  scanbutton: {
    width: 100,
    height: 50,
    backgroundColor: "#FBE5C0",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  scanbuttonText: {
    fontSize: 20,
    color: "#4C5D70",
    fontFamily: "Rajdhani_600SemiBold"
  },
  lowerContainer: {
    flex: 0.8,
    backgroundColor: "#FBE5C0"
  },
  title: {
    fontSize: 20,
    fontFamily: "Rajdhani_600SemiBold"
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Rajdhani_600SemiBold"
  },
  lowerLeftContaiiner: {
    alignSelf: "flex-end",
    marginTop: -40
  },
  transactionContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  transactionText: {
    fontSize: 20,
    fontFamily: "Rajdhani_600SemiBold"
  },
  date: {
    fontSize: 12,
    fontFamily: "Rajdhani_600SemiBold",
    paddingTop: 5
  }
});
