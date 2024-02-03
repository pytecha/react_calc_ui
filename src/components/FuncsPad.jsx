import { useRef, useCallback } from "react";
import { keyStyles, fnBtnData } from "./../utilities/declarations";

const executeWithTimeout = (callback) => {
  const tmId = setTimeout(() => {
    callback();
    clearTimeout(tmId);
  }, 200);
};

const Button = ({ cls, map_id, fmk }) => {
  const fmkVal = fmk.get(map_id);
  return (
    <button
      className={`${cls} ${keyStyles[fmkVal[0].slice(-1)]} mt-2 h-[2.25em] rounded-md`}
      data-btn-id={fmkVal[0]}
    >
      {fmkVal[1]}
    </button>
  );
};

const FuncsPad = ({ tgl, fmk, dpk, dpt, avs, api }) => {
  const engDp = useRef(-1);
  
  const addToken = (token) => {
    dpt({ type: "add", tgl: tgl, token });
    if(!tgl.cursor)
      dpk({type: "multitoggles", states: {cursor: true}});
  }
  
  const retrieveData = (expr, config) => api.retrieve("/trans-num", { expr, data: {}, config });

  const eventDelegate = useCallback((event) => {
    event.stopPropagation();
    const btn = event.target.closest("button");
    const btnId = btn.getAttribute("data-btn-id");

    if (btnId.startsWith("f") || btnId === "y30") {
      const btnText = btn.textContent.trim();
      const isBtnU = btnId[1] === "u";
      const tokenToAdd = isBtnU ? (tgl.sto ? `=>${btnText}` : `f${btnId.slice(2, -1)}u`) : btnId;
      
      addToken(tokenToAdd);
      
      if (isBtnU && tgl.rcl && (!avs.current.expr || !tgl.cursor)) {
        retrieveData(avs.current.data[btnText] ?? "nan", {...avs.current.config, kind: "fmt"});
      } else if (isBtnU && tgl.sto) {
        executeWithTimeout(() => api.retrieve("/main", avs.current));
      }
    } else if (btnId.startsWith("y")) {
      const strNum = btnId.slice(1, -1);
      switch (strNum) {
        case "5":
          if (tgl.shift) {
            retrieveData(avs.current.Q, {kind: "ifrac"});
          } else {
            tgl.cursor ? addToken(btnId) : retrieveData(avs.current.Q, {kind: "pfrac"});
          }
          break;
        case "6":
          if (tgl.shift) {
            const { Q, config } = avs.current;
            retrieveData(Q, {...config, kind: "round"});
          } else {
            dpk({ type: "multitoggles", states: { drg: !tgl.drg, mode: false, error: false } });
          }
          break;
        case "12":
          if (tgl.shift) {
            retrieveData(avs.current.Q, {kind: "time"});
          } else {
            tgl.cursor ? addToken(btnId) : retrieveData(avs.current.Q, {...avs.current.config, kind: "fmt"});
          }
          break;
        case "13":
          dpk({ type: "togglehyp" });
          break;
        case "17":
          dpk({ type: "togglercl-sto" });
          break;
        case "18":
          engDp.current += engDp.current === -1 ? 1 : tgl.shift ? 3 : -3;
          retrieveData(avs.current.Q, { dp: engDp.current = Math.max(Math.min(engDp.current, 15), -15), kind: "eng" });
          break;
        case "22":
          if (tgl.reg || tgl.sd) {
            api.retrieve(tgl.reg ? "/regression" : "/deviation", avs.current);
          } else {
            dpt({ type: "navbottom" });
            addToken(btnId);
            executeWithTimeout(() => api.retrieve("/main", avs.current));
          }
          break;
        default:
          console.log(btnId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tgl, fmk, dpk, dpt, avs, api]);

  return (
    <div
      className="grid grid-rows-4 grid-cols-6 px-2 pb-2 justify-center bg-gray-300 rounded-md"
      id="funcspad"
      onClick={eventDelegate}
    >
      {fnBtnData.map(([cls, map_id, cls2]) => {
        const buttonElement = <Button key={map_id} cls={cls} map_id={map_id} fmk={fmk} />;
        if (map_id === 2 || map_id === 3) {
          return (
            <div className="block bg-[#333333]" key={map_id}>
              <div className={`flex bg-gray-300 ${cls2}`}>{buttonElement}</div>
            </div>
          );
        }
        if (map_id === 23) {
          return <div className="col-span-2 bg-[#333333] rounded-b-md" key={map_id}></div>;
        }
        return buttonElement;
      })}
    </div>
  );
};

export default FuncsPad;
