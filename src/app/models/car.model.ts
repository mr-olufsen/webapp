import {User} from "./user.model";

export interface Car {
  id: number;
  make: string;
  model: string;
  numberplate: string;
  user?: User;
}
