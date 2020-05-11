import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Dimensions
} from 'react-native';
import {fetchAction} from '../actions/actions'
import {connect} from 'react-redux'

class Home extends Component {

    constructor(props) {
        super(props)
        this.refreshTempData = undefined
        this.state = {
            searchTxt: '',
            isCheck: false,
            listData: undefined,
        }
    }
    componentDidMount=()=>{
        this.fetchData()
    }
    //APi
    fetchData=()=>{
        this.props.fetchAction()
    }
    responseHnadle=(data)=>{
        let tempData = data
         var arr = [];
         data.forEach(item => {
             if(arr.some(o=>o.category==item.category)) {
                arr.forEach((element,index)=>{
                    if(element.category===item.category){
                       arr[index].data.push(item)
                    }
                })
             }else{
                arr.push({category:item.category,data:[item]})
             }
        })
       this.refreshTempData=[...arr]
        this.setState({listData:[...arr]})

    }
    //Action
    serachingData=(txt)=>{ 
            let dataTemp = this.refreshTempData
            let searchDataArr = dataTemp.map((item,index)=>{
              let tempData =  item.data.filter(elt=>{
                   if(elt.name.toLowerCase().includes(txt.toLowerCase())){
                       return elt
                   }
                })
                // if(tempData.length>0)
                 return ({category:item.category,data:tempData})
                
            })
          
            this.setState({listData:[...searchDataArr]})
        if(txt==''){
            this.setState({listData:this.refreshTempData})
        }
    }
    isCheckStockBtn = (refreshTempData) => {
        let dataTemp = refreshTempData
        this.setState({ isCheck: !this.state.isCheck },()=>{
          let newDataARr =  dataTemp.map((item,index)=>{
              let tempData =  item.data.filter(elt=>{
                    if(this.state.isCheck&&elt.stocked){
                        return (elt)
                    }else if(!this.state.isCheck&&!elt.stocked){
                        return(elt)
                    }
                })
                return ({category:item.category,data:tempData})
            })
            this.setState({listData:[...newDataARr]})
        })
    }
    renderItem = (item, index) => {
        return (
            <View style={{ flex: 1 }}>
                <Text style={styles.itemHeader}>
                    {item.category}
                </Text>
                <View style={styles.sepratorStyle}/>
                {
                    item.data.map(elmnt => {
                        return (
                            <View style={styles.header}>
                                <Text style={styles.txtItem}>
                                    {elmnt.name}
                                </Text>
                                <Text style={styles.txtItem}>
                                    {elmnt.price}
                                </Text>
                            </View>
                        )
                    })
                }

            </View>
        )
    }
    renderHeader = () => {
        return (
            <View style={[styles.header]}>
                <Text style={styles.txtHeder}>
                    {'Name'}
                </Text>
                <Text style={styles.txtHeder}>
                    {'Price'}
                </Text>
            </View>
        )
    }
    render() {
        const {loading,data} = this.props
        if(data){
            !this.state.listData&&
            this.responseHnadle(data)
        }
        return (
            <View style={styles.container}>
                
                {
                     this.state.listData && this.state.listData.length > 0 &&
                     <>
                <TextInput
                    placeholder={'Search product name...'}
                    style={styles.txtInput}
                    value={this.state.searchTxt}
                    onChangeText={(txt) =>  this.setState({ searchTxt: txt },()=>{
                        this.serachingData(txt)
                    })}
                />
                <View style={styles.checkBoxParent}>
                    <TouchableOpacity style={[styles.checkBox, { backgroundColor: this.state.isCheck ? 'green' : undefined }]}
                        onPress={() => this.isCheckStockBtn(this.refreshTempData)} />
                    <Text style={styles.txtStock}>
                        {'Only show products in stock'}
                    </Text>

                </View>
                
                    <FlatList
                        style={styles.list}
                        data={this.state.listData}
                        renderItem={({ item, index }) => this.renderItem(item, index)}
                        extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                        ListHeaderComponent={() => this.renderHeader()} />
                
                </>}

                {
                    loading&&
                    <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                     <ActivityIndicator size={'large'} />
                     </View>
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        margin: 10,
        borderWidth: .5,
        borderColor: 'lightgrey',

    },
    item: {
    },
    txtInput: {
        borderColor: 'grey',
        borderWidth: 1,
        marginHorizontal:2,
        paddingHorizontal:2,
        height:Dimensions.get('screen').height*4.5/100
    },
    checkBox: {
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 2,
        width: 15,
        aspectRatio: 1
    },
    txtStock: {
        marginHorizontal: 5
    },
    checkBoxParent: {
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center'
    },
    header:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomColor: 'lightgrey',
        borderBottomWidth: .5,
        paddingHorizontal: 20
    },
    txtHeder: {
        fontWeight: '800',
        color: 'black'
    },
    txtItem: {
        // fontWeight:'500',
        color: 'grey'
    },
    itemHeader: {
        paddingVertical: 10,
        marginHorizontal: 20,
        fontWeight: '800',
    
     
    },
    sepratorStyle:{
        borderBottomColor: 'grey',
        borderBottomWidth: .5,
    }

});

const mapStateToProps=({fetchReducer})=>({
    loading:fetchReducer.fetching,
    data:fetchReducer.data,
})
const mapDispatchToProps = {
    fetchAction: fetchAction
}
export default connect(mapStateToProps, mapDispatchToProps)(Home)
