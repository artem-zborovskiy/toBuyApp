import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import Dialog from "react-native-dialog";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, Switch } from 'react-native';
const globalStyles = require('../styles');
import Icon from 'react-native-vector-icons/FontAwesome';

const List = ({ navigation, route, ...props }) => {
    const { id } = route.params;
    let currentList = props.lists.find(item => {
        return item.id === id;
    });

    const [product, setProduct] = useState('');
    const [isEnabled, setIsEnabled] = useState(currentList.isEnabled);
    const [visible, setVisible] = useState(false);
    const [newName, setNewName] = useState('');
    const [activeId, setActiveId] = useState('');

    const toggleSwitch = () => {
        currentList.isEnabled = !currentList.isEnabled;
        props.changeProduct(currentList);

        setIsEnabled(previousState => !previousState);
    }

    useEffect(() => {   
        navigation.setOptions({ title: currentList.title });
    }, [])

    const pressHandler = () => {
        if(product.trim()) {
            onSubmit(product);
            setProduct('');
        } else {
            Alert.alert('Error!', 'Product name cannot be empty');
            setProduct('');
        }
    }

    const onSubmit = (product) => {
        const newProduct = {
            id: nanoid(),
            name: product,
            status: false
        }

        currentList.products ? currentList.products = [newProduct, ...currentList.products] : currentList.products = [newProduct];
        props.changeProduct(currentList);
    }

    const deleteProduct = (id) => {
        Alert.alert(
            'Are you sure you want to delete this product?', 
            'This action cannot be undone', 
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => {return}
              }, 
              {
                text: 'Delete',
                onPress: () => {
                    currentList.products = currentList.products.filter((item) => item.id !== id);
                    props.changeProduct(currentList);
                }
              }
            ]
        );
    }

    const toggleStatus = (id) => {
        currentList.products = currentList.products.map((item) => {
            if(item.id === id) {
                item.status = !item.status;
            }
            return item;
        });
        props.changeProduct(currentList);
    }

    const updatePrice = (price, id) => {
        currentList.products = currentList.products.map((item) => {
            if(item.id === id) {
                item.price = price;
            }
            return item;
        });
        props.changeProduct(currentList);
    }

    const updateQuantity = (quantity, id) => {
        currentList.products = currentList.products.map((item) => {
            if(item.id === id) {
                item.quantity = quantity;
            }
            return item;
        });
        props.changeProduct(currentList);
    }

    const handleRename = (id) => {
        setVisible(true);
        setActiveId(id);
    }

    const updateName = () => {
        currentList.products = currentList.products.map((item) => {
            if(item.id === activeId) {
                item.name = newName;
            }
            return item;
        });
        setNewName('');
        setActiveId('');
        props.changeProduct(currentList);
    }

    const clearAllProductsHandler = () => {
        Alert.alert(
            'Are you sure you want to delete all products?', 
            'This action cannot be undone', 
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => {return}
              }, 
              {
                text: 'Delete',
                onPress: () => {
                    currentList.products = [];
                    props.changeProduct(currentList);
                }
              }
            ]
        );
    }

    function whatShow(price, quantity) {
        if(price && price !== 0 && !isNaN(price)) {
            if(quantity && price !== 0 && !isNaN(price)) {
                const total = price * quantity;
                return Math.floor(total * 100) / 100;
            } else {
                return price;
            }
        } else {
            return 0;
        }
    }

    function totalPrice() {
        if(currentList.products) {
            const total = currentList.products.reduce((acc, item) => {
                return acc + Number(whatShow(item.price, item.quantity));
            }, 0);
            return total.toFixed(2);
        } else {
            return 0;
        }
    }

    return(
        <View style={globalStyles.container}>
            <Dialog.Container visible={visible}>
                <Dialog.Title style={{color: 'black'}}>Product new name</Dialog.Title>

                <Dialog.Input 
                    placeholder='Enter product name' 
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

            <View>
                <View style={styles.header}>
                    <TextInput
                        style={styles.input}
                        placeholder='Enter list name'
                        autoCorrect={false}
                        value={product}
                        onChangeText={setProduct}
                    />

                    <TouchableOpacity style={[globalStyles.btnBlack, {width: '30%'}]} onPress={pressHandler}>
                        <Text style={globalStyles.btnBlackText}>Add</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.listInfo}>
                    <View style={styles.listInfoTop}>
                        <Switch
                            trackColor={{ false: "black", true: "black" }}
                            thumbColor={isEnabled ? "#50c878" : "#f4f3f4"}
                            ios_backgroundColor="black"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />

                        <Text style={isEnabled ? globalStyles.titleBlack : {display: 'none'}}>Total: {totalPrice()}$</Text>

                        <TouchableOpacity style={globalStyles.btnRed} onPress={clearAllProductsHandler}> 
                            <Icon name="ban" size={30} color={"#fff"} />
                        </TouchableOpacity>
                    </View>
                    <View style={globalStyles.devider}/>
                </View>
            </View>
            
            <ScrollView contentContainerStyle={{ alignItems: 'center' }} style={globalStyles.section} showsVerticalScrollIndicator={false}>
                {currentList.products.length === 0 ? <Text>No products yet</Text> : currentList.products.map((item, index) => 
                    <TouchableOpacity onLongPress={() => {toggleStatus(item.id)}} style={[index === currentList.products.length  - 1 ? globalStyles.itemBlock : [globalStyles.itemBlock, { marginBottom: 10 }], item.status ? styles.completed : '']} key={item.id}>
                        <View style={globalStyles.itemHeader}>
                            <Text style={globalStyles.titleWhite}>{currentList.products.length - index}) {item.name.length > 21 ? item.name.slice(0, 20) + '...' : item.name}</Text>

                            <View style={globalStyles.itemDetails}>
                                <TouchableOpacity style={globalStyles.btnBlue} onPress={() => {handleRename(item.id)}}>
                                    <Icon name="pencil" size={30} color={"#fff"} />
                                </TouchableOpacity>

                                <TouchableOpacity style={[globalStyles.btnRed, {marginLeft: 15}]} onPress={() => {deleteProduct(item.id)}}>
                                    <Icon name="remove" size={30} color={"#fff"} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        <View style={isEnabled ? styles.productDetails : {display: 'none'}}>
                            <View style={styles.productDetails}>
                                <TextInput
                                    style={globalStyles.inputWhite}
                                    placeholder='price'
                                    autoCorrect={false}
                                    cursorColor='black'
                                    value={item.price}
                                    onChangeText={(price) => updatePrice(price, item.id)}
                                    keyboardType={"number-pad"}
                                    maxLength={5}
                                />

                                <Icon style={styles.priceItem} name="times" size={30} color={"#fff"} />

                                <TextInput
                                    style={globalStyles.inputWhite}
                                    placeholder='quan'
                                    autoCorrect={false}
                                    cursorColor='black'
                                    value={item.quantity}
                                    onChangeText={(quantity) => updateQuantity(quantity, item.id)}
                                    keyboardType={"number-pad"}
                                    maxLength={5}
                                />

                                <Text style={styles.priceItem}>=</Text>
                            </View>
                            
                            <Text style={styles.priceItem}>{whatShow(item.price, item.quantity) + '$'}</Text>
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
    input: {
        width: '50%',
        paddingVertical: 10,
        borderStyle: 'solid',
        borderBottomWidth: 2,
        borderColor: 'black',
    },
    completed: {
        backgroundColor: '#50c878'
    },
    productDetails: {
        display: 'flex',
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceItem: {
        color: 'white',
        fontWeight: '700',
        fontSize: 18
    },
    listInfo: {
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    listInfoTop: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    }
});

export default List;