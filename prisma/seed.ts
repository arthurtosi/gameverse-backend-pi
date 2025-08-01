import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("123", 8);

  const cliente = await prisma.user.upsert({
    where: { email: "cliente@example.com" },
    update: {},
    create: {
      username: "cliente01",
      email: "cliente@example.com",
      password: passwordHash,
      role: "CLIENT",
      bio: "Usuário cliente criado automaticamente pelo seed.",
    },
  });

  // Plataformas
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pc, ps5, xbox, nintendoSwitch, mobile, mac, linux] = await Promise.all(
    [
      prisma.gamePlatform.upsert({
        where: { slug: "pc" },
        update: {},
        create: { name: "PC", slug: "pc" },
      }),
      prisma.gamePlatform.upsert({
        where: { slug: "ps5" },
        update: {},
        create: { name: "PlayStation 5", slug: "ps5" },
      }),
      prisma.gamePlatform.upsert({
        where: { slug: "xbox" },
        update: {},
        create: { name: "Xbox Series X", slug: "xbox" },
      }),
      prisma.gamePlatform.upsert({
        where: { slug: "nintendo-switch" },
        update: {},
        create: { name: "Nintendo Switch", slug: "nintendo-switch" },
      }),
      prisma.gamePlatform.upsert({
        where: { slug: "mobile" },
        update: {},
        create: { name: "Mobile", slug: "mobile" },
      }),
      prisma.gamePlatform.upsert({
        where: { slug: "mac" },
        update: {},
        create: { name: "Mac", slug: "mac" },
      }),
      prisma.gamePlatform.upsert({
        where: { slug: "linux" },
        update: {},
        create: { name: "Linux", slug: "linux" },
      }),
    ]
  );

  // Gêneros
  const [
    rpg,
    action,
    adventure,
    shooter,
    strategy,
    simulation,
    sports,
    puzzle,
    horror,
    racing,
  ] = await Promise.all([
    prisma.gameGenre.upsert({
      where: { slug: "rpg" },
      update: {},
      create: { name: "RPG", slug: "rpg" },
    }),
    prisma.gameGenre.upsert({
      where: { slug: "action" },
      update: {},
      create: { name: "Ação", slug: "action" },
    }),
    prisma.gameGenre.upsert({
      where: { slug: "adventure" },
      update: {},
      create: { name: "Adventure", slug: "adventure" },
    }),
    prisma.gameGenre.upsert({
      where: { slug: "shooter" },
      update: {},
      create: { name: "Shooter", slug: "shooter" },
    }),
    prisma.gameGenre.upsert({
      where: { slug: "strategy" },
      update: {},
      create: { name: "Strategy", slug: "strategy" },
    }),
    prisma.gameGenre.upsert({
      where: { slug: "simulation" },
      update: {},
      create: { name: "Simulation", slug: "simulation" },
    }),
    prisma.gameGenre.upsert({
      where: { slug: "sports" },
      update: {},
      create: { name: "Sports", slug: "sports" },
    }),
    prisma.gameGenre.upsert({
      where: { slug: "puzzle" },
      update: {},
      create: { name: "Puzzle", slug: "puzzle" },
    }),
    prisma.gameGenre.upsert({
      where: { slug: "horror" },
      update: {},
      create: { name: "Horror", slug: "horror" },
    }),
    prisma.gameGenre.upsert({
      where: { slug: "racing" },
      update: {},
      create: { name: "Racing", slug: "racing" },
    }),
  ]);

  // Jogos
  const game1 = await prisma.game.upsert({
    where: { slug: "elden-ring" },
    update: {},
    create: {
      name: "Elden Ring",
      slug: "elden-ring",
      foto: "https://press-start.com.au/wp-content/uploads/2022/02/Elden-Ring-Reviewwww.jpg",
      releaseDate: new Date("2022-02-25"),
    },
  });

  const game2 = await prisma.game.upsert({
    where: { slug: "god-of-war-ragnarok" },
    update: {},
    create: {
      name: "God of War Ragnarok",
      slug: "god-of-war-ragnarok",
      foto: "https://upload.wikimedia.org/wikipedia/pt/thumb/a/a5/God_of_War_Ragnar%C3%B6k_capa.jpg/330px-God_of_War_Ragnar%C3%B6k_capa.jpg",
      releaseDate: new Date("2022-11-09"),
    },
  });

  const game3 = await prisma.game.upsert({
    where: { slug: "halo-infinite" },
    update: {},
    create: {
      name: "Halo Infinite",
      slug: "halo-infinite",
      foto: "https://wallpapercave.com/wp/wp4813418.png",
      releaseDate: new Date("2021-12-08"),
    },
  });

  // Dados para relacionar gêneros e plataformas
  const gameGenresData = [
    { game: game1, genres: [rpg, action] },
    { game: game2, genres: [action, adventure] },
    { game: game3, genres: [action] },
  ];

  const gamePlatformsData = [
    { game: game1, platforms: [pc, ps5] },
    { game: game2, platforms: [ps5] },
    { game: game3, platforms: [xbox, pc] },
  ];

  // Criar relacionamentos gêneros-jogos
  for (const { game, genres } of gameGenresData) {
    const data = genres.map((genre) => ({
      gameId: game.id,
      gameGenreId: genre.id,
    }));
    await prisma.relationGameAndGameGenre.createMany({
      data,
      skipDuplicates: true,
    });
  }

  // Criar relacionamentos plataformas-jogos
  for (const { game, platforms } of gamePlatformsData) {
    const data = platforms.map((platform) => ({
      gameId: game.id,
      gamePlatformId: platform.id,
    }));
    await prisma.relationGameAndGamePlatform.createMany({
      data,
      skipDuplicates: true,
    });
  }

  // Avaliações
  const ratingsData = [
    {
      title: "Obra-prima moderna",
      content: "Combina liberdade, desafio e ambientação como poucos jogos.",
      rate: 5,
      authorId: cliente.id,
      gameId: game1.id,
    },
    {
      title: "Emocionante e épico",
      content: "História envolvente e gráficos incríveis.",
      rate: 5,
      authorId: cliente.id,
      gameId: game2.id,
    },
    {
      title: "Multiplayer excelente",
      content: "A melhor experiência multiplayer da geração.",
      rate: 4,
      authorId: cliente.id,
      gameId: game3.id,
    },
  ];

  await prisma.rating.createMany({
    data: ratingsData,
    skipDuplicates: true,
  });

  // Criar lista de jogos
  const gameList = await prisma.gameList.create({
    data: {
      title: "Favoritos do Cliente",
      description: "Minha lista pessoal de jogos favoritos",
      isPublic: true,
      userId: cliente.id,
    },
  });

  // Relacionar jogos na lista
  const gameListRelations = [
    { gameId: game1.id, gamelistId: gameList.id },
    { gameId: game2.id, gamelistId: gameList.id },
  ];

  await prisma.relationGameAndGameList.createMany({
    data: gameListRelations,
    skipDuplicates: true,
  });

  console.log("Seed completada com sucesso!");
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
