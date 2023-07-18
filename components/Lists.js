import React, {useState} from "react";
import Dialog from "react-native-dialog";
import { Text, View, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
const globalStyles = require('../styles');
import Icon from 'react-native-vector-icons/FontAwesome';

const Lists = ({ navigation, ...props }) => {
    const [visible, setVisible] = useState(false);
    const [newName, setNewName] = useState('');
    const [activeId, setActiveId] = useState('');

    function handleDelete(id) {
        Alert.alert(
            'Are you sure you want to delete this list?', 
            'This action cannot be undone', 
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => {return}
              }, 
              {
                text: 'Delete',
                onPress: () => {props.deleteList(id)}
              }
            ]
        );
    }

    const getStatus = (products) => {
        const completed = products.filter((item) => item.status).length;
        return `${completed} / ${products.length}`;
    }

    const getPercentage = (products) => {
        const completed = products.filter((item) => item.status).length;
        const percentage = completed / products.length * 100;
        if(isNaN(percentage)) {
            return 0;
        } else {
            return percentage;
        }
    }

    const handleRename = (id) => {
        setVisible(true);
        setActiveId(id);
    }

    const updateName = () => {
        let lists = props.lists.map((item) => {
            if(item.id === activeId) {
                item.title = newName;
            }
            return item;
        });
        setNewName('');
        setActiveId('');
        props.renameList(lists);
    }

    const clearAllListsHandle = () => {
        Alert.alert(
            'Are you sure you want to delete all lists?', 
            'This action cannot be undone', 
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => {return}
              }, 
              {
                text: 'Delete',
                onPress: () => {props.clearAllLists()}
              }
            ]
        );
    }

    return(
        <View style={globalStyles.container}>
            <Dialog.Container visible={visible}>
                <Dialog.Title style={{color: 'black'}}>List new name</Dialog.Title>

                <Dialog.Input 
                    placeholder='Enter list name' 
                    autoCorrect={false}
                    value={newName}
                    onChangeText={setNewName}
                    style={{color: 'black'}}
                />

                <Dialog.Button label="Cancel" onPress={() => {
                    setVisible(false);
                    setNewName('');
                }} />
                <Dialog.Button label="Confirm" onPress={() => {
                    updateName();
                    setVisible(false);
                    setNewName('');
                }} />
            </Dialog.Container>

            <View style={styles.header}>
                <TouchableOpacity style={globalStyles.btnBlack} onPress={() => {navigation.navigate('AddList')}}> 
                    <Text style={globalStyles.btnBlackText}>Add list +</Text>
                </TouchableOpacity>

                <TouchableOpacity style={globalStyles.btnRed} onPress={clearAllListsHandle}> 
                    <Icon name="ban" size={30} color={"#fff"} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ alignItems: 'center' }} style={globalStyles.section} showsVerticalScrollIndicator={false}>
                {props.lists.length === 0 ? <Text>No lists yet</Text> : props.lists.map((item, index) => 
                    <TouchableOpacity onPress={() => {navigation.navigate('List', {id: item.id})}} style={index === props.lists.length  - 1 ? globalStyles.itemBlock : [globalStyles.itemBlock, { marginBottom: 10 }]} key={item.id}>
                        <View style={globalStyles.itemHeader}>
                            <Text style={globalStyles.titleWhite}>{props.lists.length - index}) {item.title.length > 21 ? item.title.slice(0, 20) + '...' : item.title}</Text>

                            <View style={globalStyles.itemDetails}>
                                <TouchableOpacity style={globalStyles.btnBlue} onPress={() => {handleRename(item.id)}}>
                                    <Icon name="pencil" size={30} color={"#fff"} />
                                </TouchableOpacity>

                                <TouchableOpacity style={[globalStyles.btnRed, {marginLeft: 15}]} onPress={() => {handleDelete(item.id)}}>
                                    <Icon name="remove" size={30} color={"#fff"} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.progressBlock}>
                            <Text style={[globalStyles.titleWhite, {marginRight: 10}]}>{`${item.products ? getStatus(item.products) : 'no data'}`}</Text>
                            <View style={styles.progress}>
                                <View style={[styles.progressInner, item.products ? {width: `${getPercentage(item.products)}%`} : {width: 0}]}></View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({ 
    header: {
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10
    },
    progressBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignSelf: 'center',
        width: '100%'
    },
    progress: {
        width: '80%',
        height: 20,
        borderRadius: 30,
        backgroundColor: 'white',
    },
    progressInner: {
        height: '100%',
        borderRadius: 30,
        width: '20%',
        backgroundColor: '#50c878',
    }
});

export default Lists;