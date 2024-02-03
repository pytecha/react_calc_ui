import { useState, useEffect, useRef, useCallback } from "react";
import { ErrorIcon } from "./../utilities/icons";
import styles from "./../utilities/screen.module.css";
import { tokenInputs, regFormulae } from "./../utilities/declarations";
import ModeMenu from "./ModeMenu";

const memVarKeys = new Map([
  ["A", "f11u"],
  ["B", "f12u"],
  ["C", "f13u"],
  ["D", "f14u"],
  ["E", "f15u"],
  ["F", "f16u"],
  ["X", "f20u"],
  ["Y", "f21u"],
  ["M", "f22u"],
]);

const screenStyles = {
  boxShadow: "inset -2px -2px 1px 1px rgba(0, 0, 0, 0.2), inset 2px 2px 1px 1px rgba(0, 0, 0, 0.2)",
  fontFamily: "Monospace",
};

const Screen = ({ dpk, dpt, tgl, tks, ldng, avs, api, res }) => {
  const [state, setState] = useState({ open: false, value: 0 });
  const tksDiv = useRef(null);

  const renderIndicators = () => {
    return (
      <div className="flex justify-between w-full h-[12.5%]">
        {"S;shift,A;alpha,Hyp,Ins,M;slotm,STO,RCL,CMP,SD,REG,D;deg,R;rad,G;grad,FIX,SCI,NRM"
          .split(",")
          .map((value) => {
            const [text, key] = value.split(";");
            return (
              <span
                className={`inline-block rounded px-[0.375em] text-[0.675em] m-auto ${
                  tgl[(key ?? text).toLowerCase()]
                    ? "bg-red-900 text-gray-100"
                    : "bg-gray-300 text-gray-400"
                }`}
                key={`indics_${text}`}
              >
                {text}
              </span>
            );
          })}
      </div>
    );
  };

  const renderAppValues = () => {
    return (
      <div className={`relative h-full p-1 ${styles.scroll}`}>
        <button className="absolute top-0 right-0 rounded-xl px-1.5 bg-red-700 text-gray-200" data-btn-id="stat-hist-off">x</button>
        <div className="flex flex-col">
          {tgl.hist
            ? 
            <div>
              <span className="block text-sm text-red-800 border-b-2 mb-1 border-red-800">
                RECENT OUTPUTS
              </span>
              <div className="grid grid-cols-3 gap-1">
                {Array.from(avs.current.cachedReqs).filter(([_, data]) => data?.Q).map(([key, {Q}]) => (
                  <div
                    key={key}
                    data-token={Q}
                    className={`inline-block bg-gray-300 p-1.5 rounded active:bg-green-500 overflow-x-scroll ${styles.scroll}`}
                  >
                    <span className="inline-block w-full text-center text-red-600">{Q}</span>
                  </div>
                ))}
              </div>
            </div>
            : [
              ["SYSTEM VARIABLES", "A,B,C,D,E,F,M,X,Y"],
              tgl.reg && ["REGRESSION METRICS", "a,b,c,r,xpreds,ypreds"],
              tgl.sd && ["STATISTICAL VALUES", "mean,median,mode,pstd,std,n"]
            ].filter(value => value).map(([key, value]) => (
                <div key={key} className="mb-1.5">
                  <span className="block text-sm text-red-800 border-b-2 mb-1 border-red-800">
                    {key}
                  </span>
                  <div
                    className="grid grid-cols-3 gap-1"
                  >
                    {value.split(",").map(key => (
                      <div
                        key={`sek_${key}`}
                        data-token={key}
                        className={`flex justify-between whitespace-nowrap bg-gray-300 p-1.5 rounded active:bg-green-500 overflow-x-scroll ${styles.scroll}`}
                      >
                        <span className="font-bold me-1 text-red-500">
                          {tokenInputs.get("ABCDEFMXY".includes(key) ? memVarKeys.get(key) : key)}:
                        </span>
                        <span className="text-gray-600">{avs.current.data[key] ?? "nan"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
          }
        </div>
      </div>
    );
  };

  const renderDrgButtons = () => {
    return (
      <div className="z-40 absolute flex justify-center w-full h-full">
        <div className="self-center grid grid-cols-3 gap-x-3 ring-2 ring-red-800 rounded-md p-5 bg-gray-300">
          {["d", "r", "g"].map((btn) => (
            <button
              key={`drg_${btn}`}
              className="inline-block text-gray-200 bg-red-800 py-0.5 px-3 rounded"
              data-btn-id={`pmt${btn}`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const eventDelegate = useCallback((event) => {
    event.stopPropagation();
    const btnId = event.target.closest("button")?.getAttribute('data-btn-id');
    if (!btnId) {
      const child = event.target.closest("[data-token]");
      if (tgl.stat || tgl.hist) {
        const tknAttr = child.getAttribute("data-token");
        if (tknAttr !== "Empty!") {
          dpt({ type: "add", token: tknAttr, tgl: tgl });
        }
        if(!tgl.cursor)
          dpk({type: "multitoggles", states: {cursor: true}})
      } else {
        dpt({
          type: "tap",
          index: Array.from(child?.parentElement.children || []).indexOf(child),
          side: tksDiv.current?.lastElementChild.offsetLeft > child?.offsetLeft ? "left" : "right"
        });
        dpk({type: "multitoggles", states: {cursor: true}});
      }
    } else if (["CMP", "SD", "REG"].includes(btnId)) {
      dpk({ type: "togglecomp-reg-sd", kind: btnId });
      if (btnId === "REG") {
        setState({ ...state, open: true, btn: btnId });
        return;
      }
      setTimeout(() => dpk({ type: "togglemode" }), 100);
    } else if (["FIX", "SCI", "NRM"].includes(btnId)) {
      avs.current.config.dsp = btnId.toLowerCase();
      dpk({ type: "togglefix-sci-nrm", kind: btnId });
      if(btnId === "NRM") {
        setTimeout(() => dpk({ type: "togglemode" }), 100);
        return;
      }
      setState({ ...state, open: true, btn: btnId });
    } else if (["DEG", "RAD", "GRAD"].includes(btnId)) {
      avs.current.config.unt = btnId.toLowerCase()
      dpk({ type: "toggledeg-rad-grad", kind: btnId });
      setTimeout(() => dpk({ type: "togglemode" }), 100);
    } else if (["pmtd", "pmtr", "pmtg"].includes(btnId)) {
      dpk({ type: "multitoggles", states: { drg: false } });
      dpt({ type: "add", token: btnId, tgl: tgl });
      if(!tgl.cursor)
        dpk({type: "multitoggles", states: {cursor: true}})
    } else if (btnId === "HIST") {
      dpk({ type: "multitoggles", states: { hist: !tgl.hist, mode: false } });
    } else if (btnId === "STAT") {
      dpk({ type: "multitoggles", states: { stat: !tgl.stat, mode: false } });
    } else if (btnId.startsWith("rng-")) {
      if (btnId.endsWith("ok")) {
        if (state?.btn === "REG") avs.current.config.reg = regFormulae[state.value][0];
        else if (state.btn) avs.current.config.dp = state.value;
        setTimeout(() => dpk({ type: "togglemode" }), 100);
      }
      setState({ ...state, open: false });
    } else if (btnId === "stat-hist-off") {
      dpk({type: "multitoggles", states: {hist: false, stat: false, mode: false}});
    } else if (btnId === "rstokay") {
      api.updateVars({ reset: true });
      dpk({ type: "reset", button: "poweron" });
      dpt({ type: "clear" });
    } else if (btnId === "rstquit") {
      dpk({type: "multitoggles", states: {rst: false}});
    }
  }, [tgl, dpt, dpk, api, avs, state]);

  useEffect(() => {
    tksDiv.current?.scrollTo({ left: tksDiv.current?.lastElementChild.offsetLeft - 11 || 0 });
    const c = tksDiv.current?.children;
    avs.current.expr = c
      ? Array.from(c)
          .flatMap(ch => Array.from(ch.childNodes).map(gc => gc.nodeName === "#text" ? gc.textContent.trim() : gc.getAttribute("data-token")))
          .join("")
      : "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tks, tgl.nav]);

  return (
    <div
      className={`relative flex flex-col p-1 bg-gray-200 rounded-md h-[7rem] mb-3 overflow-scroll ${styles.scroll}`}
      onClick={eventDelegate}
      style={screenStyles}
    >
      {tgl.mode ? <ModeMenu state={state} setState={setState} tgl={tgl} regFormulae={regFormulae} /> :
        tgl.hist || tgl.stat ? renderAppValues() : (
            <>
              {renderIndicators()}
              {tgl.drg && renderDrgButtons()}
              {ldng && (
                <div className="absolute flex justify-center items-center z-50 w-full h-full">
                  <div className={styles.loader}>
                    <div className={styles.bar_1}></div>
                    <div className={styles.bar_2}></div>
                    <div className={styles.bar_3}></div>
                    <div className={styles.bar_4}></div>
                    <div className={styles.bar_5}></div>
                    <div className={styles.bar_6}></div>
                    <div className={styles.bar_7}></div>
                  </div>
                </div>
              )}
              {tgl.rst && (
                <div className="z-40 absolute flex justify-center w-full h-full">
                  <div className="self-center flex flex-col ring-2 ring-red-800 rounded-md p-2 bg-gray-300">
                    <h2 className="text-lg font-bold">Reset Calculator?</h2>
                    <div className="flex justify-around px-5">
                      <button
                        className="inline-block text-gray-200 bg-red-800 py-0.5 px-2 rounded"
                        data-btn-id="rstquit"
                      >
                        Quit
                      </button>
                      <button
                        className="inline-block text-gray-200 bg-green-800 py-0.5 px-2 rounded"
                        data-btn-id="rstokay"
                      >
                        Okay
                      </button>
                    </div>
                  </div>
                </div>
              )}
              { tgl.error && (
                <div className="z-40 flex absolute w-full h-full">
                  <div className="m-auto flex place-items-center ring-2 ring-red-800 rounded-md p-2 bg-gray-300">
                    <ErrorIcon />
                    <span className="text-xl font-bold text-[#333]">{avs.current.Error}</span>
                  </div>
                </div>
              )}
              <div ref={tksDiv} className={`relative flex whitespace-nowrap place-items-center mt-1 rounded-sm h-[41%] w-full bg-[rgba(0,0,0,0.1)] text-lg px-1 ${styles.scroll}`}>
                <div className={`${tgl.cursor ? styles.cursor : ""} ${!tgl.nav && styles.blink}`}>{tks.left.map(key => tokenInputs.get(key) ?? <span data-token={key}>{key}</span>)}</div>
                <div className="">{
                  function () {
                    const tksRight = tks.right;
                    const trLen = tksRight.length - 1;
                    return tksRight.map((_, index) => {
                      const btnId = tksRight[trLen - index];
                      return tokenInputs.get(btnId) ?? <span data-token={btnId}>{btnId}</span>;
                    })
                  }()
                }</div>
              </div>
              <div className={`grid place-items-end mt-[0.75px] rounded-sm h-[43%] w-full bg-[rgba(0,0,0,0.025)] text-4xl px-1 ${styles.scroll}`}>
                <div className="flex whitespace-nowrap" style={{ fontFamily: "digital" }}>{res}</div>
              </div>
            </>
          )
      }
    </div>
  );
};

export default Screen;