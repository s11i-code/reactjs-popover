import Popover from '../src/index'
//import './App.css'



function App() {

  const POPOVER_ID = "my-popover";

  return (
    <>
    <button popoverTarget={POPOVER_ID}>
      Toggle popover
    </button>
    
    <Popover remountChildrenOnShow ={true} position="top" id={POPOVER_ID}>

      {({ showPopover, hidePopover, togglePopover, state }) => (
        <>
        
        <h1>Popover in state {state}</h1>

        <button onClick={togglePopover}>
         Toggle via JS {}
        </button>

        {state === "open" ? ( <button onClick={hidePopover}>
         Hide via JS
         </button>) : ( <button onClick={showPopover}>
         Show via JS
         </button>)}
    
        </>
      )}
    </Popover>
     
    </>
  )
}

export default App
