/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { AppModule } from "../../src/app.module";
import { PrismaService } from "../../src/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Create Account (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test("[POST] /user", async () => {
    const response = await request(app.getHttpServer()).post("/user").send({
      username: "pedro_sodrem",
      email: "pedro.malini@ctjunior.com.br",
      password: "123456",
    });

    expect(response.statusCode).toBe(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: "pedro.malini@ctjunior.com.br",
      },
    });

    expect(userOnDatabase).toEqual(
      expect.objectContaining({
        username: "pedro_sodrem",
      }),
    );
  });
});
