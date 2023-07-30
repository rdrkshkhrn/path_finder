import React, {useState,useEffect} from "react";
import Node from "./Node"
import "./pathfind.css"
import Astar  from "../Astar algorithm/astar"
const rows = 10;
const cols = 20;
const end_row = rows-1;
const end_col = cols-1;
let actualpath = [];
let blockednode = [];
let flag = false;
let position_created = false;
let block_created = false;
let path_found = true;
let same_value = false;
let outofrange = false;
const Pathfind = ()=>{
    const [Grid,setGrid] = useState([]);
    const [Path,setPath] = useState([]);
    const [visited,setVisited] = useState([]);
    const [startrow,setStartrow] = useState('');
    const [startcol,setStartcol] = useState('');
    const [endrow,setEndrow] = useState('');
    const [endcol,setEndcol] = useState('');
    const [randomClicked, setRandom]  = useState(false);
    const [okClicked, setOk]  = useState(false);
    useEffect(()=>{
        flag = false;
        initialiseGrid();

    },[])

    // creates the grid.
    const initialiseGrid = ()=>{
        const grid = new Array(rows);

        for(let i=0;i<rows;i++){
            grid[i] = new Array(cols);
        }
        createSpot(grid);
        setGrid(grid);
    }
    const createblock = () => {
        
        blockednode = [];
        const grid = new Array(rows);
        flag = true;
        block_created = true;
        for(let i=0;i<rows;i++){
            grid[i] = new Array(cols);
        }
        //flag = true;
        createSpot(grid);
        setGrid(grid);
        addNeighbours(grid);

        const startNode = grid[startrow][startcol];
        const endNode = grid[endrow][endcol];
        let path = Astar(startNode,endNode);
        startNode.isWall = false;
        endNode.isWall = false;
        setPath(path.path);
        setVisited(path.visitednodes);
        path_found = path.path_found;
        flag = false;
        setRandom(true);
    };

    const createSpot = (grid)=>{
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                grid[i][j] = new Spot(i,j);
                if(grid[i][j].isWall){
                    blockednode.push({i,j});
                }
            }
        }
    }

    const addNeighbours = (grid)=>{
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                grid[i][j].addneighbours(grid);
            }
        }
    }
    // spot constructor
    function Spot(i,j) {
        this.x = i;
        this.y = j;
        this.isStart = position_created && (this.x===startrow && this.y === startcol);
        this.isEnd = position_created && (this.x===endrow && this.y ===endcol);
        this.g = 100;
        this.f = 100;
        this.h = 100;
        this.neighbours = [];
        this.isWall = false;
        if(flag && !this.isStart && !this.isEnd && Math.random(1) < 0.2){
            this.isWall = true;
            
        }
        if(!flag && blockednode.includes({i,j}))
            this.isWall = true;
            
        this.previous = undefined;
        this.addneighbours = function (grid){
            let i=this.x;
            let j = this.y;
            if(i>0 && !grid[i-1][j].isWall) this.neighbours.push(grid[i-1][j]);
            if(i<end_row && !grid[i+1][j].isWall) this.neighbours.push(grid[i+1][j]);
            if(j>0 && !grid[i][j-1].isWall) this.neighbours.push(grid[i][j-1]);
            if(j<end_col && !grid[i][j+1].isWall) this.neighbours.push(grid[i][j+1]);
            
        };
    }
    // grid with node
    //console.log(Grid);
    const gridwithNode = (
        <div>
            {Grid.map((row,rowIndex)=>{
                return (
                    <div key={rowIndex} className="rowWrapper">
                        {row.map((col,colIndex)=>{
                            const {isStart,isEnd,isWall} = col;
                            return <Node key={colIndex} isStart = {isStart} isEnd = {isEnd} row = {rowIndex} col = {colIndex} isWall = {isWall}/>
                        })}
                    </div>
                )
            })}
        </div>
    );
    const visualiseShoertestPath = (shortestPathNodes) =>{
        //document.getElementById(`node-${startrow}-${startcol}`).className = "nodee nodee-start";
        for(let i=0;i< shortestPathNodes.length;i++){
            
            setTimeout(() =>{
                const node = shortestPathNodes[i];
                if(!node.isStart && !node.isEnd)
                document.getElementById(`node-${node.x}-${node.y}`).className = "node node-shortest-path";
            },10*i)
        }
        
    };
    const visualisePath = () =>{
       if(!block_created)
       {
         //blockednode = [];
        const grid = new Array(rows);
        //flag = true;
        for(let i=0;i<rows;i++){
            grid[i] = new Array(cols);
        }
        createSpot(grid);
        setGrid(grid);
        addNeighbours(grid);

        const startNode = grid[startrow][startcol];
        const endNode = grid[endrow][endcol];
        let path = Astar(startNode,endNode);
        startNode.isWall = false;
        endNode.isWall = false;
        setPath(path.path);
        setVisited(path.visitednodes);
        path_found = path.path_found;
        //flag = false;
        }
        // else
        //     path_found = path_found1;
        for(let i=1;i<= visited.length;i++){
           if(i===visited.length){
                setTimeout(() =>{
                visualiseShoertestPath(Path);
                },20*i)
                document.getElementById(`node-${startrow}-${startcol}`).className = "node node-start";
                document.getElementById(`node-${endrow}-${endcol}`).className = "node node-end";
           }
           else{
            actualpath.push(visited[i]);
            setTimeout(()=>{
                const node = visited[i];
                if(!node.isStart)
                document.getElementById(`node-${node.x}-${node.y}`).className = "node node-visited";
            },20*i)
           }
        }
        
    };
    const clear_path = ()=>{
        window.location.reload(); 
    }
    const handlesubmitstart = (e)=>{
        e.preventDefault();
        if(startrow===endrow && startcol===endcol)
            same_value = true;
        if(startrow<0 || startrow>end_row || endrow<0 || endrow>end_row || startcol<0 || startcol>end_col || endcol<0 || endcol>end_col)
            outofrange = true;
        initialiseGrid();
        if(!same_value && !outofrange){
            document.getElementById(`node-${startrow}-${startcol}`).className = "node node-start";
            document.getElementById(`node-${endrow}-${endcol}`).className = "node node-end";
            position_created = true;
        }
       setOk(true);
    }
    return (
        <> 
            <div className="titleWrapper">
            <h1 className="h1">PathFinding Visualiser</h1>
            <h2 className="h2">(10 X 20 grid)</h2>
            </div>
            <form className="form">
                <div>
                    <label htmlFor="start_row">Start Row : </label>
                        <input 
                        type="text" 
                        id="start_row" 
                        name="start_row"
                        value={startrow}
                        onChange={(e) => setStartrow(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="start_col">Start Column : </label>
                        <input 
                        type="text" 
                        id="start_col" 
                        name="start_col"
                        value={startcol}
                        onChange={(e) => setStartcol(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="end_row">End Row : </label>
                        <input 
                        type="text" 
                        id="end_row" 
                        name="end_row"
                        value={endrow}
                        onChange={(e) => setEndrow(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="end_col">End Column : </label>
                        <input 
                        type="text" 
                        id="end_col" 
                        name="end_col"
                        value={endcol}
                        onChange={(e)=> setEndcol(e.target.value)}
                        />
                    </div>
                </form>
            <div>
            <button onClick={handlesubmitstart} className="form-btn">OK</button>
            </div>
            <div>
            {outofrange && <p className="para">Given value is out of range. please reset it!!!!</p>}
            {same_value && <p className="para">starting point is same as ending point. please reset it!!!!</p>}
            </div>
            <div className="Wrapper"> 
                <button onClick={okClicked? createblock : null} className="btn" style={{
                    color : okClicked? 'black':'grey'
                }}>create random block</button>
                <button onClick={randomClicked ? visualisePath : null} className="btn" style={{
                    color : randomClicked? 'black':'grey'
                }}>Visulaise Path</button>
                <button onClick={clear_path} className="btn">Reset</button>
                {gridwithNode}
            </div>
            <div>
            {!path_found && <p className="para">No path found!!!!</p>}
            </div>
            <div className="rowWrapper">
                <div className="nodee nodee-blocked"></div>
                <h3 className="h3">blocked node</h3>
                <div className="nodee"></div>
                <h3 className="h3">never visited node</h3>
            </div>
            <div className="rowWrapper" >
                <div className="nodee nodee-visited"></div>
                <h3 className="h3">visited node </h3>
                <div className="nodee nodee-shortest"></div>
                <h3 className="h3">shortest path node</h3>
            </div>
            <div style={{height: '60px'}}></div>
        </>
    )
}

export default Pathfind;