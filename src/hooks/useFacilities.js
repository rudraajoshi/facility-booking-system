import {useContext} from 'react';
import { FacilityContext } from '../context/FacilityContext';
/**
 * custom hook to access facility context
 * @returns {Object}
 * @throws {Error}
 */
export const useFacilities = () =>{
    const context = useContext(FacilityContext);
    if(!context){
        throw new Error('useFacilties must be used within a FacilityProvider');
    }
    return context;
};

export default useFacilities;