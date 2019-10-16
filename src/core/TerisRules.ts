import { Shape, Point, MoveDirection } from "./types";
import GameConfig from "./GameConfig";
import { SquareGroup } from './SquareGroup';
import { Square } from "./Square";

/**判断是否是坐标 */
function isPoint(obj: any): obj is Point {
  if (typeof obj.x === 'undefined') {
    return false
  }
  return true
}

/**
 * 该类中提供一系列的函数，根据游戏规则判断各种情况
 */

export class TerisRule {
  /**
   * 判断某个形状的方块，是否能移动到目标位置
   * @param  
   */
  static canIMove(shape: Shape, targetPoint: Point, exits: Square[]): boolean {
    //假设中心点已经移动到了目标位置，算出每个小方块的坐标
    const targetSquarePoints: Point[] = shape.map(it => {
      return {
        x: it.x + targetPoint.x,
        y: it.y + targetPoint.y
      }
    })
    //边界判断
    let result = targetSquarePoints.some(p => {
      //是否超出边界
      return p.x < 0 || p.x > GameConfig.panelSize.width - 1 ||
        p.y < 0 || p.y > GameConfig.panelSize.height - 1
    })
    if (result) {
      return false;
    }

    //判断是否与已有的方块有重叠
    result = targetSquarePoints
      .some(p => exits.some(sq => sq.point.x === p.x && sq.point.y === p.y))
    if (result) {
      return false
    }
    return true
  }



  static move(teris: SquareGroup, targetPoint: Point, exits: Square[]): boolean;
  static move(teris: SquareGroup, Direction: MoveDirection, exits: Square[]): boolean;
  static move(teris: SquareGroup, targetPointOrDirection: Point | MoveDirection, exits: Square[]): boolean {
    if (isPoint(targetPointOrDirection)) {
      if (this.canIMove(teris.shape, targetPointOrDirection, exits)) {
        teris.centerPoint = targetPointOrDirection;
        return true
      }
      return false
    }
    else {
      const direction = targetPointOrDirection
      let targetPoint: Point
      if (direction === MoveDirection.down) {
        targetPoint = {
          x: teris.centerPoint.x,
          y: teris.centerPoint.y + 1
        }
      }
      else if (direction === MoveDirection.left) {
        targetPoint = {
          x: teris.centerPoint.x - 1,
          y: teris.centerPoint.y
        }
      }
      else {
        targetPoint = {
          x: teris.centerPoint.x + 1,
          y: teris.centerPoint.y
        }
      }
      return this.move(teris, targetPoint, exits)


    }
  }

  /**
   * 将当前的方块，移动到目标方向的终点
   */
  static moveDirectly(teris: SquareGroup, direction: MoveDirection, exits: Square[]) {
    while (this.move(teris, direction, exits)) {
    }
  }

  static rotate(teris: SquareGroup, exits: Square[]): boolean {
    const newShape = teris.afterRotateShape()
    if (this.canIMove(newShape, teris.centerPoint, exits)) {
      teris.rotate()
      return true
    }
    else {
      return false
    }
  }
  /**
   * 根据y坐标，得到所有y坐标为此值的方块
   * @param exits 
   * @param y 
   */
  private static getLineSquares(exits: Square[], y: number) {
    return exits.filter(sq => sq.point.y === y)
  }

  /**
   * 从已存在的方块中进行消除，并返回消除的行数
   * @param exits 
   */
  static deleteSquares(exits: Square[]): number {
    // 1. 获得y坐标数组
    const ys = exits.map(sq => sq.point.y)
    //2.获取最大和最小的y坐标
    const maxY = Math.max(...ys)
    const minY = Math.min(...ys)
    //3.循环判断每一行是否可以消除
    let num = 0
    for (let y = minY; y <= maxY; y++) {
      if (this.deleteLinte(exits, y)) {
        num++
      }
    }
    return num

  }

  /**
   * 消除一行
   * @param exits 
   * @param line 
   */
  private static deleteLinte(exits: Square[], y: number): boolean {
    const squares = this.getLineSquares(exits, y)
    if (squares.length === GameConfig.panelSize.width) {
      //这一行可以消除
      squares.forEach(sq => {
        //1.从界面移除
        if (sq.viewer) {
          sq.viewer.remove()
        }
        const index = exits.indexOf(sq)
        exits.splice(index, 1)
      })
      //2.剩下的，y坐标比当前的小的全部要+1
      exits.filter(sq => sq.point.y < y).forEach(sq => {
        sq.point = {
          x: sq.point.x,
          y: sq.point.y + 1
        }
      })
      return true
    }
    return false
  }
}
