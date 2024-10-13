import { create } from 'zustand';

interface signupOpen {
    signupOpen : boolean;
    setSignupOpen : (signupOpen : boolean) => void;
}

const signupOpenStore = create<signupOpen>((set) => ({
    signupOpen : false,
    setSignupOpen : (signupOpen : any) =>{
        set((state) => ({ ...state, signupOpen}));
    }
}))

export default signupOpenStore;