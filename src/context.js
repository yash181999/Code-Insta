import React, { useState, useContext, useEffect } from 'react'
import { db } from './firebase';
import { useStateValue } from './StateProvider';
const AppContext = React.createContext();


const AppProvider = ({children}) => {
    
    

    

    const [searchedUserId, setSearchedUserId] = useState();
    const [currentUserData, setCurrentUserData] = useState();
    const [selected, setSelected] = useState('HOME');

    
    

   
   


    return <AppContext.Provider value = {
        {
            
            searchedUserId,
            setSearchedUserId,
            currentUserData,
            setCurrentUserData,
            selected,
            setSelected,
            
        }
    } >{children}</AppContext.Provider>

}

export const useGlobalContext = () => {
    return useContext(AppContext);
}

export {AppContext,AppProvider};