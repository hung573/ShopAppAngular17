import { UserResponse } from "./user/user.response";

export interface CommentResponse {
  id: number,
  user: UserResponse,
  content: string,
  createdAt: Date,
  updatedAt: Date,
}
