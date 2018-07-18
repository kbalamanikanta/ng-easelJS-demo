import { Component } from '@angular/core';

declare var createjs: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  canvas;
  stage;
  drawingCanvas;
  oldPt;
  oldMidPt;
  title;
  color;
  stroke;
  colors;
  index;

  ngOnInit() {
    this.canvas = document.getElementById("myCanvas");
    this.index = 0;
    this.colors = ["#828b20", "#b0ac31", "#cbc53d", "#fad779", "#f9e4ad", "#faf2db", "#563512", "#9b4a0b", "#d36600", "#fe8a00", "#f9a71f"];
    //check to see if we are running in a browser with touch support
    this.stage = new createjs.Stage(this.canvas);
    this.stage.autoClear = false;
    this.stage.enableDOMEvents(true);
    createjs.Touch.enable(this.stage);
    createjs.Ticker.framerate = 24;
    this.drawingCanvas = new createjs.Shape();
    this.stage.addEventListener("stagemousedown", this.handleMouseDown);
    this.stage.addEventListener("stagemouseup", this.handleMouseUp);
    this.title = new createjs.Text("Please sign here", "36px Arial", "#777777");
    this.title.x = 300;
    this.title.y = 200;
    this.stage.addChild(this.title);
    this.stage.addChild(this.drawingCanvas);
    this.stage.update();
  }

  handleMouseDown = (event) => {
    if (!event.primary) { return; }
    if (this.stage.contains(this.title)) {
      this.stage.clear();
      this.stage.removeChild(this.title);
    }
    this.color = this.colors[(this.index++) % this.colors.length];
    this.stroke = Math.random() * 30 + 10 | 0;
    this.oldPt = new createjs.Point(this.stage.mouseX, this.stage.mouseY);
    this.oldMidPt = this.oldPt.clone();
    this.stage.addEventListener("stagemousemove", this.handleMouseMove);
  }


  handleMouseMove = (event) => {
    if (!event.primary) { return; }
    var midPt = new createjs.Point(this.oldPt.x + this.stage.mouseX >> 1, this.oldPt.y + this.stage.mouseY >> 1);
    this.drawingCanvas.graphics.clear().setStrokeStyle(this.stroke, 'round', 'round').beginStroke(this.color).moveTo(midPt.x, midPt.y).curveTo(this.oldPt.x, this.oldPt.y, this.oldMidPt.x, this.oldMidPt.y);
    this.oldPt.x = this.stage.mouseX;
    this.oldPt.y = this.stage.mouseY;
    this.oldMidPt.x = midPt.x;
    this.oldMidPt.y = midPt.y;
    this.stage.update();
  }

  handleMouseUp = (event) => {
    if (!event.primary) { return; }
    this.stage.removeEventListener("stagemousemove", this.handleMouseMove);
  }
  reset(){
    this.stage.clear();
  }
}
