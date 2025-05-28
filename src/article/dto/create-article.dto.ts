import { IsNotEmpty } from 'class-validator';

export class CreateArticleDtoTs {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly body: string;

  // Optional
  readonly tagList?: string[];
}
