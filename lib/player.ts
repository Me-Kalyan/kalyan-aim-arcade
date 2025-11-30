"use client";

import { v4 as uuid } from "uuid";

const ID_KEY = "kaa-player-id";
const NAME_KEY = "kaa-player-name";

export function getOrCreatePlayerId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(ID_KEY);
  if (!id) {
    id = uuid();
    window.localStorage.setItem(ID_KEY, id);
  }
  return id;
}

export function getPlayerName(): string | null {
  if (typeof window === "undefined") return null;
  const name = window.localStorage.getItem(NAME_KEY);
  return name && name.trim().length ? name : null;
}

export function setPlayerName(name: string) {
  if (typeof window === "undefined") return;
  const trimmed = name.trim();
  if (!trimmed) return;
  window.localStorage.setItem(NAME_KEY, trimmed);
}

export function hasProfile(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.localStorage.getItem(ID_KEY) && !!getPlayerName();
}

