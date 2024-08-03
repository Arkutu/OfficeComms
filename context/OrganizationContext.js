import React, { createContext, useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const OrganizationContext = createContext();

export const OrganizationProvider = ({ children }) => {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'organizations'));
        const orgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrganizations(orgs);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
      setLoading(false);
    };

    fetchOrganizations();
  }, []);

  return (
    <OrganizationContext.Provider value={{ organizations, selectedOrganizationId, setSelectedOrganizationId, loading }}>
      {children}
    </OrganizationContext.Provider>
  );
};
