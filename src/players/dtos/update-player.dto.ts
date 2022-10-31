import { IsOptional } from 'class-validator';

export class UpdatePlayerDTO {
  @IsOptional()
  category: string;

  @IsOptional()
  url_photo_player: string;
}
