// D:\Nakama\src\games\basketclone\gameplay\GameplayEngine.ts
import { GameConfig } from "./core/GameConfig";
import { Physics } from "./core/Physics";
import { PlayerState, PlayerId, createPlayer } from "./entities/Player";
import { BallState, createBall } from "./entities/Ball";
import { HoopState, createHoop } from "./entities/Hoop";
import { ScoreState, createScoreState } from "./game/ScoreManager";
import { createPossessionState, resolvePossession, startReleaseCooldown } from "./game/PossessionManager";
import { resolveShotType, computeVelocity, ShotType } from "./game/ShotResolver";
import { resolveGroundCollision, resolveWallCollision, resolveHoopCollision } from "./game/CollisionManager";
import { GameplayState } from "./GameplayState";
import { PlayerInputState, createNeutralInput } from "./PlayerInput";

export class GameplayEngine {
  public static createInitialState(): GameplayState {
    const player1 = createPlayer(
      "player1",
      GameConfig.COURT_WIDTH * GameConfig.PLAYER1_START_X_RATIO,
      GameConfig.FLOOR_Y - GameConfig.PLAYER_HEIGHT,
      GameConfig.PLAYER_WIDTH,
      GameConfig.PLAYER_HEIGHT
    );
    const player2 = createPlayer(
      "player2",
      GameConfig.COURT_WIDTH * GameConfig.PLAYER2_START_X_RATIO,
      GameConfig.FLOOR_Y - GameConfig.PLAYER_HEIGHT,
      GameConfig.PLAYER_WIDTH,
      GameConfig.PLAYER_HEIGHT
    );
    const ball = createBall(player1.x + player1.width / 2, player1.y, GameConfig.BALL_RADIUS, player1.id);
    const hoops: ReadonlyArray<HoopState> = [
      createHoop(20, GameConfig.HOOP_Y, GameConfig.HOOP_WIDTH, GameConfig.HOOP_HEIGHT, "player2"),
      createHoop(
        GameConfig.COURT_WIDTH - 20 - GameConfig.HOOP_WIDTH,
        GameConfig.HOOP_Y,
        GameConfig.HOOP_WIDTH,
        GameConfig.HOOP_HEIGHT,
        "player1"
      ),
    ];
    const score = createScoreState();
    const possession = createPossessionState();

    return {
      player1,
      player2,
      ball,
      hoops,
      score,
      possession,
      roleByUserId: {},
      input: { player1: createNeutralInput(), player2: createNeutralInput() },
      previousInput: { player1: createNeutralInput(), player2: createNeutralInput() },
      isPaused: false,
      restartTimerSeconds: 0,
      pendingConcededPlayerId: null,
    };
  }

  public static assignRole(state: GameplayState, userId: string): PlayerId | null {
    const existingRole = state.roleByUserId[userId];
    if (existingRole) {
      return existingRole;
    }

    const takenRoles = new Set(Object.values(state.roleByUserId));
    const nextRole: PlayerId | null = !takenRoles.has("player1")
      ? "player1"
      : !takenRoles.has("player2")
      ? "player2"
      : null;

    if (nextRole) {
      state.roleByUserId[userId] = nextRole;
    }

    return nextRole;
  }

  public static update(state: GameplayState, deltaSeconds: number, logger: nkruntime.Logger): void {
    try {
      logger.info("[GameplayEngine.update] INÍCIO. typeof logger.debug: %s", typeof logger.debug);

      if (state.isPaused) {
        logger.info("[GameplayEngine.update] Chamando updatePause...");
        this.updatePause(state, deltaSeconds, logger);
        logger.info("[GameplayEngine.update] updatePause concluído.");
      } else {
        logger.info("[GameplayEngine.update] Chamando updateActive...");
        this.updateActive(state, deltaSeconds, logger);
        logger.info("[GameplayEngine.update] updateActive concluído.");
      }

      logger.info("[GameplayEngine.update] Chamando commitInputHistory...");
      this.commitInputHistory(state);
      logger.info("[GameplayEngine.update] commitInputHistory concluído.");
      logger.info("[GameplayEngine.update] FIM.");
    } catch (error) {
      logger.error(
        "[GameplayEngine.update] Erro crítico no loop da partida. Erro: %s",
        error instanceof Error ? error.stack ?? error.message : String(error)
      );
      throw error;
    }
  }

  public static buildSnapshot(state: GameplayState, logger: nkruntime.Logger): {
    player1: PlayerState;
    player2: PlayerState;
    ball: BallState;
    score: ScoreState;
    isPaused: boolean;
  } {
    logger.info("[GameplayEngine.buildSnapshot] INÍCIO.");
    logger.info("[GameplayEngine.buildSnapshot] Construindo snapshot diretamente dos POJOs.");

    const snapshot = {
      player1: { ...state.player1 },
      player2: { ...state.player2 },
      ball: { ...state.ball },
      score: { ...state.score },
      isPaused: state.isPaused,
    };

    logger.info("[GameplayEngine.buildSnapshot] FIM.");
    return snapshot;
  }

  private static updateActive(state: GameplayState, deltaSeconds: number, logger: nkruntime.Logger): void {
    logger.info("[GameplayEngine.updateActive] Chamando updatePlayerFromInput (player1)...");
    this.updatePlayerFromInput(
      state,
      state.player1,
      state.input.player1,
      state.previousInput.player1,
      deltaSeconds,
      logger
    );
    logger.info("[GameplayEngine.updateActive] updatePlayerFromInput (player1) concluído.");

    logger.info("[GameplayEngine.updateActive] Chamando updatePlayerFromInput (player2)...");
    this.updatePlayerFromInput(
      state,
      state.player2,
      state.input.player2,
      state.previousInput.player2,
      deltaSeconds,
      logger
    );
    logger.info("[GameplayEngine.updateActive] updatePlayerFromInput (player2) concluído.");

    logger.info("[GameplayEngine.updateActive] Chamando syncBallToHolder...");
    this.syncBallToHolder(state);
    logger.info("[GameplayEngine.updateActive] syncBallToHolder concluído.");

    logger.info("[GameplayEngine.updateActive] Chamando updateFreeBallPhysics...");
    this.updateFreeBallPhysics(state, deltaSeconds);
    logger.info("[GameplayEngine.updateActive] updateFreeBallPhysics concluído.");

    if (state.ball.holderId === null) {
      logger.info("[GameplayEngine.updateActive] Chamando resolveGroundCollision...");
      resolveGroundCollision(state.ball, logger);
      logger.info("[GameplayEngine.updateActive] resolveGroundCollision concluído.");

      logger.info("[GameplayEngine.updateActive] Chamando resolveWallCollision...");
      resolveWallCollision(state.ball, logger);
      logger.info("[GameplayEngine.updateActive] resolveWallCollision concluído.");

      logger.info("[GameplayEngine.updateActive] Chamando resolveHoopCollision...");
      const scoringPlayerId = resolveHoopCollision(state.ball, state.hoops, state.score, logger);
      logger.info("[GameplayEngine.updateActive] resolveHoopCollision concluído.");

      if (scoringPlayerId !== null) {
        this.handleBasketScored(state, scoringPlayerId, logger);
        return;
      }
    }

    logger.info("[GameplayEngine.updateActive] Chamando resolvePossession...");
    resolvePossession(state.possession, state.ball, state.player1, state.player2, deltaSeconds, logger);
    logger.info("[GameplayEngine.updateActive] resolvePossession concluído.");
  }

  private static updatePlayerFromInput(
    state: GameplayState,
    player: PlayerState,
    input: PlayerInputState,
    previousInput: PlayerInputState,
    deltaSeconds: number,
    logger: nkruntime.Logger
  ): void {
    player.vx = 0;
    if (input.moveLeft) {
      player.vx = -GameConfig.PLAYER_SPEED;
    }
    if (input.moveRight) {
      player.vx = GameConfig.PLAYER_SPEED;
    }
    if (player.vx > 0) {
      player.facingDirection = "right";
    } else if (player.vx < 0) {
      player.facingDirection = "left";
    }

    const jumpJustPressed = input.jumpHeld && !previousInput.jumpHeld;
    if (jumpJustPressed && player.isGrounded) {
      player.vy = GameConfig.JUMP_VELOCITY;
      player.isGrounded = false;
    }

    this.applyGroundedPhysics(player, deltaSeconds);

    const shootJustPressed = input.shootHeld && !previousInput.shootHeld;
    if (shootJustPressed && state.ball.holderId === player.id) {
      const shotType = resolveShotType(
        {
          isLeftPressed: input.moveLeft,
          isRightPressed: input.moveRight,
          isJumping: !player.isGrounded,
        },
        player.facingDirection
      );
      this.throwBall(state, player, shotType, logger);
    }
  }

  private static applyGroundedPhysics(player: PlayerState, deltaSeconds: number): void {
    Physics.applyGravity(player, deltaSeconds);
    Physics.integrate(player, deltaSeconds);
    Physics.clampHorizontal(player, 0, GameConfig.COURT_WIDTH - player.width);
    const floorLimit = GameConfig.FLOOR_Y - player.height;
    if (player.y >= floorLimit) {
      player.y = floorLimit;
      player.vy = 0;
      player.isGrounded = true;
    }
  }

  private static throwBall(
    state: GameplayState,
    shooter: PlayerState,
    shotType: ShotType,
    logger: nkruntime.Logger
  ): void {
    const velocity = computeVelocity(shotType, shooter.id);
    state.ball.holderId = null;
    state.ball.vx = velocity.vx;
    state.ball.vy = velocity.vy;
    startReleaseCooldown(state.possession);

    logger.info("[basketclone:match] %s arremessou (%s).", shooter.id, shotType);
  }

  private static syncBallToHolder(state: GameplayState): void {
    if (state.ball.holderId === null) {
      return;
    }
    const holder = state.ball.holderId === state.player1.id ? state.player1 : state.player2;
    state.ball.x = holder.x + holder.width / 2;
    state.ball.y = holder.y;
    state.ball.vx = 0;
    state.ball.vy = 0;
  }

  private static updateFreeBallPhysics(state: GameplayState, deltaSeconds: number): void {
    if (state.ball.holderId !== null) {
      return;
    }
    Physics.applyGravity(state.ball, deltaSeconds);
    Physics.integrate(state.ball, deltaSeconds);
  }

  private static handleBasketScored(
    state: GameplayState,
    scoringPlayerId: PlayerId,
    logger: nkruntime.Logger
  ): void {
    const concededPlayerId = scoringPlayerId === state.player1.id ? state.player2.id : state.player1.id;
    state.pendingConcededPlayerId = concededPlayerId;
    state.isPaused = true;
    state.restartTimerSeconds = GameConfig.RESTART_DELAY_SECONDS;

    state.player1.vx = 0;
    state.player1.vy = 0;
    state.player2.vx = 0;
    state.player2.vy = 0;
    state.ball.vx = 0;
    state.ball.vy = 0;

    logger.info(
      "[basketclone:match] Cesta de %s. Reinício em %ds.",
      scoringPlayerId,
      GameConfig.RESTART_DELAY_SECONDS
    );
  }

  private static updatePause(state: GameplayState, deltaSeconds: number, logger: nkruntime.Logger): void {
    state.restartTimerSeconds -= deltaSeconds;
    if (state.restartTimerSeconds > 0) {
      return;
    }
    state.isPaused = false;
    this.resetAfterBasket(state, state.pendingConcededPlayerId, logger);
    state.pendingConcededPlayerId = null;
  }

  private static resetAfterBasket(
    state: GameplayState,
    concededPlayerId: PlayerId | null,
    logger: nkruntime.Logger
  ): void {
    this.resetPlayerToStart(state.player1);
    this.resetPlayerToStart(state.player2);
    const receiver = concededPlayerId === state.player2.id ? state.player2 : state.player1;

    state.ball.holderId = receiver.id;
    state.ball.vx = 0;
    state.ball.vy = 0;
    state.ball.x = receiver.x + receiver.width / 2;
    state.ball.y = receiver.y;

    logger.info("[basketclone:match] Jogada reiniciada. Bola entregue a %s.", receiver.id);
  }

  private static resetPlayerToStart(player: PlayerState): void {
    const startXRatio =
      player.id === "player1" ? GameConfig.PLAYER1_START_X_RATIO : GameConfig.PLAYER2_START_X_RATIO;
    player.x = GameConfig.COURT_WIDTH * startXRatio;
    player.y = GameConfig.FLOOR_Y - player.height;
    player.vx = 0;
    player.vy = 0;
    player.isGrounded = true;
  }

  private static commitInputHistory(state: GameplayState): void {
    state.previousInput.player1 = { ...state.input.player1 };
    state.previousInput.player2 = { ...state.input.player2 };
  }
}