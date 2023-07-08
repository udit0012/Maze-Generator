import React, { useReducer, useState } from 'react'
import "./Maze.css"

type InputType = {
    row: number;
    col: number;
}
type gridType = {
    x: number;
    y: number;
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
    visited: boolean;
}

interface AppState {
    loading: boolean;
    iMazeBox:gridType[][]
    mazeBox: gridType[][];
    error: string
}
enum ActionType {
    FETCH = 'FETCH_BEGIN',
    SUCCESS = 'FECTH_SUCCESS',
    REGENERATE = 'FETCH_REGENERATE',
    FAIL = 'FETCH_FAIL',
}

// Define actions
interface FetchBegin {
    type: ActionType.FETCH;
}

interface FetchSuccess {
    type: ActionType.SUCCESS;
    payload: gridType[][];
}

interface FetchRegenerate {
    type: ActionType.REGENERATE;
    payload1: gridType[][];
}
interface FetchFail {
    type: ActionType.FAIL;
    payload: string;
}

type AppAction = FetchBegin | FetchFail | FetchSuccess | FetchRegenerate;

// Define reducer function
const reducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case ActionType.FETCH:
            return { ...state, loading: true };
        case ActionType.SUCCESS:
            return { ...state, loading: false, iMazeBox: action.payload };
        case ActionType.REGENERATE:
            return { ...state, loading: false, mazeBox: action.payload1 };
        case ActionType.FAIL:
            return { ...state, loading: false, error: action.payload };
        default:
            throw new Error('Invalid action');
    }
};
const Maze = () => {
    const initialInput: InputType = { row: 1, col: 1 }
    const [input, setInput] = React.useState<InputType>(initialInput);
    const [{ loading, error, mazeBox,iMazeBox }, dispatch] = useReducer(reducer, {
        loading: true,
        mazeBox:[],
        iMazeBox: [[{
            x: 0,
            y: 0,
            left: false,
            right: false,
            top: false,
            bottom: false,
            visited: false
        }]],
        error: "",
    })
    const createAMaze = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch({type:ActionType.FAIL,payload:""}) 
        dispatch({ type: ActionType.FETCH })
        if(input.row<2 || input.col<2 || input.row>20 || input.col>20) {dispatch({type:ActionType.FAIL,payload:"Not Possible"})
    }
        dispatch({type:ActionType.REGENERATE,payload1:[]})
        try {
            let maze: gridType[][] = []
            for (let i = 0; i < input.row; i++) {
                let rows: gridType[] = []
                for (let j = 0; j < input.col; j++) {
                    let obj: gridType = {
                        x: i,
                        y: j,
                        left: false,
                        right: false,
                        top: false,
                        bottom: false,
                        visited: false
                    }
                    rows.push(obj)
                }
                maze.push(rows)
            }
            dispatch({ type: ActionType.SUCCESS, payload: maze })
            try {
                let copyMaze = deepCopyArray(maze)
                let startcell = copyMaze[0][0];
                let maze1: gridType[][] = DFS(startcell, copyMaze)
                dispatch({type:ActionType.REGENERATE,payload1:maze1})
            } catch (error) {
                dispatch({type:ActionType.FAIL,payload:"I Not Possible"})
            }
            // dispatch({ type: ActionType.REGENERATE, payload: maze })
        } catch (error) {
            dispatch({ type: ActionType.FAIL, payload: "Not Possible" })
        }
    }
    const shuffleDirections = () => {
        const directions = ['top', 'right', 'bottom', 'left'];
        for (let i = directions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [directions[i], directions[j]] = [directions[j], directions[i]];
        }
        
        return directions;
    };
    function deepCopyArray(originalArray:gridType[][]) {
        const copiedArray:gridType[][] = [];
      
        for (let i = 0; i < originalArray.length; i++) {
          const innerArray = originalArray[i];
          const copiedInnerArray = [];
      
          for (let j = 0; j < innerArray.length; j++) {
            const originalObject = innerArray[j];
            const copiedObject = Object.assign({},originalObject);
      
            copiedInnerArray.push(copiedObject);
          }
      
          copiedArray.push(copiedInnerArray);
        }
      
        return copiedArray;
      }
    const generateMaze = () => {
        dispatch({type:ActionType.FAIL,payload:""}) 
        dispatch({ type: ActionType.FETCH })
        if(input.row<2 || input.col<2|| input.row>25 || input.col>25) {dispatch({type:ActionType.FAIL,payload:"Not Possible"})}
        try {
            let copyMaze = deepCopyArray(iMazeBox)
            let startcell = copyMaze[0][0];
            let maze1: gridType[][] = DFS(startcell, copyMaze)
            dispatch({type:ActionType.REGENERATE,payload1:maze1})
        } catch (error) {
            dispatch({type:ActionType.FAIL,payload:"Not Possible"})
        }
    }
    const DFS = (currentCell: gridType, mazebox: gridType[][]) => {
        let { x, y } = currentCell
        currentCell.visited = true
        const directions = shuffleDirections();

        for (const direction of directions) {

            let nextCell: gridType | null = null;
            let wallProperty: string = '';

            switch (direction) {
                case 'top':
                    if (x > 0 && !mazebox[x - 1][y].visited) {
                        nextCell = mazebox[x - 1][y];
                        wallProperty = 'top'
                    }
                    break
                case 'left':
                    if (y > 0 && !mazebox[x][y - 1].visited) {
                        nextCell = mazebox[x][y - 1];
                        wallProperty = 'left'
                    }
                    break
                case 'right':
                    if (y < input.col - 1 && !mazebox[x][y + 1].visited) {
                        nextCell = mazebox[x][y + 1];
                        wallProperty = 'right'
                    }
                    break
                case 'bottom':
                    if (x < input.row - 1 && !mazebox[x + 1][y].visited) {
                        nextCell = mazebox[x + 1][y];
                        wallProperty = 'bottom'
                    }
                    break
                default:
                    break;
            }
            if (nextCell) {
                if (wallProperty === 'left') {
                    currentCell.left = true
                    nextCell.right = true
                    if(x===0 && y===0){ console.log("cell left",nextCell,"current cell",currentCell)};
                }
                else if (wallProperty === 'right') {
                    currentCell.right = true
                    nextCell.left = true
                    if(x===0 && y===0){ console.log("cell right",nextCell,"current cell",currentCell)};
                    
                }
                else if (wallProperty === 'bottom') {
                    currentCell.bottom = true
                    nextCell.top = true
                    if(x===0 && y===0){ console.log("cell bottom",nextCell,"current cell",currentCell)};
                }
                else if (wallProperty === 'top') {
                    currentCell.top = true
                    nextCell.bottom = true
                    if(x===0 && y===0){ console.log("cell top",nextCell,"current cell",currentCell)};
                }
                DFS(nextCell, mazebox)
            }
        }
        return mazebox
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }
    console.log("initial",iMazeBox);
    console.log("current",mazeBox);
    
    return (
        <div className='maze'>
            <h1 className='head1'>Maze Generator</h1>
            <div className='flexContainer'>
                <div className='mazeContainer'>
                    <form className='mazeForm' onSubmit={createAMaze}>
                        <div className='inputBox'>
                            <label htmlFor="row" className='inputLabel'>Enter no. of row</label>
                            <input className='inputField' type="text" onChange={handleChange} value={input.row} name='row' />
                        </div>
                        <div className='inputBox'>
                            <label htmlFor="row" className='inputLabel'>Enter no. of col</label>
                            <input className='inputField' type="text" name='col' value={input.col} onChange={handleChange} />
                        </div>
                        <button className='btn btnOutline mt-10 mx-4' type="submit" >{mazeBox.length?"Re-g":"G"}enerate Maze</button>
                    </form>
                </div>
                <div className='mazeBox mt-10'>
                    {loading ? <div className='notice'>Select the Grid size (2-20)</div> :error?<div className='notice'>{error}</div>: <div className='mazeBoxes'>
                        {mazeBox.length ? mazeBox.map((grid: gridType[]) => {
                            return <div className='mazeRow'>
                                {grid.map((cell: gridType) => {
                                    return <div className='mazeCell' style={{ borderLeft: `${cell.left ? "1px solid transparent" : "1px solid aqua"}`, borderRight: `${cell.right ? "1px solid transparent" : "1px solid aqua"}`, borderBottom: `${cell.bottom ? "1px solid transparent" : "1px solid aqua"}`, borderTop: `${cell.top ? "1px solid transparent" : "1px solid aqua"}` }}>{cell.x===0 && cell.y===0 ? "S":""}{cell.x===input.row-1 && cell.y===input.col-1 ? "E":""}</div>
                                })}
                            </div>
                        }):iMazeBox.map((grid: gridType[]) => {
                            return <div className='mazeRow'>
                                {grid.map((cell: gridType) => {
                                    return <div className='mazeCell' style={{ borderLeft: `${cell.left ? "1px solid transparent" : "1px solid aqua"}`, borderRight: `${cell.right ? "1px solid transparent" : "1px solid aqua"}`, borderBottom: `${cell.bottom ? "1px solid transparent" : "1px solid aqua"}`, borderTop: `${cell.top ? "1px solid transparent" : "1px solid aqua"}` }}></div>
                                })}
                            </div>
                        })}
                    </div>}
                </div>
            </div>

        </div>
    )
}

export default Maze








// if(!result){
//     return resp.send("")
// }
// return resp.send("")
