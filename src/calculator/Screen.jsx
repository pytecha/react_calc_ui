import {
  useState, useRef, useEffect, useContext
}
  from "react";
import {
  StatesContext
}
  from "./Contexts";
import {
  statsEntry, RegFormulae
}
  from "./Constants";
import styles from "./screen.module.css";
import { ErrorIcon } from "./Icons";

export default function Screen({
  props: [exprs, answer, setAnswer, errorMessage, dispatchKeyState, dispatchExprTokenState, manageAppRefs]
}) {
  const toggles = useContext(StatesContext);
  const [rangeState, setRangeState] = useState({open: false, value: 1});
  const appVars = manageAppRefs({ key: "app-vars" });
  const exprDiv = useRef(null);
  const exprSpan2 = useRef(null);
  
  const {left, right} = exprs;
  const rightMaxIndex = right.length - 1;
  const boxShadow = {
    boxShadow: "inset -2px -2px 1px 1px rgba(0, 0, 0, 0.2), inset 2px 2px 1px 1px rgba(0, 0, 0, 0.2)"
  };
  const floatClasses = "absolute top-0 left-0 z-30 w-full h-full p-1 bg-gray-200 rounded-md";
  const headClasses = "block font-semibold text-md text-gray-600";
  const gridClasses = "border-2 border-gray-300 p-1 rounded mt-1";
  const classesPassive = "bg-gray-300 text-gray-400";
  const classesActive = "bg-red-900 text-gray-100";
  
  const modeOff = () => {
    const timeoutId = setTimeout(() => {
      dispatchKeyState({ type: "togglemodeorclear" });
      dispatchKeyState({ type: "togglepower", state: true });
      clearTimeout(timeoutId);
    }, 200);
  };
  
  useEffect(() => {
    exprDiv.current?.scrollTo({left: exprSpan2.current?.offsetLeft-315 || 0});
  }, [exprs, toggles.navActive]);

  return (
    <div className="relative flex flex-col p-1 bg-gray-200 rounded-md h-[7rem] mb-2 select-none" style={{...boxShadow, fontFamily: "Monospace"}}>
      {toggles.powerActive &&
        <>
          <div className="flex justify-between w-full h-[12.5%]">
            {indicators.map(([indicator, state], key) => <span className={`block rounded px-[0.425em] text-[0.65em] m-auto ${toggles[state] ? classesActive : classesPassive}`} key={key}>{indicator}</span>)}
          </div>
          <div
            className={`relative flex flex-nowrap place-items-center mt-1 rounded-sm h-[41%] w-full bg-[rgba(0,0,0,0.1)] text-lg px-1 overflow-x-scroll ${styles.screeninput}`}
            ref={exprDiv}
          >
            <span
              className={`whitespace-nowrap ${toggles.cursorActive && styles.cursor} ${!toggles.navActive && styles.blink}`}
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
            <span className={`flex flex-nowrap whitespace-nowrap ${styles.answerbox}`}>{answer}</span>
          </div>


          {toggles.modeActive &&
            <>
              {rangeState.open &&
                <div className="absolute z-40 w-[55%] h-[85%] top-2.5 right-2.5 bg-gray-200 rounded ring-2 ring-red-900">
                  <span className="block text-center bg-red-900 text-gray-100">SET {rangeState?.initiater === "REG" ? "FORMULAR" : "LEVEL"}</span>
                  <span
                    role="button"
                    className="absolute inline-block px-1 top-1 right-2 text-gray-100 text-xs font-bold"
                    onClick={() => setRangeState({...rangeState, open: false})}
                  >
                    X
                  </span>
                  <label htmlFor="range-input" className="block text-center">
                    {
                      rangeState?.initiater === "REG"  ?
                      <><span>F: </span> {RegFormulae[rangeState.value][1]}</>
                        :
                      <><span>Level: </span> {rangeState.value}</>
                    }
                  </label>
                  <input
                    className={`block border-0 rounded bg-gray-100 ring-2 ring-gray-300 focus:outline-none px-1 text-center w-[8em] mx-auto ${styles.rangeselector}`}
                    type="range" step="1" value={rangeState.value}
                    max={rangeState?.initiater === "NRM" ? 2 : rangeState?.initiater === "REG" ? 6 : 12}
                    min={rangeState?.initiater === "NRM" ? 1 : 0}
                    onChange={(e) => setRangeState({...rangeState, value: e.target.value})}
                    role="button"
                    id="range-input"
                  />
                  <span
                    className="absolute bottom-0 right-0 px-2.5 py-0.5 bg-green-500 rounded"
                    role="button"
                    onClick={() => {
                      manageAppRefs(
                        rangeState?.initiater === "REG" ?
                        { key: "activeReg", value: RegFormulae[rangeState.value][0] }
                          :
                        { key: "activeDp", value: rangeState.value }
                      )
                      setRangeState({...rangeState, open: false});
                      modeOff();
                    }}
                  >
                    OK
                  </span>
                </div>
              }


              <div className={`${floatClasses}  overflow-y-scroll`} style={boxShadow}>
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
                          setRangeState({...rangeState, open: true, initiater: "REG"});
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
                              setRangeState({...rangeState, open: true, initiater: value, value: value === "NRM" ? 1 : 4});
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
                          dispatchKeyState({ type: "togglemodeorclear" });
                          dispatchKeyState({ type: "toggleshift" });
                          dispatchKeyState({ type: "togglemodeorclear" });
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
            <div className={`${floatClasses} border-2`} style={boxShadow}>
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
                        slotmActive: false,
                        degActive: true,
                        radActive: false,
                        gradActive: false
                      }
                    });
                    modeOff();
                  }}
                >
                  ALL
                </span>
              </div>
            </div>
          }


          {toggles.drgActive &&
            <div className={`${floatClasses} border-2`} style={boxShadow}>
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
            <div className={`${floatClasses} z-50 overflow-y-scroll`} style={boxShadow}>
              <span className="block py-1 font-bold text-lg text-center bg-gray-500 rounded-sm">STAT (<span className="text-sm">Double Tap Select</span>)</span>
              <div className="grid grid-cols-5 gap-0.5 mt-1">
                {statsEntry
                  .filter(value => value[0] in appVars)
                  .map(([tokenKey, input]) => (
                    <div
                      key={tokenKey}
                      className="bg-gray-300 rounded p-1"
                      role="button"
                      onDoubleClick={() => {
                        dispatchExprTokenState({ type: "add", token: appVars[tokenKey], input: input ?? tokenKey, ins: toggles.insActive });
                        dispatchKeyState({
                          type: "multitoggles",
                          states: {
                            statActive: !toggles.statActive
                          }
                        })
                        dispatchKeyState({ type: "multitoggles", states: {modeActive: false} })
                      }}
                    >
                      <span className="block text-sm font-semibold">{input ?? tokenKey}:</span>
                      <span
                        className="block text-xs overflow-x-scroll whitespace-nowrap"
                      >
                        {/.pred/.test(tokenKey) ? appVars[tokenKey].replace(/(@|.pred)/g, "") : appVars[tokenKey]}
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>
          }


          {toggles.histActive &&
            <div className={`${floatClasses} z-50 overflow-y-scroll`} style={boxShadow}>
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
            <div className={floatClasses} style={boxShadow}>
              <div className="flex justify-center w-full h-full overflow-y-scroll">
                <div className="self-center"><ErrorIcon /></div>
                <span className="self-center text-3xl font-bold text-[#333]">{errorMessage}</span>
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
