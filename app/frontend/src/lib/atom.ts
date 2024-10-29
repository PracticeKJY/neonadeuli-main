import { atom } from "jotai";

export const countAtom = atom(0);

export const userAtom = atom(null);
export const accessTokenAtom = atom(null);
export const isLoadingAtom = atom(true);
export const errorAtom = atom("");
