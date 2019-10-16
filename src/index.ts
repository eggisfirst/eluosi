import { Game } from "./core/Game";
import { GamePageViewer } from './core/viewer/GamePageViewer';

import $ from 'jquery'

var g = new Game(new GamePageViewer)

// g.start()

$('#stop').click(function() {
  g.pause()
})

$('#start').click(function() {
  g.start()
})

$('#right').click(function() {
  g.control_right()
})
$('#left').click(function() {
  g.control_left()
})
$('#down').click(function() {
  g.control_down()
})
$('#rotate').click(function() {
  g.control_rotate()
})