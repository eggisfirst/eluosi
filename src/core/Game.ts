import { GameStatus, MoveDirection, GameViewer } from "./types";
import { SquareGroup } from './SquareGroup';
import { createTeris } from "../Teris";
import { TerisRule } from './TerisRules';
import GameConfig from "./GameConfig";
import { Square } from "./Square";

//思考有哪些属性
export class Game {
  //游戏状态
  private _gameStatus: GameStatus = GameStatus.init
  //当前玩家操作的方块
  private _curTeris?: SquareGroup
  //下一个方块
  private _nextTeris: SquareGroup
  //计时器
  private _timer?: number
  //自动下落的间隔时间
  private _duration: number = 1000;
  //积分
  private _score: number = 0
  public get score() {
    return this._score
  }
  public set score(val) {
    this._score = val
    this._viewer.showScore(val)
  }
  /**
   * 当前游戏中，已存在的方块
   */
  private _exits: Square[] = [];

  constructor(private _viewer: GameViewer) {
    this._nextTeris = createTeris({ x: 0, y: 0 })//没有实际意义
    this.createNext()
    this._viewer.init(this)
  }

  /**
   * 创建下一个方块
   */
  private createNext() {
    this._nextTeris = createTeris({ x: 0, y: 0 })
    this.resetCenterPoint(GameConfig.nextSize.width, this._nextTeris)
    this._viewer.showNext(this._nextTeris)
  }
  /**
   * 初始化
   */
  private init() {
    this._exits.forEach(sq => {
      if (sq.viewer) {
        sq.viewer.remove()
      }
    })
    this._exits = [];
    this.createNext()
    this._curTeris = undefined;
    this.score = 0
  }
  /**游戏开始 */
  start() {
    //游戏状态的改变
    if (this._gameStatus === GameStatus.playing) {
      return
    }
    if (this._gameStatus === GameStatus.over) {
      this.init()
    }
    this._gameStatus = GameStatus.playing
    if (!this._curTeris) {
      //给当前玩家操作的方块赋值
      this.swichTeris()
    }
    this.autoDrop()

  }

  /**
   * 游戏暂停
   */
  pause() {
    if (this._gameStatus === GameStatus.playing) {
      this._gameStatus = GameStatus.pause
      clearInterval(this._timer)
      this._timer = undefined
    }
  }

  /**
   * 向左
   */
  control_left() {
    if (this._curTeris && this._gameStatus === GameStatus.playing) {
      TerisRule.move(this._curTeris, MoveDirection.left, this._exits)
    }
  }

  control_right() {
    if (this._curTeris && this._gameStatus === GameStatus.playing) {
      TerisRule.move(this._curTeris, MoveDirection.right, this._exits)
    }
  }
  control_down() {
    if (this._curTeris && this._gameStatus === GameStatus.playing) {
      TerisRule.moveDirectly(this._curTeris, MoveDirection.down, this._exits)
      //触底
      this.hitBottom()
    }
  }

  control_rotate() {
    if (this._curTeris && this._gameStatus === GameStatus.playing) {
      TerisRule.rotate(this._curTeris, this._exits)
    }
  }

  /**
   * 控制方块自由下落
   */
  private autoDrop() {
    if (this._timer || this._gameStatus !== GameStatus.playing) {
      return
    }
    this._timer = setInterval(() => {
      if (this._curTeris) {
        if (!TerisRule.move(this._curTeris, MoveDirection.down, this._exits)) {
          //触底
          this.hitBottom()
        }
      }
    }, this._duration)

  }

  /**
   * 切换方块
   */
  private swichTeris() {
    this._curTeris = this._nextTeris
    this._curTeris.squares.forEach(sq => {
      if (sq.viewer) {
        sq.viewer.remove()
      }
    })
    this.resetCenterPoint(GameConfig.panelSize.width, this._curTeris)
    //可能与之前的方块重叠
    console.log(this._curTeris.shape, this._curTeris.centerPoint)
    if (!TerisRule.canIMove(this._curTeris.shape, this._curTeris.centerPoint, this._exits)) {
      //游戏结束
      this._gameStatus = GameStatus.over
      clearInterval(this._timer)
      this._timer = undefined
      return
    }

    this.createNext()
    this._viewer.swtich(this._curTeris)
  }

  /**
   * 设置中心点坐标，达到让该方块出现在区域的中上方
   * @param width 
   * @param teris 
   */
  private resetCenterPoint(width: number, teris: SquareGroup) {
    const x = Math.ceil(width / 2)
    const y = 0
    teris.centerPoint = { x, y }
    while (teris.squares.some(it => it.point.y < 0)) {
      teris.centerPoint = {
        x: teris.centerPoint.x,
        y: teris.centerPoint.y + 1
      }
    }
  }

  /**
   * 触底
   */
  private hitBottom() {
    //将当前的俄罗斯方块包含的小方块加入到已存在的方块数组中
    this._exits.push(...this._curTeris!.squares)
    //处理移除
    const num = TerisRule.deleteSquares(this._exits)
    //增加积分
    this.addScore(num)
    //切换方块
    this.swichTeris()
  }

  //
  private addScore(lineNum: number) {
    if(lineNum === 0) {
      return
    }
    this.score += lineNum*10
  }
}