import axios from 'axios'


const fetchJsonData=async(url)=>{
    try {

        const response =await axios.get(url);
        
        console.log("hit the fetchJsonData")
        console.log("the fetch data return :",response)

        return response.data
        
    } catch (error) {

        console.log("the fetch error")
        

        
    }
    
    
    
}

export default fetchJsonData