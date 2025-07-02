import { ApiProperty } from "@nestjs/swagger";

export class MeResponseDTO {
  @ApiProperty({ example: "5b6c2180-7c52-4035-91d0-ae86ed5b6815" })
  id!: string;

  @ApiProperty({ example: "pedro_sodrem" })
  username!: string;

  @ApiProperty({ example: "pedro.malini@ctjunior.com.br" })
  email!: string;

  @ApiProperty({ example: "https://example.com/avatar.png", nullable: true })
  foto!: string | null;

  @ApiProperty({ enum: ["ADMIN", "CLIENT"], example: "CLIENT" })
  role!: "ADMIN" | "CLIENT";
}

export class MeWrapperResponseDTO {
  @ApiProperty({ type: MeResponseDTO })
  user!: MeResponseDTO;
}
