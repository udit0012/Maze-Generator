# Maze Generator and Game

This project was created with React.js and Javscript.

A maze generating algorithm is written in javascript to create a maze of size mxn (where 1<m,n<20)

## Demo

   Live : https://udit0012.github.io/Maze-Generator/

## Run locally

Clone the project

```bash
  git clone git@github.com:udit0012/Maze-generator.git
```

Go to the project directory

```bash
  cd Maze-generator
```

Install dependencies

```bash
  npm install
```
Start the Project

```bash
  npm start
```

## Algorithm

Algorithm used for generating maze is Depth first search

```bash
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
                }
                else if (wallProperty === 'right') {
                    currentCell.right = true
                    nextCell.left = true

                }
                else if (wallProperty === 'bottom') {
                    currentCell.bottom = true
                    nextCell.top = true
                }
                else if (wallProperty === 'top') {
                    currentCell.top = true
                    nextCell.bottom = true
                }
                DFS(nextCell, mazebox)
            }
        }
        return mazebox
    }
```

## Made By

[@UditGoyal](https://github.com/udit0012)