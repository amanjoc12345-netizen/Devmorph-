'use client';

import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store, AppDispatch } from '../app/store';
import { fetchMe } from '../features/auth/authThunk';
import { Toaster } from 'react-hot-toast';

function AuthFetcher({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthFetcher>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "rgba(0, 0, 0, 0.6)",
              color: "#d1fae5",
              border: "1px solid rgba(163, 230, 53, 1)",
              backdropFilter: "blur(12px)",
              borderRadius: "9999px",
              padding: "10px 14px",
              fontSize: "12px",
              fontWeight: 600,
            },
          }}
        />
      </AuthFetcher>
    </Provider>
  );
}
