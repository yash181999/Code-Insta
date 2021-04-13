import React, { useState, useContext, useEffect } from 'react'
import { db } from './firebase';
import { useStateValue } from './StateProvider';
const AppContext = React.createContext();


const AppProvider = ({children}) => {
    
    

    

    const [{user}, dispatch] = useStateValue();

    
    

   
   


    return <AppContext.Provider value = {
        {
            
            
            
        }
    } >{children}</AppContext.Provider>

}

export const useGlobalContext = () => {
    return useContext(AppContext);
}

export {AppContext,AppProvider};