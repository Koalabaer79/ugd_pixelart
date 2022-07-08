import { Component, ViewChild, ElementRef } from '@angular/core';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  cells: number;
  colClass: string;
  picture: any = {};
  showCont: boolean;
  captureCont: boolean;
  delPic: boolean;
  palette: string[];
  picSizes: number[];
  mouseStatus: boolean;
  tool: string;
  brush: string;
  bucket: string;
  capturedImage: any;
  chosenColor: string;

  @ViewChild('downloadLink') downloadLink: ElementRef | undefined;

  constructor () {
    this.palette = [
      "#ff0000", "#0096ff", "#18a800", "#540084", "#000000", "#ffffff", "#b0ff62", "#ffc39b", "#7b3d00", "#fffc00", "#ff812d"
    ];
    this.picSizes = [
      8,12,16,32
    ]
    this.chosenColor = "";
    this.cells = 8;
    this.colClass = "";
    this.showCont = false;
    this.captureCont = false;
    this.delPic = false;
    this.mouseStatus = false;
    this.tool = "brush";
    this.brush = "tool hover";
    this.bucket = "tool";
  }  

  ngOnInit(): void {
    this.genCont(this.cells);
  }

  // Generating container with cells (default 8x8 cells)
  genCont(cells: number) {

    // Looping through defined amount of cells 
    for(let i=0; i<cells; i++) {     
      
      let row: string = "row"+i;

      // Create empty row object
      this.picture[row] = {};

      // Fill row object with columns with white backround
      for(let j=0; j<cells; j++) {
        let col = "col"+j;
        this.picture[row][col] = "#ffffff";
      }
    }

    // Define style class depending on amount of cells
    switch(cells) {
      case 8:
        this.colClass = "eins";
        break;
      case 12:
        this.colClass = "zwei";
        break;
      case 16:
        this.colClass = "drei";
        break;      
      case 32:
        this.colClass = "vier";
        break;
    }

    // After data for container is generated, make container visible
    this.showCont = true;
  }

  // Change amount of cells and generate new container
  choseSize(val:number) {
    this.picture = {};
    this.cells = val;
    this.genCont(val);
  }

  // Chose color to fill cells with
  chooseColor(color:string,id:string) {
    this.chosenColor = color;

    // Take away highlighting style class from div if containing
    for(let i=0; i<8; i++) {
      if(document.getElementById('color'+i)!.classList.contains('chosen')) {
        document.getElementById('color'+i)!.classList.remove('chosen');
      }
    }
    
    // Adding style class to chosen color div
    document.getElementById(id)!.classList.add('chosen');
  }

  // Choose tool to paint / fill
  chooseTool(val:string) {
   this.tool = val;

   // Highlighting class to button
   switch(val) {
    case "brush":
      this.brush = "tool hover";
      this.bucket = "tool";
      break;
    case "bucket":
      this.brush = "tool";
      this.bucket = "tool hover";
      break;
   }
  }

  // Set mouse active and check what div the mouse is over
  startRecording(val:any) {
    this.mouseStatus = true;
    this.detectDiv(val);
  }

  // Set mouse innactive 
  stopRecording() {
    this.mouseStatus = false;
  }

  // If mouse is active start painting when moving
  detectDiv(val:any) {
    if(this.mouseStatus == true) {
      let id = val.path[0].id;

      // Paint of fill with color, depending on what tool has been chosen
      if(this.tool == "brush") {
        this.paint(id);
      }else if(this.tool == "bucket") {
        this.fillColor(id);
      }      
    }
  }

  // Fill cells with chosen color
  paint(id:string) {
    if(this.chosenColor != "") {
      document.getElementById(id)!.style.backgroundColor = this.chosenColor;
    }
  }

  // Fill cell and attaching cells (top, bottom, left, right) with chosen color
  fillColor(id:string) {
    // Split cell id in row and column
    let splittedId = this.splitId(id);
    // Get the color of the clicked cell
    let colorFound = this.picture[splittedId.row][splittedId.col];
    // Create object of attaching cell
    let neighbours = this.checkNeighbours(id);
    // Fill clicked cell with chosen color
    this.picture[splittedId.row][splittedId.col] = this.chosenColor;

    // If neighbouring cells have the same color of the clicked cell, fill them with chosen color
    if(this.picture[neighbours.top[0]][neighbours.top[1]] == colorFound) {
      
      this.picture[neighbours.top[0]][neighbours.top[1]] = this.chosenColor;
    }
    if(this.picture[neighbours.bottom[0]][neighbours.bottom[1]] == colorFound) {
      this.picture[neighbours.bottom[0]][neighbours.bottom[1]] = this.chosenColor;
    }
    if(this.picture[neighbours.left[0]][neighbours.left[1]] == colorFound) {
      this.picture[neighbours.left[0]][neighbours.left[1]] = this.chosenColor;
    }
    if(this.picture[neighbours.right[0]][neighbours.right[1]] == colorFound) {
      this.picture[neighbours.right[0]][neighbours.right[1]] = this.chosenColor;
    }
  }

  // Return object with attached cells of clicked cell
  checkNeighbours(id:string) {
    let splittedId = this.splitId(id);
    let arr: any = [];

    // Check if neighbour cells are still in range (not less than 0 or higher than amount of total cells in row / column)
    if(splittedId.rowNum - 1 >= 0) {
      arr['top'] = ["row"+(splittedId.rowNum - 1),splittedId.col];
    }if(splittedId.rowNum + 1 <= this.cells) {
      arr['bottom'] = ["row"+(splittedId.rowNum + 1),splittedId.col];
    }
    if((splittedId.colNum - 1) >= 0) {
      arr['left'] = [splittedId.row,"col"+(splittedId.colNum - 1)];
    }if((splittedId.colNum + 1) <= this.cells) {
      arr['right'] = [splittedId.row,"col"+(splittedId.colNum + 1)];
    }

    return arr;
  }

  // Function to split cell id in row number and column number
  splitId(id:string) {
    let split = id.split('-');
    let row = split[0];
    let rowNum:number = parseInt(row.replace("row",''));
    let col = split [1];
    let colNum:number = parseInt(col.replace("col",''));
    return {
      row: row,
      col: col,
      rowNum: rowNum,
      colNum: colNum
    }
  }

  // Generate canvas DOM from cell container
  genPic() {
    html2canvas(document.getElementById('capture')!).then(function (canvas: any) {
      document.getElementById('capturedImage')!.innerHTML = "";
      canvas.setAttribute('id',"generatedPic");
      document.getElementById('capturedImage')!.appendChild(canvas);
    });

    // Show image div and button
    this.captureCont = true;
    this.delPic = true;
  }

  // Remove / delete canvas DOM
  delPreview() {

    // Hide image div and button
    this.captureCont = false;
    this.delPic = false;

    // Empty image div
    document.getElementById('capturedImage')!.innerHTML = "";
  }

  // Saving canvas to desired picture format
  saveAs(type:string) {
    console.log(type)
    let canvas = <HTMLCanvasElement> document.getElementById('generatedPic');
    this.downloadLink!.nativeElement.href = canvas.toDataURL('image/'+type);
    this.downloadLink!.nativeElement.download = 'PixelArt.'+type;
    this.downloadLink!.nativeElement.click();
  }
}