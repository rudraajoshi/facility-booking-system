import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * authentication context for managing user authentication
 */
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // load user from localStorage on mount
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            }
            setLoading(false);
        } catch (error) {
            console.error('Error loading user:', error);
            setLoading(false);
        }
    }, []);

    /**
     * register a new user
     * @param {Object} userData 
     * @returns {Object} 
     */
    const signup = (userData) => {
        try {
            // get existing users
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // check if email already exists
            if (users.find(u => u.email === userData.email)) {
                return { success: false, message: 'Email already registered' };
            }

            // create new user
            const newUser = {
                id: `USER${Date.now()}`,
                name: userData.name,
                email: userData.email,
                password: userData.password, 
                phone: userData.phone || '',
                createdAt: new Date().toISOString()
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            const userWithoutPassword = { ...newUser };
            delete userWithoutPassword.password;
            
            setCurrentUser(userWithoutPassword);
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
            localStorage.setItem('currentUserEmail', newUser.email);

            return { success: true, message: 'Account created successfully!' };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, message: 'Failed to create account' };
        }
    };

    /**
     * login user
     * @param {string} email
     * @param {string} password
     * @returns {Object} 
     */
    const login = (email, password) => {
        try {
            // get existing users
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // find user
            const user = users.find(u => u.email === email && u.password === password);
            
            if (!user) {
                return { success: false, message: 'Invalid email or password' };
            }

            // set as current user
            const userWithoutPassword = { ...user };
            delete userWithoutPassword.password;
            
            setCurrentUser(userWithoutPassword);
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
            localStorage.setItem('currentUserEmail', user.email);

            return { success: true, message: 'Login successful!' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Failed to login' };
        }
    };

    /**
     * logout current user
     */
    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserEmail');
    };

    /**
     * check if user is authenticated
     * @returns {boolean}
     */
    const isAuthenticated = () => {
        return currentUser !== null;
    };

    const value = {
        currentUser,
        loading,
        signup,
        login,
        logout,
        isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};