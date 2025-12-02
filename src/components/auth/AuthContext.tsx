import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiFetch, setAuthToken, apiUsers } from '../../lib/api/client';

interface User {
  id: number; // ID en base de datos backend
  uid: string; // Firebase UID
  email: string;
  name: string; // Cambiado de displayName
  role: 'viewer' | 'operator' | 'platform_admin';
  department?: string; // Opcional, de Firestore
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  isViewer: () => boolean;
  isOperator: () => boolean;
  isAdmin: () => boolean;
  canCreate: () => boolean; // operator o admin
  canEdit: () => boolean; // operator o admin
  canDelete: () => boolean; // operator o admin
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Listener real de Firebase Auth + sincronización con backend y Firestore
  useEffect(() => {
    let unsubscribeAuth: (() => void) | undefined;
    let unsubscribeToken: (() => void) | undefined;

    (async () => {
      try {
        const [authExports, firebaseConfig, firestoreExports] = await Promise.all([
          import('firebase/auth'),
          import('../../firebase/config'),
          import('firebase/firestore'),
        ]);
        const { onAuthStateChanged, onIdTokenChanged } = authExports;
        const { auth, db } = firebaseConfig as any;
        const { doc, getDoc, setDoc } = firestoreExports;

        unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser: any) => {
          console.log('[Auth] onAuthStateChanged:', !!firebaseUser);
          if (firebaseUser) {
            try {
              const idToken: string = await firebaseUser.getIdToken();
              setToken(idToken);
              setAuthToken(idToken);
              console.log('[Auth] Token set');

              // Firestore opcional
              let fsData: any = {};
              try {
                const ref = doc(db, 'users', firebaseUser.uid);
                const snap = await getDoc(ref);
                fsData = snap.exists() ? snap.data() : {};
                // No bloquea si falla
                try {
                  if (!snap.exists()) {
                    await setDoc(ref, {
                      email: firebaseUser.email || '',
                      department: 'Sin asignar',
                      createdAt: new Date().toISOString(),
                      lastLogin: new Date().toISOString(),
                    }, { merge: true });
                  } else {
                    await setDoc(ref, { lastLogin: new Date().toISOString() }, { merge: true });
                  }
                } catch (e) {
                  console.warn('[Auth] No se pudo escribir lastLogin en Firestore:', e);
                }
              } catch (firestoreError) {
                console.warn('[Auth] Firestore no disponible:', firestoreError);
              }

              // Backend: /users/me
              try {
                const backendProfile = await apiUsers.me();
                console.log('[Auth] /users/me OK:', backendProfile);
                setUser({
                  id: backendProfile.id,
                  uid: backendProfile.firebase_uid,
                  email: backendProfile.email,
                  // ⬇️ PRIORIZAR displayName de Firebase sobre backend
                  name: firebaseUser.displayName || backendProfile.name || firebaseUser.email?.split('@')[0] || 'Usuario',
                  role: backendProfile.role,
                  department: fsData?.department || 'Sin asignar',
                  lastLogin: new Date().toISOString(),
                });
              } catch (apiError: any) {
                console.error('[Auth] /users/me error:', apiError?.message || apiError);
                // Fallback con Firebase
                setUser({
                  id: 0,
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  // ⬇️ displayName de Firebase
                  name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
                  role: 'viewer',
                  department: fsData?.department || 'Sin asignar',
                  lastLogin: new Date().toISOString(),
                });
              }
            } catch (tokenError) {
              console.error('[Auth] getIdToken error:', tokenError);
              setUser(null);
              setToken(null);
              setAuthToken(null);
            }
          } else {
            setUser(null);
            setToken(null);
            setAuthToken(null);
          }
          setLoading(false);
        });

        // Importante: al refrescar token, también intentamos actualizar el perfil si ya hay usuario
        unsubscribeToken = onIdTokenChanged(auth, async (firebaseUser: any) => {
          console.log('[Auth] onIdTokenChanged:', !!firebaseUser);
          if (firebaseUser) {
            try {
              const freshToken = await firebaseUser.getIdToken();
              setToken(freshToken);
              setAuthToken(freshToken);
              console.log('[Auth] Token refreshed');

              // Si ya hay user, refrescamos su perfil del backend (roles pueden cambiar)
              try {
                const backendProfile = await apiUsers.me();
                console.log('[Auth] /users/me on token refresh OK');
                
                // ⬇️ Obtener displayName actualizado de Firebase
                const displayName = firebaseUser.displayName || backendProfile.name || firebaseUser.email?.split('@')[0] || 'Usuario';
                
                setUser(prev => {
                  const base = prev || {
                    id: backendProfile.id,
                    uid: backendProfile.firebase_uid,
                    email: backendProfile.email,
                    name: displayName,
                    department: 'Sin asignar',
                    lastLogin: new Date().toISOString(),
                  };
                  return {
                    ...base,
                    id: backendProfile.id,
                    uid: backendProfile.firebase_uid,
                    email: backendProfile.email,
                    name: displayName, // ⬅️ Firebase displayName
                    role: backendProfile.role,
                  };
                });
              } catch (apiError) {
                console.warn('[Auth] /users/me failed on token refresh:', apiError);
              }
            } catch (e) {
              console.warn('[Auth] Error refrescando token:', e);
            }
          }
        });
      } catch (error) {
        console.error('[Auth] Firebase init error:', error);
        setLoading(false);
      }
    })();

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeToken) unsubscribeToken();
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const [{ signInWithEmailAndPassword }, { auth }] = await Promise.all([
        import('firebase/auth'),
        import('../../firebase/config')
      ]);
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    setLoading(true);
    try {
      const [{ GoogleAuthProvider, signInWithPopup }, { auth }] = await Promise.all([
        import('firebase/auth'),
        import('../../firebase/config')
      ]);
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const gUser = result.user;
      if (gUser.email && import.meta.env.VITE_GOOGLE_DOMAIN && !gUser.email.endsWith(`@${import.meta.env.VITE_GOOGLE_DOMAIN}`)) {
        throw new Error('UTEM_DOMAIN_REQUIRED');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    const [{ signOut }, { auth }] = await Promise.all([
      import('firebase/auth'),
      import('../../firebase/config')
    ]);
    await signOut(auth);
    setUser(null);
    setToken(null);
    setAuthToken(null);
  };

  const resetPassword = async (email: string): Promise<void> => {
    const [{ sendPasswordResetEmail }, { auth }] = await Promise.all([
      import('firebase/auth'),
      import('../../firebase/config')
    ]);
    await sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) throw new Error('No hay usuario autenticado');
    
    // Actualizar backend si existe endpoint PUT /users/me
    try {
      await apiFetch('/users/me', {
        method: 'PUT',
        body: JSON.stringify({ name: data.name })
      });
    } catch (e) {
      console.warn('Backend no soporta actualización de perfil:', e);
    }

    // Actualizar Firebase Auth displayName
    if (data.name) {
      try {
        const [{ updateProfile }, { auth }] = await Promise.all([
          import('firebase/auth'),
          import('../../firebase/config')
        ]);
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { displayName: data.name });
        }
      } catch (e) {
        console.warn('No se pudo actualizar Firebase Auth:', e);
      }
    }

    setUser({ ...user, ...data });
  };

  const isViewer = (): boolean => user?.role === 'viewer';
  const isOperator = (): boolean => user?.role === 'operator';
  const isAdmin = (): boolean => user?.role === 'platform_admin';
  const canCreate = (): boolean => isOperator() || isAdmin();
  const canEdit = (): boolean => isOperator() || isAdmin();
  const canDelete = (): boolean => isOperator() || isAdmin();

  const value: AuthContextType = {
    user,
    loading,
    token,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    isViewer,
    isOperator,
    isAdmin,
    canCreate,
    canEdit,
    canDelete
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}