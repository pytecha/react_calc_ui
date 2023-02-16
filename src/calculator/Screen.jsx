import {
  useState, useRef, useEffect, useContext
}
  from "react";
import {
  StatesContext
}
  from "./Contexts";
import {
  stateClasses, statsEntry
}
  from "./Constants";
import {
  answerBox, cursor, blink, rangeselector
}
  from "./screen.module.css";
import { ErrorIcon } from "./Icons"

export default ({
  props: [exprs, answer, setAnswer, errorMessage, dispatchKeyState, dispatchExprTokenState, manageAppRefs]
}) => {
  const toggles = useContext(StatesContext);
  const [precision, setPrecision] = useState(0);
  const [regMenu, setRegMenu] = useState(false);
  const [precMenu, setPrecMenu] = useState(false);
  const exprDiv = useRef(null);
  const exprSpan2 = useRef(null);
  const {left, right} = exprs;
  const rightMaxIndex = right.length - 1;
  const styles = {
    "boxShadow": "inset -2px -2px 1px 1px rgba(0, 0, 0, 0.2), inset 2px 2px 1px 1px rgba(0, 0, 0, 0.2)"
  };
  const floatClasses = "absolute top-0 left-0 z-30 w-full h-full p-1 bg-gray-200 rounded-md";
  const headClasses = "block font-semibold text-md text-gray-600";
  const gridClasses = "border-2 border-gray-300 p-1 rounded mt-1";
  const classesPassive = "bg-gray-300 text-gray-400";
  const classesActive = "bg-red-900 text-gray-100";
  const appVars = manageAppRefs({ key: "appVars" });

  const modeOff = () => {
    const timeoutId = setTimeout(() => {
      dispatchKeyState({ type: "togglemodeorclear" });
      dispatchKeyState({ type: "togglepower", state: true });
      clearTimeout(timeoutId)
    }, 200);
  };
  
  useEffect(() => {
    setPrecision(1)
  }, [toggles]); 
  
  useEffect(() => {
    exprDiv.current?.scrollTo({left: exprSpan2.current?.offsetLeft-315 || 0});
  }, [exprs, toggles.navActive]);

  return (
    <div className="relative flex flex-col p-1 bg-gray-200 rounded-md h-[7rem] mb-2 select-none" id="screen" style={styles}>
      {toggles.powerActive &&
        <>
        {/* main screen start*/}
          <div className="flex justify-between w-full h-[12.5%]">
            {indicators.map(([indicator, state], key) => <span className={`block rounded px-[0.425em] text-[0.65em] m-auto ${toggles[state] ? classesActive : classesPassive}`} key={key}>{indicator}</span>)}
          </div>
          <div
            className="relative flex flex-nowrap place-items-center mt-1 rounded-sm h-[41%] w-full bg-[rgba(0,0,0,0.1)] text-lg px-1 overflow-x-scroll"
            ref={exprDiv}
            id="screen-input"
          >
            <span
              className={`whitespace-nowrap ${toggles.cursorActive && cursor} ${!toggles.navActive && blink}`}
            >
              {left}
            </span>
            <span
              className="whitespace-nowrap" ref={exprSpan2}
            >
              {right.map((_, index) => right[rightMaxIndex - index])}
            </span>
          </div>
          <div className="grid place-items-end mt-[0.75px] rounded-sm h-[43%] w-full bg-[rgba(0,0,0,0.025)] text-4xl px-1 overflow-x-scroll">
            <span className={`flex flex-nowrap whitespace-nowrap ${answerBox}`}>{answer}</span>
          </div> {/* main screen end*/}


          {toggles.modeActive &&
            <>
              // reg menu start
              {regMenu &&
                <div className="absolute z-50 w-[50%] h-[80%] top-1 right-5 bg-gray-200 rounded ring-2 ring-red-900">
                  <span className="block text-left pl-2 bg-red-900 text-gray-100">TYPES (<span className="text-sm">Tap Select</span>)</span>
                  <span
                    role="button"
                    className="absolute inline-block px-1 top-1 right-2 text-gray-100 text-xs font-bold"
                    onClick={() => setRegMenu(false)}
                  >
                    X
                  </span>
                  <div className="grid grid-cols-3 gap-2 p-1">
                    {["Lin", "Log", "Exp", "Pwr", "Inv", "Quad"]
                      .map((value, key) => (
                        <span
                          key={key}
                          className="bg-gray-500 text-center text-gray-100 rounded"
                          onClick={() => {
                            manageAppRefs({ key: "activeReg", value: value.toLowerCase() })
                            setRegMenu(false);
                            modeOff();
                          }
                          }
                          role="button"
                        >
                          {value}
                        </span>
                      ))
                    }
                  </div>
                </div>
              }// reg menu end


              // precision menu start
              {precMenu &&
                <div className="absolute z-40 w-[50%] h-[82.5%] top-1 right-5 bg-gray-200 rounded ring-2 ring-red-900">
                  <span className="block text-center bg-red-900 text-gray-100">SET LEVEL</span>
                  <span
                    role="button"
                    className="absolute inline-block px-1 top-1 right-2 text-gray-100 text-xs font-bold"
                    onClick={() => setPrecMenu(false)}
                  >
                    X
                  </span>
                  <input
                    className={`block border-0 rounded bg-gray-100 ring-2 ring-gray-300 focus:outline-none mx-auto px-1 text-center w-[7.5em] h-[2em] mt-1 ${rangeselector}`}
                    type="range" step="1" value={precision}
                    max={toggles.nrmActive ? 2 : 12}
                    min={toggles.nrmActive ? 1 : 0}
                    onChange={(e) => setPrecision(e.target.value)} role="button"
                  />
                  <span className="block text-center">{precision}</span>
                  <span
                    className="absolute bottom-0.5 right-1 px-2 bg-green-500 rounded"
                    onClick={() => {
                      manageAppRefs({ key: "activeDp", value: precision })
                      setPrecMenu(false);
                      modeOff();
                    }}
                  >
                    Ok
                  </span>
                </div>
              }// precision menu end


              <div className={`${floatClasses}  overflow-y-scroll`} style={styles}>
                <span className="block py-1 font-bold text-lg text-center bg-gray-500 rounded-sm">MODE OPTIONS</span>
                <div className="grid grid-cols-2 gap-x-2">
                  <div className={gridClasses}>
                    <span className={headClasses}>MATH</span>
                    <div className="grid grid-cols-3 gap-1">
                      <span
                        className={getStateClass(!toggles.sdActive && !toggles.regActive)}
                        onClick={() => {
                          dispatchKeyState({ type: "toggleregsd", kind: "all" });
                          modeOff();
                        }}
                      >
                        COMP
                      </span>
                      <span
                        className={getStateClass(toggles.sdActive)}
                        onClick={() => {
                          dispatchKeyState({ type: "toggleregsd", kind: "sd" });
                          modeOff();
                        }}
                      >
                        SD
                      </span>
                      <span
                        role="button"
                        className={getStateClass(toggles.regActive)}
                        onClick={() => {
                          dispatchKeyState({ type: "toggleregsd", kind: "reg" })
                          setPrecMenu(false);
                          setRegMenu(true);
                        }}
                      >
                        REG
                      </span>
                    </div>
                  </div>

                  <div className={gridClasses}>
                    <span className={headClasses}>UNIT</span>
                    <div className="grid grid-cols-3 gap-1">
                      {["DEG", "RAD", "GRAD"]
                        .map((value, key) => (
                          <span
                            key={key}
                            className={getStateClass(toggles[`${value.toLowerCase()}Active`])}
                            onClick={() => {
                              dispatchKeyState({ type: "toggledegrad", kind: value });
                              modeOff();
                            }}
                          >
                            {value}
                          </span>
                        ))
                      }
                    </div>
                  </div>

                  <div className={gridClasses}>
                    <span className={headClasses}>PRECISION</span>
                    <div className="grid grid-cols-3 gap-1">
                      {["FIX", "SCI", "NRM"]
                        .map((value, key) => (
                          <span
                            key={key}
                            className={getStateClass(toggles[`${value.toLowerCase()}Active`])}
                            onClick={() => {
                              dispatchKeyState({ type: "togglefixscinrm", kind: value })
                              setRegMenu(false)
                              setPrecMenu(true)
                            }}
                          >
                            {value}
                          </span>
                        ))
                      }
                    </div>
                  </div>

                  <div className={gridClasses}>
                    <span className={headClasses}>EXTRA</span>
                    <div className="grid grid-cols-3 gap-1">
                      <span
                        className={`${optionsClasses} bg-blue-800`}
                        role="button"
                        onClick={() => {
                          dispatchKeyState({
                            type: "multitoggles",
                            states: {
                              statActive: !toggles.statActive
                            }
                          })
                        }}
                      >
                        STAT
                      </span>
                      <span
                        className={`${optionsClasses} bg-blue-800`}
                        onClick={()=>{
                          dispatchKeyState({
                            type: "multitoggles",
                            states: {
                              histActive: !toggles.histActive
                            }
                          })
                        }}
                      >
                        HIST
                      </span>
                      <span
                        className={`${optionsClasses} bg-gray-400 text-red-900 font-semibold`}
                        onClick={() => {
                          dispatchKeyState({ type: "togglemodeorclear" })
                          dispatchKeyState({ type: "toggleshift" })
                          dispatchKeyState({ type: "togglemodeorclear" })
                        }}
                      >
                        CLR
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          }

          {toggles.clearActive &&
            <div className={`${floatClasses} border-2`} style={styles}>
              <span className="block py-1 font-bold text-lg text-center bg-gray-500 rounded-sm">CLEAR OPTIONS</span>
              <div className="grid grid-cols-3 gap-3 mt-3 w-[75%] mx-auto">
                <span
                  className={`${optionsClasses} bg-gray-500 py-2`}
                  role="button"
                  onClick={() => {
                    dispatchExprTokenState({type: "clear"});
                    setAnswer("0")
                    manageAppRefs({});
                    modeOff();
                  }}
                >
                  SCI
                </span>
                <span
                  className={`${optionsClasses} bg-gray-500 py-2`}
                  role="button"
                  onClick={() => {
                    dispatchExprTokenState({type: "clear"});
                    setAnswer("0")
                    dispatchKeyState({ type: "toggleregsd", kind: "all" })
                    modeOff();
                  }}
                >
                  MODE
                </span>
                <span
                  className={`${optionsClasses} bg-gray-500 py-2`}
                  role="button"
                  onClick={() => {
                    dispatchExprTokenState({type: "clear"});
                    setAnswer("0")
                    manageAppRefs({});
                    dispatchKeyState({ type: "toggleregsd", kind: "all" })
                    dispatchKeyState({
                      type: "multitoggles",
                      states: {
                        slotmActive: false
                      }
                    })
                    modeOff();
                  }}
                >
                  ALL
                </span>
              </div>
            </div>
          }


          {toggles.drgActive &&
            <div className={`${floatClasses} border-2`} style={styles}>
              <span className="block py-1 font-bold text-lg text-center bg-gray-500 rounded-sm">KEY-PRESS SELECT</span>
              <div className="grid grid-cols-3 gap-y-1 gap-x-3 place-items-center mt-2 w-[75%] mx-auto">
                {["d", "r", "g"]
                  .map((value, key) => (
                    <span key={key} className="inline-block py-1 px-6 bg-gray-500 text-gray-100 font-semibold rounded-md">{value}</span>
                  ))
                }
                {[1, 2, 3]
                  .map((value, key) => (
                    <span className="text-red-900 text-md font-bold">{value}</span>
                  ))
                }
              </div>
            </div>
          }


          {toggles.statActive &&
            <div className={`${floatClasses} z-50 overflow-y-scroll`} style={styles}>
              <span className="block py-1 font-bold text-lg text-center bg-gray-500 rounded-sm">STATS (<span className="text-sm">Double Tap Select</span>)</span>
              <div className="grid grid-cols-5 gap-0.5 mt-1">
                {statsEntry
                  .map((value, key) => (
                    <div
                      key={key}
                      className="bg-gray-300 rounded p-1"
                      role="button"
                      onDoubleClick={() => {
                        dispatchExprTokenState({ type: "add", token: `@${value[0]}`, input: value[1] || value[0], ins: toggles.insActive });
                        dispatchKeyState({
                          type: "multitoggles",
                          states: {
                            statActive: !toggles.statActive
                          }
                        })
                        dispatchKeyState({ type: "multitoggles", states: {modeActive: false} })
                      }}
                    >
                      <span className="block text-sm font-semibold">{value[1] || value[0]}:</span>
                      <span
                        className="block text-xs overflow-x-scroll whitespace-nowrap"
                      >
                        {value[0].includes("pred") ?
                          appVars[value[0]].slice(7, -1).replace(/@/g, "") :
                          appVars[value[0]]
                        }
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>
          }


          {toggles.histActive &&
            <div className={`${floatClasses} z-50 overflow-y-scroll`} style={styles}>
              <span className="block py-1 font-bold text-lg text-center bg-gray-500 rounded-sm">HIST (<span className="text-sm">Double Tap Select</span>)</span>
              <div className="grid grid-cols-5 gap-0.5 mt-1">
                {manageAppRefs({key: "appHist"})
                  .map((value, key) => (
                    <span
                      key={key}
                      className="bg-gray-300 rounded p-1 overflow-x-scroll whitespace-nowrap"
                      role="button"
                      onDoubleClick={() => {
                        dispatchExprTokenState({ type: "add", token: value, input: value, ins: toggles.insActive });
                        dispatchKeyState({
                          type: "multitoggles",
                          states: {
                            histActive: !toggles.histActive
                          }
                        })
                        if (toggles.modeActive) {
                          dispatchKeyState({ type: "togglemodeorclear" });
                        }
                      }}
                    >
                      {value}
                    </span>
                  ))
                }
              </div>
            </div>
          }
          
          
          {toggles.errorActive &&
            <div className={floatClasses} style={styles}>
              <div className="flex justify-center w-full h-full">
                <div className="self-center"><ErrorIcon /></div>
                <p className="self-center text-3xl p-0 m-0 font-bold text-[#333]">{errorMessage}</p>
              </div>
            </div>
          }
        </>
      }
    </div>
  )
}

const indicators = "S;shift,A;alpha,Hyp,Ins,M;slotm,STO,RCL,SD,REG,D;deg,R;rad,G;grad,FIX,SCI,NRM"
  .split(",").map(value => {
    const [indicator, state] = value.split(";");
    return [indicator, `${(state || indicator).toLowerCase()}Active`]
  });

const optionsClasses = "inline-block rounded-md text-gray-100 text-center";
const getStateClass = (test) => `${optionsClasses} ${test ?
  "bg-red-900" : "bg-gray-500"}`;
