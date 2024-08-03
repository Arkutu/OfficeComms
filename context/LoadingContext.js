// context/LoadingContext.js
import React, { createContext, useState, useContext } from 'react';
import Loading from '../components/Loading';  // Adjust the path if necessary


const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
      {children}
      {loading && <Loading />}
    </LoadingContext.Provider>
  );
};
