export class CreateCardDto {
  title: string;
  content?: string;
  order: number;
  columnId: string;
  userId?: string;
}
