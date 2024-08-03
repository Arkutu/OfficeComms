import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [organizationName, setOrganizationName] = useState('');
  const [user, setUser] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);

  return (
    <AppContext.Provider value={{ organizationName, setOrganizationName, user, setUser, selectedMembers, setSelectedMembers }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
