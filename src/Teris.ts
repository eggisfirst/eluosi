import { Shape, Point } from "./core/types";
import { getRandom } from './utils';
import { SquareGroup } from './core/SquareGroup';

export class TShape extends SquareGroup {
  constructor(
    _centerPoint: Point,
    _color:string) {
      super(
        [{x:-1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}, {x:0, y:-1}],
        _centerPoint,_color);
  }
}


// export const TShape:Shape = [
//   {x:-1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}, {x:0, y:-1}
// ]
export class LShape extends SquareGroup {
  constructor(
    _centerPoint: Point,
    _color:string) {
      super(
        [{x: -2, y: 0},{x: -1,y:0},{x:0,y:0},{x:0,y:-1}],
        _centerPoint,_color);
  }
}

export class LMirrorShape extends SquareGroup {
  constructor(
    _centerPoint: Point,
    _color:string) {
      super(
        [ {x:2, y: 0}, {x: 1, y: 0}, {x: 0, y: 0}, {x:0, y:-1}],
        _centerPoint,_color);
  }

}

export class SShape extends SquareGroup {
  constructor(
    _centerPoint: Point,
    _color:string) {
      super(
        [{x:0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x:-1, y:1}],
        _centerPoint,_color);
  }

  rotate() {
    super.rotate()
    this.isClock = !this.isClock
  }
}

export class SMirrorShape extends SquareGroup {
  constructor(
    _centerPoint: Point,
    _color:string) {
      super(
        [ {x:0, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x:1, y:1}],
        _centerPoint,_color);
  }
  /**先顺时针再逆时针 */
  rotate() {
    super.rotate()
    this.isClock = !this.isClock
  }
}

export class SquartShape extends SquareGroup {
  constructor(
    _centerPoint: Point,
    _color:string) {
      super(
        [{x:0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x:1, y:1}],
        _centerPoint,_color);
  }
  /**不旋转 */
  afterRotateShape() {
    return this.shape
  }
}

export class LineShape extends SquareGroup {
  constructor(
    _centerPoint: Point,
    _color:string) {
      super(
        [ {x:0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}, {x:0, y:2}],
        _centerPoint,_color);
  }
  rotate() {
    super.rotate()
    this.isClock = !this.isClock
  }
}


export const shapes = [
  TShape,
  LShape,
  LMirrorShape,
  SShape,
  SMirrorShape,
  SquartShape,
  LineShape
]

export const colors = [
  'red',
  '#fff',
  '#007aff',
  'green',
  'orange'
]
/**
 * 随机产生一个俄罗斯方块（颜色 形状随机）
 */
export function createTeris (centerPoint: Point):SquareGroup {
  let index = getRandom(0, shapes.length)
  const shape = shapes[index]
  index = getRandom(0, colors.length)
  const color = colors[index]
  return new shape(centerPoint, color)
}
