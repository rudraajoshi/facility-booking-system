import PropTypes from "prop-types";
import { FacilityProvider } from "./FacilityContext";
import { BookingProvider } from "./BookingContext";
 /**
  * combined app provider 
  * @param {object}
  * @param {React.ReactNode}
  */
 const AppProvider = ({children}) =>{
    return (
        <FacilityProvider>
            <BookingProvider>
                {children}
            </BookingProvider>
        </FacilityProvider>
    );
 };
 AppProvider.propTypes = {
    children: PropTypes.node.isRequired
 };

 export default AppProvider;