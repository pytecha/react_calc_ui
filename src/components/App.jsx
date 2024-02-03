import { useReducer, useRef, useState, useCallback, useMemo } from "react";
import axios from "axios";
import objectHash from "object-hash";

import Controls from "./Controls";
import FuncsPad from "./FuncsPad";
import NumsPad from "./NumsPad";
import Screen from "./Screen";

import {
  initialKeysState,
  keysReducer,
  tokensReducer
} from "./../utilities/declarations";

const baseUrl = "https://pytecha.pythonanywhere.com/api/solutions";
// const baseUrl = "http://localhost:5000/api/solutions";
const reqConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

const initialTokensState = {
  left: ["f90", "f190", "n110", "n160", "f200", "n150", "n110"],
  right: [],
};

const App = () => {
  const [keysState, dispatchKeys] = useReducer(keysReducer, initialKeysState);
  const [tokensState, dispatchTokens] = useReducer(tokensReducer, initialTokensState);
  
  const appVarsRef = useRef({
    cachedReqs: new Map(),
    data: {},
    Qfr: "0",
    Qf: "0",
    Q: "0",
    Error: "",
    expr: "",
    config: { dsp: "nrm", unt: "deg", reg: "lin", dp: 1 },
});
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("0");

  const tgl = keysState.get("toggles");
  
  const memoizedDispatchKeys = useCallback(dispatchKeys, []); // eslint-disable-line react-hooks/exhaustive-deps
  const memoizedDispatchTokens = useCallback(dispatchTokens, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateVars = useCallback((data) => {
    console.log(data)
    if (data.reset) {
      appVarsRef.current.data = {};
      appVarsRef.current.Qfr = "0";
      appVarsRef.current.Qf = "0";
      appVarsRef.current.Q = "0";
      appVarsRef.current.expr = "";
      appVarsRef.current.cachedReqs = new Map();
      appVarsRef.current.Error = "";
      appVarsRef.current.config = { dsp: "nrm", unt: "deg", reg: "lin", dp: 1 };
    }
    if (data?.Error) {
      appVarsRef.current.Error = data.Error;
      dispatchKeys({ type: "multitoggles", states: { error: true } });
    }
    if (data?.Qf) {
      appVarsRef.current.Qfr = data.Qf;
      appVarsRef.current.Qf = data.Qf;
    }
    if (data?.Q) {
      appVarsRef.current.Q = data.Q;
    }
    if (data?.data) {
      appVarsRef.current.data = { ...appVarsRef.current.data, ...data.data };
      data.data?.M && dispatchKeys({ type: "multitoggles", states: { slotm: parseFloat(data.data.M) !== 0.0 } });
    }
      
    setResult(data.Qf ?? appVarsRef.current.Qfr);
    setLoading(false);
    
  }, []);
  const retrieve = useCallback(async (endpoint, params) => {
    dispatchKeys({ type: "multitoggles", states: ["cursor", "error", "mode", "rst"].reduce((obj, key) => { obj[key] = false; return obj;}, {}) });
    setLoading(true);
    const {expr, data, config} = params;
    const key = objectHash({ endpoint, expr, config });
    const { cachedReqs } = appVarsRef.current;
    if (cachedReqs.has(key) && expr.toString().search(/(#|=>)/) === -1) {
      updateVars(cachedReqs.get(key));
    } else {
      try {
        data.Q = appVarsRef.current.Q;
        const { data: _data_ } = await axios.post(
          baseUrl + endpoint,
          {expr, data, config},
          reqConfig
        );
        cachedReqs.set(key, _data_);
        updateVars(_data_);
      } catch (error) {
        updateVars({ "Error": error?.response?.data ?? error.message });
      }
    }
  }, [updateVars]);

  const API = useMemo(() => ({ updateVars, retrieve }), [updateVars, retrieve]);

  return (
    <div className="container w-[90%] flex flex-col justify-center content-evenly p-6 mt-3 rounded-3xl bg-[#333333] select-none" style={{ width: 385.5 }}>
      <div className="text-gray-200 py-3">
        <div className="flex justify-between mb-6">
          <span className="main-title text-xl font-bold font-aquire">AROCALC</span>
          <span className="edition font-mono">1st Edition</span>
        </div>
        <span className="block text-center text-xs italic">Powerful Everyday!</span>
      </div>
      <Screen tgl={tgl} dpk={memoizedDispatchKeys} dpt={memoizedDispatchTokens} tks={tokensState} ldng={loading} avs={appVarsRef} api={API} res={result} />
      <Controls tgl={tgl} dpk={memoizedDispatchKeys} dpt={memoizedDispatchTokens} api={API} />
      <FuncsPad tgl={tgl} fmk={keysState.get("fnKeys")} dpk={memoizedDispatchKeys} dpt={memoizedDispatchTokens} avs={appVarsRef} api={API} />
      <hr className="bg-gray-300 w-[30%] h-[0.15em] my-2.5 mx-auto" />
      <NumsPad tgl={tgl} nmk={keysState.get("nmKeys")} dpk={memoizedDispatchKeys} dpt={memoizedDispatchTokens} avs={appVarsRef} api={API} />
    </div>
  );
};

export default App;
