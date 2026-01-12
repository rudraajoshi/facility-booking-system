import PropTypes from "prop-types";
import { FacilityProvider } from "./FacilityContext";
import { BookingProvider } from "./BookingContext";
import { AuthProvider } from "./AuthContext";  

const AppProvider = ({children}) => {
    return (
        <AuthProvider>  
            <FacilityProvider>
                <BookingProvider>
                    {children}
                </BookingProvider>
            </FacilityProvider>
        </AuthProvider> 
    );
};

AppProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default AppProvider;