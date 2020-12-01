window.addEventListener('DOMContentLoaded', () => {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    let lmenu = document.getElementById("leftmenu");
    let rmenu = document.getElementById("rightmenu");

    canvas.width = 1000;
    canvas.height = 1000;

    window.onresize = updateCanvasDimensions;
    updateCanvasDimensions();

    function updateCanvasDimensions() {
        //if (window.innerWidth >= window.innerHeight) { //landscape/square
            rmenu.style.height = window.innerHeight + "px";
            lmenu.style.height = window.innerHeight + "px";

            rmenu.style.width = (window.innerWidth/2 - Math.min(window.innerWidth, window.innerHeight)/2) + "px";
            lmenu.style.width = (window.innerWidth/2 - Math.min(window.innerWidth, window.innerHeight)/2) + "px";

            rmenu.style.right = 0;

            canvas.style.width = Math.min(window.innerWidth-rmenu.offsetWidth*2, window.innerHeight) + "px";
            canvas.style.height = Math.min(window.innerWidth-rmenu.offsetWidth*2, window.innerHeight) + "px";
            canvas.style.left = (window.innerWidth/2 - canvas.offsetWidth/2) + "px";
            canvas.style.top = (window.innerHeight/2 - canvas.offsetHeight/2) + "px";
        //}
    }

    //glider
    let grid = [
        [0,1,0,0,0,0],
        [0,0,1,0,0,0],
        [1,1,1,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
    ];


    //r pentomino
    /*let w = 90;
    let h = 90;
    let grid = new Array(h);
    for (let y = 0; y < h; y++) {
        grid[y] = new Array(w);
        for (let x = 0; x < w; x++) {
            grid[y][x] = 0;
        }
    }
    grid[h/2][w/2] = 1;
    grid[h/2+1][w/2] = 1;
    grid[h/2-1][w/2] = 1;
    grid[h/2][w/2-1] = 1;
    grid[h/2-1][w/2+1] = 1;*/
    

    //random
    /*let grid = new Array(20);
    let h = grid.length;
    for (let y = 0; y < h; y++) {
        grid[y] = new Array(20);
        let w = grid[0].length;
        for (let x = 0; x < w; x++) {
            grid[y][x] = Math.floor(Math.random()*2);
        }
    }*/

    //empty
    /*let w = 100;
    let h = 100;
    let grid = new Array(h);
    for (let y = 0; y < h; y++) {
        grid[y] = new Array(w);
        for (let x = 0; x < w; x++) {
            grid[y][x] = 0;
        }
    }*/

    let runSpeed = 10;
    let running = true;
    let generation = 0;

    (function(){
        if (typeof(grid[0][0]) != "undefined" && running) {
            renderGrid(ctx, grid, generation);
            grid = stepSimulation(grid);
            generation += 1;
        }

        setTimeout(arguments.callee, 1000/runSpeed);
    })();

    clearGrid = function () {
        let size = document.getElementById("gridSizeSlider").value;
        grid = new Array(size);
        for (let y = 0; y < size; y++) {
            grid[y] = new Array(size);
            for (let x = 0; x < size; x++) {
                grid[y][x] = 0;
            }
        }
        generation = 0;
        renderGrid(ctx, grid, generation);
    }

    canvas.addEventListener("click", function (e) {
        if (!running) {
            let clickX = e.offsetX;
            let clickY = e.offsetY;
            let w = grid[0].length;
            let h = grid.length;
            let tileX = Math.floor(w*clickX/canvas.offsetWidth);
            let tileY = Math.floor(h*clickY/canvas.offsetHeight);
            grid[tileY][tileX] = grid[tileY][tileX] == 1 ? 0 : 1;
            renderGrid(ctx, grid, generation);
        }
    });

    let playorpause = document.getElementById("playorpause");
    playorpause.onclick = function () {
        if (this.innerHTML === "Pause simulation") {
            this.innerHTML = "Resume simulation";
            running = false;
        } else {
            this.innerHTML = "Pause simulation";
            running = true;
        }
        renderGrid(ctx, grid, generation);
    }

    document.getElementById("step").onclick = function () {
        if (typeof(grid[0][0]) != "undefined" && !running) {
            renderGrid(ctx, grid, generation);
            grid = stepSimulation(grid);
            generation += 1;
        }
    }

    document.getElementById("gridSizeSlider").oninput = function () {
        document.getElementById("gridSizeValueDisplay").innerHTML = this.value;
        grid = new Array(this.value);
        for (let y = 0; y < this.value; y++) {
            grid[y] = new Array(this.value);
            for (let x = 0; x < this.value; x++) {
                grid[y][x] = Math.floor(Math.random()*2);
            }
        }
        renderGrid(ctx, grid, generation);
    };

    document.getElementById("speedSlider").oninput = function () {
        document.getElementById("speedValueDisplay").innerHTML = this.value;
        runSpeed = this.value;
    };

    document.getElementById("save").onclick = function () {
        download("grid.json", JSON.stringify(grid));
    }

    document.getElementById("load").onclick = function () {
        var file = document.getElementById("loadGridJSON").files[0];
        const reader = new FileReader()
        reader.onload = function () {
            var contents = reader.result;
            loadGrid(JSON.parse(contents));
        };
        reader.readAsText(file)
    }

    function loadGrid(newGrid) {
        grid = newGrid;
        renderGrid(ctx, grid, generation);
        document.getElementById("gridSizeSlider").value = grid.length;
        document.getElementById("gridSizeValueDisplay").innerHTML = grid.length;
    }
});

function clearGrid() {};

function stepSimulation(grid) {
    //console.log(grid);
    let w = grid[0].length;
    let h = grid.length;
    let newGrid = new Array(h);
    for (let y = 0; y < h; y++) {
        newGrid[y] = new Array(w);
        for (let x = 0; x < w; x++) {
            let cell = grid[y][x];
            //console.log(cell);
            let neighborhood = getNeighbors(grid, x, y);
            let neighbors = sum(neighborhood[0]) + sum(neighborhood[1]) + sum(neighborhood[2]) - neighborhood[1][1];
            if (cell == 1) {
                //console.log("Test");
                if (neighbors == 2 || neighbors == 3) {
                    //console.log("Test2");
                    newGrid[y][x] = 1;
                } else {
                    newGrid[y][x] = 0;
                }
            } else {
                if (neighbors == 3) {
                    newGrid[y][x] = 1;
                } else {
                    newGrid[y][x] = 0;
                }
            }
            //console.log(grid, x, y, neighborhood, neighbors, newGrid[y][x]);
        }
    }
    //console.log(newGrid);
    return newGrid;
}

function sum(arr) {
    return arr.reduce(function(a, b){
        return a + b;
    }, 0);
}

function getNeighbors(grid, x, y) {
    let cell = grid[y][x];
    let w = grid[0].length;
    let h = grid.length;
    let l = x == 0; //touching the left edge
    let r = x == w - 1; //touching the right edge
    let t = y == 0; //touching the top edge
    let b = y == h - 1; //touching the bottom edge
    let neighbors = [
        [(l && !t) ? grid[y-1][w-1] : (!l && t) ? grid[h-1][x-1] : (l && t) ? grid[h-1][w-1] : grid[y-1][x-1], t ? grid[h-1][x] : grid[y-1][x],  (r && !t) ? grid[y-1][0] : (!r && t) ? grid[h-1][x+1] : (r && t) ? grid[h-1][0] : grid[y-1][x+1]],
        [l ? grid[y][w-1] : grid[y][x-1], cell, r ? grid[y][0] : grid[y][x+1]],
        [(l && !b) ? grid[y+1][w-1] : (!l && b) ? grid[0][x-1] : (l && b) ? grid[0][w-1] : grid[y+1][x-1], b ? grid[0][x] : grid[y+1][x],  (r && !b) ? grid[y+1][0] : (!r && b) ? grid[0][x+1] : (r && b) ? grid[0][0] : grid[y+1][x+1]]
    ];
    return neighbors;
}

function renderGrid(ctx, grid, generation) {
    document.getElementById("generation").innerHTML = "Generation " + generation;
    ctx.clearRect(0, 0, 1000, 1000);
    let w = grid[0].length;
    let h = grid.length;
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            if (grid[y][x] == 1) {
                ctx.fillRect(1000/w*x, 1000/h*y, 1000/w, 1000/h);
            }
        }
    }
}

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute(
        'href',
        'data:application/javascript;charset=utf-8,' + encodeURIComponent(text)
    );
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }
}