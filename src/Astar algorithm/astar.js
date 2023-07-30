let path_found = false;
function Astar (startNode,endNode)
{
    startNode.g=0;
    startNode.f=0;
    startNode.h=0;
    endNode.isEnd = true;
    startNode.isStart = true;
    console.log(endNode)
    let openSet = []
    let closeSet = []
    let path = []
    let visitednodes = [];
    openSet.push(startNode);
    while(openSet.length>0){
        let leastIndex = 0;
        for(let i=0;i<openSet.length;i++){
            if(openSet[i].f<openSet[leastIndex].f){
                leastIndex = i;
            }
        }

        let current = openSet[leastIndex];
        visitednodes.push(current);
        if(current===endNode){
            let temp  = current;
            //path.push(temp);
            while(temp.previous){
                path.push(temp.previous);
                temp = temp.previous;
            }
            path.pop();
            visitednodes.pop();
            path_found = true;
            return {path,visitednodes,path_found};
        }

        openSet = openSet.filter((elt)=> elt!== current);
        closeSet.push(current);

        let neighbours = current.neighbours;
        for(let i=0;i<neighbours.length;i++){
            let neighbour = neighbours[i];
            if(neighbour===endNode){
                let temp  = current;
                path.push(temp);
                while(temp.previous){
                    path.push(temp.previous);
                    temp = temp.previous;
                }
                path.pop();
                //visitednodes.pop();
                path_found = true;
                return {path,visitednodes,path_found};
            }
            if(!closeSet.includes(neighbour)){
                 let tempG = current.g + 1;
                 let newPath = false;
                if(openSet.includes(neighbour)){
                    if(tempG<neighbour.g){
                        neighbour.g = tempG;
                        newPath = true;
                    }
                }
                else {
                    neighbour.g = tempG;
                    newPath = true;
                    openSet.push(neighbour);
                } 
                if(newPath){
                    neighbour.h = herustic(neighbour,endNode);
                    neighbour.f = neighbour.g + neighbour.h;
                    neighbour.previous = current
                }
            }
        }
     }
     return {path,visitednodes, path_found};
}

function herustic(a,b){
    let d = Math.abs(a.x-a.y) + Math.abs(b.x-b.y);
    return d;
}

export default Astar;