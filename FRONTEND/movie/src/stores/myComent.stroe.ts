import { create } from 'zustand';

interface myComentStore {
    myComent : any;
    setMyComent : (myComent : any) => void;
}

const myComentStore = create<myComentStore>((set) => ({
    myComent : null,
    setMyComent : (myComent : any) =>{
        set((state) => ({ ...state, myComent}));
    }
}))

export default myComentStore;