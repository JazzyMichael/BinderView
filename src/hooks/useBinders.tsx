import { useState } from "react";
import useLocalStorage from "./useLocalStorage";

export default function useBinders() {
  const [binders, setBinders] = useLocalStorage("", "binders");
  const [newBinderName, setNewBinderName] = useState("");

  const createBinder = (name: string = newBinderName) => {
    if (!name.trim()) return;
    setBinders({ [name.trim()]: [], ...binders });
    setNewBinderName("");
  };

  const deleteBinder = (name: string) => {
    if (!name.trim() || !binders[name]) return;
    delete binders[name];
    setBinders({ ...binders });
  };

  const addCard = (binder: string, card: any) => {
    binders[binder].unshift(card);
    setBinders({ ...binders });
  };

  const removeCard = (binder: string, index: number) => {
    binders[binder].splice(index, 1);
    setBinders({ ...binders });
  };

  const reorderCards = (binder: string, cards: any[]) => {
    binders[binder] = cards;
    setBinders({ ...binders });
  };

  return {
    binders,
    newBinderName,
    setNewBinderName,
    createBinder,
    deleteBinder,
    addCard,
    removeCard,
    reorderCards,
  };
}
