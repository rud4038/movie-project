import { create } from 'zustand';

interface loginOpen {
    loginOpen : boolean;
    setLoginOpen : (loginOpen : boolean) => void;
}

const loginOpenStore = create<loginOpen>((set) => ({
    loginOpen : false,
    setLoginOpen : (loginOpen : any) =>{
        set((state) => ({ ...state, loginOpen}));
    }
}))

export default loginOpenStore;