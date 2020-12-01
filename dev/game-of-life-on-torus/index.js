window.addEventListener('DOMContentLoaded', () => {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    canvas.width = 1000;
    canvas.height = 1000;

    window.onresize = updateCanvasDimensions;
    updateCanvasDimensions();

    function updateCanvasDimensions() {
        canvas.style.width = Math.min(window.innerWidth, window.innerHeight) + "px";
        canvas.style.height = Math.min(window.innerWidth, window.innerHeight) + "px";
        canvas.style.left = (window.innerWidth/2 - canvas.offsetWidth/2) + "px";
        canvas.style.top = (window.innerHeight/2 - canvas.offsetHeight/2) + "px";
    }

    let runSpeed = 10;

    //glider
    /*let grid = [
        [0,1,0,0,0,0],
        [0,0,1,0,0,0],
        [1,1,1,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
    ];*/

    //random
    let grid = new Array(20);
    let h = grid.length;
    for (let y = 0; y < h; y++) {
        grid[y] = new Array(20);
        let w = grid[0].length;
        for (let x = 0; x < w; x++) {
            grid[y][x] = Math.floor(Math.random()*2);
        }
    }

    (function(){
        if (typeof(grid[0][0]) != "undefined") {
            renderGrid(ctx, grid);
            grid = stepSimulation(grid);
        }

        setTimeout(arguments.callee, 1000/runSpeed);
    })();
});

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

function renderGrid(ctx, grid) {
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