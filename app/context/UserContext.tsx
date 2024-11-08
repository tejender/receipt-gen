// context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../../lib/appwrite';

const UserContext = createContext<{ hostId: string | null }>({ hostId: null });

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [hostId, setHostId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setHostId(user.$id);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ hostId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
