import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';

interface Event {
  name: string;
  operation: string;
  value: number;
}

export class UpdateCategoryDTO {
  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: Event[];
}
