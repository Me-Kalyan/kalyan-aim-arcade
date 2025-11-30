"use client";

import { v4 as uuid } from "uuid";

const KEY = "kaa-player-id";

export function getOrCreatePlayerId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = uuid();
    window.localStorage.setItem(KEY, id);
  }
  return id;
}

