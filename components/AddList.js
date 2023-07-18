import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
const globalStyles = require('../styles');

const AddList = ({ navigation, ...props }) => {
    return(
        <View style={[globalStyles.container, styles.section]}>
            <TextInput
                autoFocus={true}
                style={globalStyles.input}
                placeholder='Enter list title'
                autoCorrect={false}
                cursorColor='black'
                value={props.list}
                onChangeText={(text) => props.setList(text)}
            />

            <TouchableOpacity style={globalStyles.btnBlack} onPress={() => {
                    let id = props.createNewList();
                    navigation.navigate('List', {id: id});
            }}> 
                <Text style={globalStyles.btnBlackText}>Add list +</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    section: {
        alignItems: 'center'
    }
});

export default AddList;