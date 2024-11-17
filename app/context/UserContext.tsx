// context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../../lib/appwrite';

interface UserContextType {
  hostId: string | null;
  userName: string | null;
  userMail: string | null
  userPhone: string | null
}

const UserContext = createContext<UserContextType>({
  hostId: null,
  userName: null,
  userMail:null,
  userPhone: null
});

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [hostId, setHostId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userMail, setUserMail] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState<string | null>(null);


  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setHostId(user.$id);
        setUserName(user.name);
        setUserMail(user.email);
        setUserPhone(user.phone);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ hostId, userName, userMail, userPhone }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
