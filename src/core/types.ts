import { SquareGroup } from './SquareGroup';
import { Game } from './Game';

export interface Point {
  readonly x: number
  readonly y: number
}

export interface IViewer {
  //显示
  show(): void
  //移除不再显示
  remove(): void
}

/**形状
 *@param
 *
 */
export type Shape = Point[]


/**
 * 移动方向
 */

export enum MoveDirection {
  left,
  right,
  down
}

export enum GameStatus {
  init,
  playing,
  pause,
  over
}


export interface GameViewer {
  /**
   * 
   * @param teris 下一个方块对象
   */
  showNext(teris:SquareGroup): void,
  /**
   * 
   * @param teris 切换的方块对象
   */
  swtich(teris:SquareGroup):void
  /**
   * 完成界面初始化
   */
  init(game:Game): void

  showScore(score: number) :void
}