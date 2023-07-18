import 'react-native-get-random-values';
import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { NavigationContainer } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Lists from './components/Lists';
import AddList from './components/AddList';
import List from "./components/List";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [list, setList] = useState('');
  const [lists, setLists] = useState([]);

  useEffect(() => { 
    AsyncStorage.getItem('data').then((data) => {
      if(data !== null) {
        setLists(JSON.parse(data));
      }
    }).catch((error) => {console.log(error)})
  }, []);

  function createNewList() {
    let newList = {};
    newList.id = nanoid();
    newList.products = [];
    newList.isEnabled = false;
    if(list.trim() !== '') {
      newList.title = list;
    } else {
      const D = new Date();
      const currentDate = ('0' + D.getDate()).slice(-2) + '.' + ('0' + (D.getMonth() + 1)).slice(-2) + '.' + D.getFullYear();
      const currentTime = D.getHours() + ":" + D.getMinutes() + ":" + D.getSeconds();
      newList.title = `${currentDate} - ${currentTime}`;
    }
    let newLists = [newList, ...lists];
    setLists(newLists);
    setList('');

    AsyncStorage.setItem('data', JSON.stringify(newLists)).then(() => {
      setLists(newLists);
    }).catch(error => console.log(error))

    return newList.id;
  }

  function deleteList(id) {
    let newLists = lists.filter((item) => item.id !== id);
    setLists(newLists);
    
    AsyncStorage.setItem('data', JSON.stringify(newLists)).then(() => {
      setLists(newLists);
    }).catch(error => console.log(error))
  }

  function changeProduct(newList) {
    let newLists = lists.map((item) => {
      if(item.id === newList.id) {
        return newList;
      }
      return item;
    });
    setLists(newLists);

    AsyncStorage.setItem('data', JSON.stringify(newLists)).then(() => {
      setLists(newLists);
    }).catch(error => console.log(error))
  }

  function renameList(newLists) {
    setLists(newLists);

    AsyncStorage.setItem('data', JSON.stringify(newLists)).then(() => {
      setLists(newLists);
    }).catch(error => console.log(error))
  }

  function clearAllLists() {
    setLists([]);
    AsyncStorage.setItem('data', JSON.stringify([])).then(() => {
      setLists([]);
    }).catch(error => console.log(error))
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Lists">
          {props => <Lists {...props} lists={lists} setLists={setLists} list={list} setList={setList} deleteList={deleteList} renameList={renameList} clearAllLists={clearAllLists} />}
        </Stack.Screen>

        <Stack.Screen name="AddList"> 
          {props => <AddList {...props} list={list} setList={setList} createNewList={createNewList} />}
        </Stack.Screen>

        <Stack.Screen name="List" options={({ navigation }) => ({ headerLeft: () => <HeaderBackButton onPress={() => { navigation.navigate('Lists') }}/> })}> 
          {props => <List {...props} lists={lists} changeProduct={changeProduct} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}