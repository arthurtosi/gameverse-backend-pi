import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./env";
import { AuthModule } from "./auth/auth.module";
import { CreateAccountController } from "./controllers/user/create-account.controller";
import { AuthenticateController } from "./controllers/user/authenticate.controller";
import { GetMeController } from "./controllers/user/get-me.controller";
import { DeleteUserController } from "./controllers/user/delete-user-by-id.controller";
import { EditAccountController } from "./controllers/user/edit-user-by-id.controller";
import { GetAllUsersController } from "./controllers/user/get-all-users.controller";
import { EditMeController } from "./controllers/user/edit-me.controller";
import { DeleteMeController } from "./controllers/user/delete-me.controller";
import { CloudflareR2Service } from "./services/r2-upload.service";
import { GetUserByIdController } from "./controllers/user/get-user-by-id.controller";
import { GetUserByUsernameController } from "./controllers/user/get-user-by-username.controller";
import { GetAllGamesController } from "./controllers/game/get-all-games.controller";
import { GetGameByIdController } from "./controllers/game/get-game-by-id.controller";
import { DeleteGameByIdController } from "./controllers/game/delete-game-by-id.controller";
import { CreateGameController } from "./controllers/game/create-game.controller";
import { GetAllGamesWithSubstringController } from "./controllers/game/get-games-by-substring.controller";
import { EditGameController } from "./controllers/game/edit-game-by-id.controller";
import { GetGameBySlugController } from "./controllers/game/get-game-by-slug.controller";
import { DeleteRatingByIdController } from "./controllers/rating/delete-rating-by-id.controller";
import { GetRatingsByGameIdController } from "./controllers/rating/get-ratings-by-game-id.controller";
import { GetRatingsByUserIdController } from "./controllers/rating/get-ratings-by-user-id.controller";
import { GetAllRatingsController } from "./controllers/rating/get-all-ratings.controller";
import { CreateGameListController } from "./controllers/game-list/create-gamelist.controller";
import { GetGamelistsByUsernameController } from "./controllers/game-list/get-gamelist-by-username.controller";
import { GetGameListByIdController } from "./controllers/game-list/get-gamelist-by-id.controller";
import { CreateRatingController } from "./controllers/rating/create-rating.controller";
import { GetRatingByIdController } from "./controllers/rating/get-rating-by-id.controller";
import { UpdateRatingController } from "./controllers/rating/update-rating-by-id.controller";
import { CreateCommentController } from "./controllers/comment/create-comment.controller";
import { GetCommentsOnRatingController } from "./controllers/comment/get-comments-on-rating.controller";
import { GetCommentsOfAnUserController } from "./controllers/comment/get-user-comments.controller";
import { GetCommentByIdController } from "./controllers/comment/get-comment-byid.controller";
import { DeleteCommentByIdController } from "./controllers/comment/delete-comment-by-id.controller";
import { EditCommentController } from "./controllers/comment/edit-comment-by-id.controller";
import { CreatePlatformController } from "./controllers/game-platform/create-game-platform.controller";
import { DeletePlatformByIdController } from "./controllers/game-platform/delete-platform-by-id.controller";
import { EditPlatformByIdController } from "./controllers/game-platform/edit-platform-by-id.controller";
import { GetAllPlatformsController } from "./controllers/game-platform/get-all-platforms.controller";
import { GetPlatformByIdController } from "./controllers/game-platform/get-platform-by-id.controller";
import { CreateGenreController } from "./controllers/game-genre/create-game-genre.controller";
import { DeleteGenreByIdController } from "./controllers/game-genre/delete-game-genre.controller";
import { EditGenreByIdController } from "./controllers/game-genre/edit-game-genre.controller";
import { GetGenreByIdController } from "./controllers/game-genre/get-genre-by-id.controller";
import { GetAllGenresController } from "./controllers/game-genre/get-all-genres.controller";
import { DeleteGameListByIdController } from "./controllers/game-list/delete-gamelist-by-id.controller";
import { EditGameListByIdController } from "./controllers/game-list/edit-gamelist.controller";
import { AddGameOnListController } from "./controllers/game-gameList/add-game-on-game-list.controller";
import { AddGamesOnListController } from "./controllers/game-gameList/add-games-on-gamelist.controller";
import { RemoveGameOnListController } from "./controllers/game-gameList/remove-game-from-gamelist.controller";
import { FollowController } from "./controllers/follow/follow.controller";
import { FeedController } from "./controllers/feed/feed.controller";
import { GameStatusController } from "./controllers/game-status/game-status.controller";
import { UserStatisticsController } from "./controllers/user-statistics/user-statistics.controller";
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    // usuário
    AuthenticateController,
    CreateAccountController,
    DeleteMeController,
    DeleteUserController,
    EditAccountController,
    EditMeController,
    GetAllUsersController,
    GetMeController,
    GetUserByIdController,
    GetUserByUsernameController,

    // game
    CreateGameController,
    DeleteGameByIdController,
    EditGameController,
    GetAllGamesController,
    GetAllGamesWithSubstringController,
    GetGameByIdController,
    GetGameBySlugController,

    // Rating
    CreateRatingController,
    DeleteRatingByIdController,
    GetAllRatingsController,
    GetRatingsByGameIdController,
    GetRatingsByUserIdController,
    GetRatingByIdController,
    UpdateRatingController,

    // Comment
    CreateCommentController,
    DeleteCommentByIdController,
    EditCommentController,
    GetCommentByIdController,
    GetCommentsOfAnUserController,
    GetCommentsOnRatingController,

    // Gamelist
    CreateGameListController,
    DeleteGameListByIdController,
    EditGameListByIdController,
    GetGamelistsByUsernameController,
    GetGameListByIdController,

    // Platform
    CreatePlatformController,
    DeletePlatformByIdController,
    EditPlatformByIdController,
    GetAllPlatformsController,
    GetPlatformByIdController,

    // Genre
    CreateGenreController,
    DeleteGenreByIdController,
    EditGenreByIdController,
    GetGenreByIdController,
    GetAllGenresController,

    //Game-GameList
    AddGameOnListController,
    AddGamesOnListController,
    RemoveGameOnListController,

    // Follow
    FollowController,

    // FeedController
    FeedController,

    // GameStatus
    GameStatusController,

    // Statistics
    UserStatisticsController,
  ],
  providers: [PrismaService, CloudflareR2Service],
})
export class AppModule {}
