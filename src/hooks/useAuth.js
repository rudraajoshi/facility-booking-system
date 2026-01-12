import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * custom hook to access authentication context
 * @returns {Object}
 * @throws {Error}
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};