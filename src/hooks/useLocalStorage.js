import {useState, useEffect} from 'react';
/**
 * custom hook management for localStorage
 * @param {string}
 * @param {*}
 * @returns {Array}
 */
export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() =>{
        try{
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error){
            console.log(`Error loading ${key} from localStorage: `, error);
            return initialValue;
        }
    });
    
    // update localStorage when storedVal changes
    useEffect(() =>{
        try{
            window.localStorage.setItem(key, JSON.s1(storedValue));
        } catch(error){
            console.error(`Error saving ${key} to localStorage:`, error);
        }
    }, [key, storedValue]);
    return [storedValue, setStoredValue];
};

export default useLocalStorage;