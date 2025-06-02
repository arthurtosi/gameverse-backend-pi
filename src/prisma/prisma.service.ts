import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ["warn", "error"],
    });
  }

  // se iniciart o prisma, conecta com o banco
  onModuleInit() {
    return this.$connect();
  }

  // se crashar o banco disconecta com o banco
  onModuleDestroy() {
    return this.$disconnect();
  }
}
