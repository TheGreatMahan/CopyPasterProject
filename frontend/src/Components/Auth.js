import { useContext } from 'react';
import { useState, createContext } from 'react';

const AuthContext = createContext({});


export const AuthProvider = ({children}) => {
    const [user, setUser] = useState('');

    const login = (user) =>{
        setUser(user);
    }

    const logout = () => {
        setUser('');
    }

    return <AuthContext.Provider value={{user, login, logout}}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => {
    return useContext(AuthContext);
}