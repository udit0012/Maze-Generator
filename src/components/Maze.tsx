import React, { useEffect, useReducer, useState } from 'react'
import "./Maze.css"
import Typed from "typed.js"
import { Link } from 'react-router-dom';

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
    path: boolean;
}

interface AppState {
    loading: boolean;
    iMazeBox: gridType[][]
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
    const [{ loading, error, mazeBox, iMazeBox }, dispatch] = useReducer(reducer, {
        loading: true,
        mazeBox: [],
        iMazeBox: [[{
            x: 0,
            y: 0,
            left: false,
            right: false,
            top: false,
            bottom: false,
            visited: false,
            path: false
        }]],
        error: "",
    })
    const [current, setCurrent] = useState<gridType>({
        x: 0,
        y: 0,
        left: false,
        right: false,
        top: false,
        bottom: false,
        visited: false,
        path: false
    })
    const [moves, setMoves] = useState(0)
    const createAMaze = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch({ type: ActionType.FAIL, payload: "" })
        dispatch({ type: ActionType.FETCH })
        if (input.row < 2 || input.col < 2 || input.row > 20 || input.col > 20) {
            dispatch({ type: ActionType.FAIL, payload: "Not Possible" })
        }
        dispatch({ type: ActionType.REGENERATE, payload1: [] })
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
                        visited: false,
                        path: false
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
                dispatch({ type: ActionType.REGENERATE, payload1: maze1 })
                setCurrent(maze1[0][0])
                setMoves(0);
            } catch (error) {
                dispatch({ type: ActionType.FAIL, payload: "I Not Possible" })
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
    function deepCopyArray(originalArray: gridType[][]) {
        const copiedArray: gridType[][] = [];

        for (let i = 0; i < originalArray.length; i++) {
            const innerArray = originalArray[i];
            const copiedInnerArray = [];

            for (let j = 0; j < innerArray.length; j++) {
                const originalObject = innerArray[j];
                const copiedObject = Object.assign({}, originalObject);

                copiedInnerArray.push(copiedObject);
            }

            copiedArray.push(copiedInnerArray);
        }

        return copiedArray;
    }
    // const generateMaze = () => {
    //     dispatch({ type: ActionType.FAIL, payload: "" })
    //     dispatch({ type: ActionType.FETCH })
    //     if (input.row < 2 || input.col < 2 || input.row > 25 || input.col > 25) { dispatch({ type: ActionType.FAIL, payload: "Not Possible" }) }
    //     try {
    //         let copyMaze = deepCopyArray(iMazeBox)
    //         let startcell = copyMaze[0][0];
    //         let maze1: gridType[][] = DFS(startcell, copyMaze)
    //         dispatch({ type: ActionType.REGENERATE, payload1: maze1 })
    //     } catch (error) {
    //         dispatch({ type: ActionType.FAIL, payload: "Not Possible" })
    //     }
    // }
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
                    if (x === 0 && y === 0) { console.log("cell left", nextCell, "current cell", currentCell) };
                }
                else if (wallProperty === 'right') {
                    currentCell.right = true
                    nextCell.left = true
                    if (x === 0 && y === 0) { console.log("cell right", nextCell, "current cell", currentCell) };

                }
                else if (wallProperty === 'bottom') {
                    currentCell.bottom = true
                    nextCell.top = true
                    if (x === 0 && y === 0) { console.log("cell bottom", nextCell, "current cell", currentCell) };
                }
                else if (wallProperty === 'top') {
                    currentCell.top = true
                    nextCell.bottom = true
                    if (x === 0 && y === 0) { console.log("cell top", nextCell, "current cell", currentCell) };
                }
                DFS(nextCell, mazebox)
            }
        }
        return mazebox
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }
    const moveLeft = () => {
        if (current?.y > 0 && current.left) {
            setMoves(moves + 1)
            setCurrent(mazeBox[current.x][current.y - 1])
        }
    }
    const moveTop = () => {
        if (current?.x > 0 && current.top) {
            setMoves(moves + 1)
            setCurrent(mazeBox[current.x - 1][current.y])
        }
    }
    const moveBottom = () => {
        if (current?.x < input.row - 1 && current.bottom) {
            setMoves(moves + 1)
            setCurrent(mazeBox[current.x + 1][current.y])
        }
    }
    const moveRight = () => {
        if (current?.y < input.col - 1 && current.right) {
            setMoves(moves + 1)
            setCurrent(mazeBox[current.x][current.y + 1])
        }
    }
    console.log("initial", iMazeBox);
    const el = React.useRef(null)
    useEffect(() => {
        var type = new Typed(el.current, {
            strings: ['Generator', 'Game'],
            typeSpeed: 150,
            backSpeed: 100,
            loop: true
        })
        return () => {
            type.destroy()
        }
    }, [])


    console.log("current", mazeBox);

    return (
        <div className='maze'>
            <h1 className='head1'>Maze <span ref={el}></span></h1>
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
                        <button className='btn btnOutline mt-10 mx-4' type="submit" >{mazeBox.length ? "Re-g" : "G"}enerate Maze</button>
                    </form>
                </div>
                <div className='mazeFlexBox mt-10'>
                    {loading && <div className='notice'>Select the Maze size (2-20)</div>}
                    {error && <div className='notice'>{error}</div>}
                    {!loading && !error && <div className='mazeBox'>
                        {<div className='mazeBoxes'>
                            {mazeBox.length ? mazeBox.map((grid: gridType[]) => {
                                return <div className='mazeRow'>
                                    {grid.map((cell: gridType) => {
                                        return <div className='mazeCell' style={{ transition: "1s", background: current.x === cell.x && current.y === cell.y ? "aqua" : "transparent", color: current.x === cell.x && current.y === cell.y ? "black" : "aqua", borderLeft: `${cell.left ? "1px solid transparent" : "1px solid aqua"}`, borderRight: `${cell.right ? "1px solid transparent" : "1px solid aqua"}`, borderBottom: `${cell.bottom ? "1px solid transparent" : "1px solid aqua"}`, borderTop: `${cell.top ? "1px solid transparent" : "1px solid aqua"}` }}>{cell.x === 0 && cell.y === 0 ? "S" : ""}{cell.x === input.row - 1 && cell.y === input.col - 1 ? "E" : ""} </div>
                                    })}
                                </div>
                            }) : iMazeBox.map((grid: gridType[]) => {
                                return <div className='mazeRow'>
                                    {grid.map((cell: gridType) => {
                                        return <div className='mazeCell' style={{ borderLeft: `${cell.left ? "1px solid transparent" : "1px solid aqua"}`, borderRight: `${cell.right ? "1px solid transparent" : "1px solid aqua"}`, borderBottom: `${cell.bottom ? "1px solid transparent" : "1px solid aqua"}`, borderTop: `${cell.top ? "1px solid transparent" : "1px solid aqua"}` }}></div>
                                    })}
                                </div>
                            })}
                        </div>}
                    </div>}
                    {!loading && !error && <div className='controllers'>
                        <div className='controlFlexBox'>
                            {!(current.x === input.row - 1 && current.y === input.col - 1) ? <>
                                <div className='controlBox'>
                                    <button className='btn blank1'><span className="material-symbols-outlined">
                                        arrow_left
                                    </span></button>
                                    <button className='btn blank2'><span className="material-symbols-outlined">
                                        arrow_left
                                    </span></button>
                                    <button className='btn btnControl left' onClick={moveLeft}><span className="material-symbols-outlined">
                                        arrow_left
                                    </span></button>
                                    <button className='btn btnControl top' onClick={moveTop}><span className="material-symbols-outlined">
                                        arrow_drop_up
                                    </span></button>
                                    <button className='btn btnControl bottom' onClick={moveBottom}><span className="material-symbols-outlined">
                                        arrow_drop_down
                                    </span></button>
                                    <button className='btn btnControl right' onClick={moveRight}><span className="material-symbols-outlined">
                                        arrow_right
                                    </span></button>
                                </div>
                                <h2 className='moves'>Moves : {moves}</h2>
                            </> : <>
                                <div className='win'><h1>Congratulations, You Win!</h1></div>
                            </>}
                        </div>
                    </div>}
                </div>
            </div>
            <footer className="footer">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-12 text-center">
                            <h2 className="footer-heading"><a href="#" className="logo">Maze game</a></h2>
                            <p className="menu">
                                <Link to={"/Maze-Generator"}>Home</Link>
                                <Link to={"/Maze-Generator"}>Agent</Link>
                                <Link to={"/Maze-Generator"}>About</Link>
                                <Link to={"/Maze-Generator"}>Listing</Link>
                                <Link to={"/Maze-Generator"}>Blog</Link>
                                <Link to={"/Maze-Generator"}>Contact</Link>
                            </p>
                            <ul className="ftco-footer-social p-0">
                                <li className="ftco-animate"><Link to={"https://www.instagram.com/me_gotnochillz"} target='_blank'  className='instagram' ><i className="fab fa-instagram"></i></Link></li>
                                <li className="ftco-animate"><Link to={"https://www.linkedin.com/in/udit-goyal-aa79a01a2"} target='_blank' className='linkedin'> <i className="fab fa-linkedin"></i></Link></li>
                                <li className="ftco-animate"><Link to={"https://github.com/udit0012"} target='_blank' className='github'> <i className="fab fa-github"></i></Link></li>
                                <li className="ftco-animate"><Link to={"https://twitter.com/uditgoyal0012"} target='_blank' className='twitter'> <i className="fab fa-twitter"></i></Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col-md-12 text-center">
                            <p className="copyright">
                                Copyright © 2023 All rights reserved | This website is made <i className="ion-ios-heart" aria-hidden="true"></i> by <a href="https://github.com/udit0012" target="_blank">Udit Goyal</a>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Maze








// if(!result){
//     return resp.send("")
// }
// return resp.send("")
