import { GameViewer } from "../types";
import { SquareGroup } from '../SquareGroup';
import { SquarePageViewer } from './SquarePageViewer';
import $ from 'jquery'
import { Game } from '../Game';
import GameConfig from "../GameConfig";
import PageConfig from "./PageConfig";

export class GamePageViewer implements GameViewer {
  private nextDom = $('#next')
  private panelDom = $('#panel')

  showNext(teris: SquareGroup): void {
    teris.squares.forEach(sq => {
      sq.viewer = new SquarePageViewer(sq, this.nextDom)
    })
  }
  swtich(teris: SquareGroup): void {
    teris.squares.forEach(sq => {
      sq.viewer!.remove();
      sq.viewer = new SquarePageViewer(sq, this.panelDom)
    })
  }

  init(game: Game): void {
    //1.设置宽高
    this.panelDom.css({
      width: GameConfig.panelSize.width * PageConfig.SquareSize.width,
      height: GameConfig.panelSize.height * PageConfig.SquareSize.height,
    })

    this.nextDom.css({
      width: GameConfig.nextSize.width * PageConfig.SquareSize.width,
      height: GameConfig.nextSize.height * PageConfig.SquareSize.height,
    })
    //2.注册键盘事件
    $(document).keydown((e) => {
      if(e.keyCode === 37) {
        game.control_left()
      }
      else if(e.keyCode === 38) {
        game.control_rotate()
      }
      else if(e.keyCode === 39) {
        game.control_right()
      }
      else if(e.keyCode === 40) {
        game.control_down()
      }
    })

  }
}