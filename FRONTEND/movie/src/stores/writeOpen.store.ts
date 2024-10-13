import { create } from 'zustand';

interface writeOpen {
    writeOpen : boolean;
    setWriteOpen : (writeOpen : boolean) => void;
}

const writeOpenStore = create<writeOpen>((set) => ({
    writeOpen : false,
    setWriteOpen : (writeOpen : any) =>{
        set((state) => ({ ...state, writeOpen}));
    }
}))

export default writeOpenStore;