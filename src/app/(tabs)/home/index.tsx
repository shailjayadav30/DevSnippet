import { StyleSheet, Text, View } from 'react-native'
import { StatusBar } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';


const index = () => {
  return (
    <SafeAreaView style={styles.container}>
        <StatusBar hidden={true}/>

      <Text>index</Text>
    </SafeAreaView>
  )
}

export default index

const styles = StyleSheet.create({
  container:{
    backgroundColor:"red",
    flex:1
  }
})