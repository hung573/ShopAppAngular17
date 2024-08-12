export class CommentDTO {
  product_id: number;
  user_id: number;
  content: string;
  constructor(data: any) {
    this.product_id = data.product_id;
    this.user_id = data.user_id;
    this.content = data.content;
  }
}
