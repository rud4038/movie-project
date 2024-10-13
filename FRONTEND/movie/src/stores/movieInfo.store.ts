import { create } from 'zustand';

interface MovieInfoStore {
    movieInfoSt : any;
    setMovieInfoSt : (movieInfoSt : any) => void;
}

const movieInfoStore = create<MovieInfoStore>((set) => ({
    movieInfoSt : null,
    setMovieInfoSt : (movieInfoSt : any) =>{
        set((state) => ({ ...state, movieInfoSt}));
    }
}))

export default movieInfoStore;