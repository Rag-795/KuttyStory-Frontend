import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    updateProfile,
    onAuthStateChanged,
} from 'firebase/auth';
import {
    getFirestore,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
} from 'firebase/firestore';
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signInWithEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

export const signUpWithEmail = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });

    // Create user document in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        displayName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        videosGenerated: 0,
    });

    return userCredential;
};

export const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);

    // Check if user document exists, create if not
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            videosGenerated: 0,
        });
    }

    return result;
};

export const logOut = () => signOut(auth);

export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

// Firestore functions - Users
export const getUserData = async (userId) => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
        return userDoc.data();
    }
    return null;
};

// Firestore functions - Videos
export const getUserVideos = async (userId) => {
    const q = query(
        collection(db, 'videos'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getVideoById = async (videoId) => {
    const docRef = doc(db, 'videos', videoId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
};

export const createVideoDocument = async (userId, videoData) => {
    const videoRef = doc(collection(db, 'videos'));
    await setDoc(videoRef, {
        ...videoData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'pending',
        progress: 0,
        views: 0,
        isPublic: false,
    });
    return videoRef.id;
};

export const updateVideoDocument = async (videoId, data) => {
    const videoRef = doc(db, 'videos', videoId);
    await updateDoc(videoRef, {
        ...data,
        updatedAt: serverTimestamp(),
    });
};

export const deleteVideoDocument = async (videoId) => {
    await deleteDoc(doc(db, 'videos', videoId));
};

// Storage functions
export const uploadVideo = async (userId, videoBlob, filename) => {
    const storageRef = ref(storage, `videos/${userId}/${filename}`);
    await uploadBytes(storageRef, videoBlob);
    return getDownloadURL(storageRef);
};

export const deleteVideoFromStorage = async (videoUrl) => {
    const storageRef = ref(storage, videoUrl);
    await deleteObject(storageRef);
};
