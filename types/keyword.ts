import { Entity } from "./entity";
import { User } from "./user";

export type Keyword = {
  active_update: string;
  category: string;
  creation_date: string;
  id: number;
  keyword: string;
  store: string;
  threshold: number;
  url: string;
  user: User;
};

export type Update = {
  creation_date: string;
  id: number;
  message: string;
  search: string;
  status: 1 | 2 | 3;
  url: string;
};

export type Position = {
  entity: Entity;
  value: number;
  update: string;
};
