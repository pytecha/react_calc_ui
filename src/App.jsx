import {
  useState,
  useEffect,
  useRef,
  useReducer
}
from "react";
import Face from "./calculator/Face";
import Screen from "./calculator/Screen";
import Controls from "./calculator/Controls";
import FuncsPad from "./calculator/FuncsPad";
import NumsPad from "./calculator/NumsPad";
import axios from "axios";
import {
  StatesContext
}
from "./calculator/Contexts";
import {
  initialState,
  initialAppVars,
  voidFuncs
}
from "./calculator/Constants";
import {
  keysReducer,
  exprsTokensReducer
}
from "./calculator/ReducerFns";


const App = () => {
  const [keyState,
    dispatchKeyState] = useReducer(keysReducer, initialState);

  const [exprTokenState,
    dispatchExprTokenState] = useReducer(exprsTokensReducer, {
      exprs: {
        left: [],
        right: []
      },
      tokens: {
        left: [],
        right: []
      }
    });

  const appRefs = useRef({
    appVars: initialAppVars,
    appHist: [],
    activeReg: "lin",
    activeDp: 1,
  });

  const [answer,
    setAnswer] = useState("0");
  const [errorMessage,
    setErrorMessage] = useState("");

  const toggles = keyState.toggles;
  const tokens = exprTokenState.tokens;

  const getExpression = () => {
    const rightMaxIndex = tokens.right.length - 1;
    return `${tokens.left.join("")}${tokens.right.map((_, index) => tokens.right[rightMaxIndex - index]).join("")}`;
  };

  const _dispatchExprTokenState = (arg) => {
    if (!toggles.cursorActive && arg.button !== "nav") {
      dispatchExprTokenState({
        type: "clear"
      });
    }

    dispatchKeyState({
      type: "multitoggles",
      states: {
        cursorActive: true
      }
    });
    dispatchExprTokenState(arg);
  };
  const activateError = (error) => {
    setErrorMessage(error ?? "Network Error");
    dispatchKeyState({
      type: "multitoggles",
      states: {
        errorActive: true
      }
    });
  };

  const baseUrl = "https://pytecha.pythonanywhere.com/api/solutions";
  // const baseUrl = "http://localhost:5000/api/solutions";

  const fetchApiMain = (data, sto = "") => axios.post(
    `${baseUrl}/main`, data)
  .then(res => {
    setAnswer(res.data.solution[1]);
    appRefs.current.appVars.Ans = res.data.solution[0];
    appRefs.current.appHist.push(res.data.solution[0]);
    if (sto) {
      const Ans = res.data.solution[0];
      if (sto === "M+") {
        appRefs.current.appVars.M += Ans;
        setAnswer(appRefs.current.appVars.M);
      } else if (sto === "M-") {
        appRefs.current.appVars.M -= Ans;
        setAnswer(appRefs.current.appVars.M);
      } else if (sto === "M") {
        appRefs.current.appVars.M = Ans;
      } else {
        appRefs.current.appVars[sto] = Ans;
      }
      ["M+",
        "M-",
        "M"].includes(sto) && (
        dispatchKeyState({
          type: "multitoggles",
          states: {
            slotmActive: appRefs.current.appVars.M === 0
          }
        })
      );
    }
  })
  .catch(err => activateError(err.response?.statusText));

  const fetchApiExtend = ({
    endpoint,
    kind = "",
    dp = 0,
    sto = ""
  }) => {
    const expression = getExpression();
    if (!expression.length) return

    dispatchKeyState({
      type: "multitoggles",
      states: {
        cursorActive: false
      }
    });
    const data = {
      expression: expression,
      unit: (
        toggles.degActive ? "deg":
        toggles.radActive ? "rad": "grad"
      ),
      stats: appRefs.current.appVars,
      config: {
        disp: (
          toggles.fixActive ? "fix":
          toggles.sciActive ? "sci": "nrm"
        ),
        dp: appRefs.current.activeDp
      },
      ...(endpoint === "regression" ? {
        kind: appRefs.current.activeReg
      }: {})
    };

    if (endpoint === "main") {
      fetchApiMain(data, sto);
    } else if (["deviation", "regression"].includes(endpoint)) {
      const lastCommaIndex = expression.lastIndexOf(",");
      if (lastCommaIndex < 1 && expression === "") {
        return;
      }
      if (lastCommaIndex === -1) {
        fetchApiMain(data);
        return;
      } else {
        fetchApiMain({
          ...data, expression: expression.slice(lastCommaIndex + 1, expression.length)
        });
      }
      axios.post(`${baseUrl}/${endpoint}`, data)
      .then(res => {
        appRefs.current.appVars = {
          ...appRefs.current.appVars, ...res.data.solution
        };
      })
      .catch(err => activateError(err.response?.statusText));
    } else {
      axios.post(`${baseUrl}/conversion`, {
        expression: appRefs.current.appVars.Ans,
        kind: kind,
        ...(["round", "eng"].includes(kind) ? {
          dp: kind === "eng" ? dp: appRefs.current.activeDp
        }: {})
      })
      .then(res => {
        if (kind === "round") {
          setAnswer(res.data.solution[1]);
          appRefs.current.appVars.Ans = res.data.solution[0];
        } else {
          setAnswer(res.data.solution);
        }
      })
      .catch(err => activateError(err.response?.statusText));
    }
  };

  const handleRcl = (input) => {
    const exprsLength = exprTokenState.exprs.left.length + exprTokenState.exprs.right.length;
    if (toggles.rclActive && (!exprsLength || !toggles.cursorActive)) {
      _dispatchExprTokenState({
        type: "clear"
      });
      dispatchKeyState({
        type: "multitoggles",
        states: {
          cursorActive: false
        }
      });
      setAnswer(appRefs.current.appVars[input]);
    }
    _dispatchExprTokenState({
      type: "add",
      token: `@${input}`,
      input: input
    });
  };

  const manageAppRefs = ({
    key = "", value = ""
  }) => {
    if (key === "appVars") {
      return appRefs.current.appVars;
    } else if (key === "appHist") {
      return appRefs.current.appHist;
    } else if (key) {
      // update
      appRefs.current[key] = value;
    } else {
      // reset
      appRefs.current.appVars = initialAppVars;
    }
  };

  return (
    <StatesContext.Provider value={toggles}>
			<div className="container w-[90%] flex flex-col justify-center content-evenly px-5 pt-1 pb-6 mt-3 rounded-3xl bg-[#333333]" style={ { width: 385.5 }}>
				<Face />
				<Screen props={
      [exprTokenState.exprs, answer, setAnswer, errorMessage, dispatchKeyState, _dispatchExprTokenState, manageAppRefs]
      }
      />
				<Controls props={
      [dispatchKeyState, ...(toggles.powerActive ? [_dispatchExprTokenState, setAnswer]: voidFuncs)]
      }
      />
				<FuncsPad props={
      [keyState.fnKeys, ...(toggles.powerActive ? [dispatchKeyState, _dispatchExprTokenState, fetchApiExtend, handleRcl, manageAppRefs, setAnswer]: voidFuncs)]
      }
      />
				<NumsPad props={
      [keyState.nmKeys, ...(toggles.powerActive ? [dispatchKeyState, _dispatchExprTokenState, fetchApiExtend, setAnswer]: voidFuncs)]
      }
      />
    </div>
		</StatesContext.Provider>
  );
};

export default App;