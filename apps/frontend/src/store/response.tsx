import { atom } from 'recoil';
import { FileItem, Step } from '../types';

// Atoms
export const llmMessagesAtom = atom<any[]>({
  key: 'llmMessagesAtom',
  default: [],
});

export const stepsAtom = atom<Step[]>({
  key: 'stepsAtom',
  default: [],
});

export const filesAtom = atom<FileItem[]>({
  key: 'filesAtom',
  default: [],
});
