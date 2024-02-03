const fnMainKeys = [
  [1, ["f10", <span>x<sup>-1</sup></span>]],
  [2, ["f20", "nCr"]],
  [3, ["f30", "Pol("]],
  [4, ["f40", <span>x<sup>3</sup></span>]],
  [5, ["y50", "ab/c"]],
  [6, ["y60", "drg∇"]],
  [7, ["f70", <span>x<sup>2</sup></span>]],
  [8, ["f80", "^"]],
  [9, ["f90", "log"]],
  [10, ["f100", "ln"]],
  [11, ["f110", "π"]],
  [12, ["y120", <span><sup>o</sup>❜❜❜</span>]],
  [13, ["y130", "Hyp"]],
  [14, ["f140", "sin"]],
  [15, ["f150", "cos"]],
  [16, ["f160", "tan"]],
  [17, ["y170", "RCL"]],
  [18, ["y180", "ENG"]],
  [19, ["f190", "("]],
  [20, ["f200", ")"]],
  [21, ["f210", ","]],
  [22, ["y220", "M+"]]
];

const nmMainKeys = [
  [1, ["n10", "7"]],
  [2, ["n20", "8"]],
  [3, ["n30", "9"]],
  [4, ["y48", "DEL"]],
  [5, ["y57", "AC"]],
  [6, ["n60", "4"]],
  [7, ["n70", "5"]],
  [8, ["n80", "6"]],
  [9, ["n90", "×"]],
  [10, ["n100", "÷"]],
  [11, ["n110", "1"]],
  [12, ["n120", "2"]],
  [13, ["n130", "3"]],
  [14, ["n140", "+"]],
  [15, ["n150", "-"]],
  [16, ["n160", "0"]],
  [17, ["n170", "."]],
  [18, ["n180", "Ran#"]],
  [19, ["n190", "Ans"]],
  [20, ["y200", "="]]
];

const fnShiftKeys = [
  [1, ["f11", "x!"]],
  [2, ["f21", "nPr"]],
  [3, ["f31", "Rec("]],
  [4, ["f41", <span><sup>3</sup>√</span>]],
  [5, ["y51", "d/c"]],
  [6, ["y61", "Rnd"]],
  [7, ["f71", "√"]],
  [8, ["f81", <span><sup>x</sup>√</span>]],
  [11, ["f111", "%"]],
  [12, ["y121", "←⁰"]],
  [14, ["f141", <span>sin<sup>-1</sup></span>]],
  [15, ["f151", <span>cos<sup>-1</sup></span>]],
  [16, ["f161", <span>tan<sup>-1</sup></span>]],
  [17, ["y171", "STO"]],
  [18, ["y181", "←E"]],
  [22, ["y221", "M-"]]
];

const alphaRclStoKeys = [
  [11, "A"],
  [12, "B"],
  [13, "C"],
  [14, "D"],
  [15, "E"],
  [16, "F"],
  [20, "X"],
  [21, "Y"],
  [22, "M"]
];

const alphaKeys = [
  [3, ["f32", ":"]],
  [9, ["f92", "d"]],
  [10, ["f102", "e"]]
];

const rclKeys = [];

const stoKeys = [];

const arrCreate = (key, cat, value) => [key, [`fu${key}${cat}`, value]];

alphaRclStoKeys.forEach(([key, value]) => { // u -> union
  alphaKeys.push(arrCreate(key, 2, value));
  rclKeys.push(arrCreate(key, 4, value));
  stoKeys.push(arrCreate(key, 5, value));
});

const hypMainKeys = new Map([
  [14, ["f1403", "sinh"]],
  [15, ["f1503", "cosh"]],
  [16, ["f1603", "tanh"]]
]);

const hypStyles = { fontSize: "0.8em" };

const hypShiftKeys = [
  [14, ["f1413", <span style={hypStyles}>sinh<sup>-1</sup></span>]],
  [15, ["f1513", <span style={hypStyles}>cosh<sup>-1</sup></span>]],
  [16, ["f1613", <span style={hypStyles}>tanh<sup>-1</sup></span>]]
];

const rsMainKeys = [
  [3, ["y30", ";"]],
  [21, ["f210", ","]],
  [22, ['y226', "DT"]]
];

const rsShiftKeys = [
  [3, ["y30", ";"]],
  [21, ["f210", ","]],
  [22, ['y226', "DT"]]
];

const initialKeysState = new Map([
  ["fnKeys", new Map(fnMainKeys)],
  ["nmKeys", new Map(nmMainKeys)],
  ["toggles", Object.fromEntries([
    ...["deg", "cmp", "nrm", "cursor"].map(key => [key, true]),
    ...[
      "slotm", "shift", "alpha", "error", "mode", "grad", "hist", "stat", "drg",
      "rad", "hyp", "ins", "rcl", "rst", "sto", "reg", "fix", "sci", "nav", "sd"
    ].map(key => [key, false])
  ])]
]);

const keyStyles = [
  "text-gray-200 bg-[#333]", // 0 default
  "text-[#FF8C02] bg-[#333]", // 1 shift
  "text-[rgb(255,133,154)] bg-[#333]", // 2 alpha
  "text-gray-200 bg-green-700", // 3 hyp
  "text-green-900 bg-gray-400", // 4 rcl
  "text-[#800000] bg-gray-400", // 5 sto
  "text-gray-200 bg-purple-800", // 6 dt
  "text-gray-200 bg-red-900", // 7 ac & off
  "text-[#333] bg-[#FF8C02]", // 8 del
];

const fracStyle = { display: "inline-block", fontWeight: 600, marginRight: "1px", transform: "rotateY(-180deg)" };

const tokenInputs = new Map([
  ["f10", <sup data-token="@exp-1">-1</sup>],
  ["f20", <b data-token="@comb"><em>C</em></b>],
  ["f30", <span data-token="#polar(">Pol(</span>],
  ["y30", <span data-token=";">;</span>],
  ["f40", <sup data-token="@exp3">3</sup>],
  ["y50", <span data-token="@frac" style={fracStyle}>∟</span>],
  ["f70", <sup data-token="@exp2">2</sup>],
  ["f71", <span data-token="@sqrt">√</span>],
  ["f80", <span data-token="@exp">^</span>],
  ["f90", <span data-token="@log">log</span>],
  ["f100", <span data-token="@ln">ln</span>],
  ["f110", <span data-token="#pi">π</span>],
  ["f111", <span data-token="@perc">%</span>],
  ["y120", <sup data-token="@deci">o</sup>],
  ["f140", <span data-token="@sin">sin</span>],
  ["f150", <span data-token="@cos">cos</span>],
  ["f160", <span data-token="@tan">tan</span>],
  ["f190", <span data-token="(">(</span>],
  ["f200", <span data-token=")">)</span>],
  ["f210", <span data-token=",">,</span>],
  ["y220", <span data-token="=>M+">M+</span>],
  ["y221", <span data-token="=>M-">M-</span>],
  ["f11", <span data-token="@fact">!</span>],
  ["f21", <b data-token="@perm"><em>P</em></b>],
  ["f31", <span data-token="#rect(">Rec(</span>],
  ["f41", <span data-token="@cbrt"><sup>3</sup>√</span>],
  ["f81", <span data-token="@xroot"><sup>x</sup>√</span>],
  ["f141", <span data-token="@asin">sin<sup>-1</sup></span>],
  ["f151", <span data-token="@acos">cos<sup>-1</sup></span>],
  ["f161", <span data-token="@atan">tan<sup>-1</sup></span>],
  ["f32", <span data-token=":">:</span>],
  ["f92", <em data-token="#d">d</em>],
  ["f102", <em data-token="#e">e</em>],
  ["f11u", <span data-token="#A">A</span>],
  ["f12u", <span data-token="#B">B</span>],
  ["f13u", <span data-token="#C">C</span>],
  ["f14u", <span data-token="#D">D</span>],
  ["f15u", <span data-token="#E">E</span>],
  ["f16u", <span data-token="#F">F</span>],
  ["f20u", <span data-token="#X">X</span>],
  ["f21u", <span data-token="#Y">Y</span>],
  ["f22u", <span data-token="#M">M</span>],
  ["f1403", <span data-token="@sinh">sinh</span>],
  ["f1503", <span data-token="@cosh">cosh</span>],
  ["f1603", <span data-token="@tanh">tanh</span>],
  ["f1413", <span data-token="@asinh">sinh<sup>-1</sup></span>],
  ["f1513", <span data-token="@acosh">cosh<sup>-1</sup></span>],
  ["f1613", <span data-token="@atanh">tanh<sup>-1</sup></span>],
  ["n10", <span data-token="7">7</span>],
  ["n20", <span data-token="8">8</span>],
  ["n30", <span data-token="9">9</span>],
  ["n60", <span data-token="4">4</span>],
  ["n70", <span data-token="5">5</span>],
  ["n80", <span data-token="6">6</span>],
  ["n90", <span data-token="*">×</span>],
  ["n100", <span data-token="/">÷</span>],
  ["n110", <span data-token="1">1</span>],
  ["n120", <span data-token="2">2</span>],
  ["n130", <span data-token="3">3</span>],
  ["n140", <span data-token="+">+</span>],
  ["n150", <span data-token="-">-</span>],
  ["n160", <span data-token="0">0</span>],
  ["n170", <span data-token=".">.</span>],
  ["n180", <span data-token="#rand">Ran#</span>],
  ["n190", <span data-token="#Q">Ans</span>],
  ["pmtd", <sup data-token="@deg">d</sup>],
  ["pmtr", <sup data-token="@rad">r</sup>],
  ["pmtg", <sup data-token="@grad">g</sup>],
  ["mean", <span data-token="#mean">x&#772;</span>],
  ["median", <span data-token="#median">Mx</span>],
  ["mode", <span data-token="#mode">Mod</span>],
  ["pstd", <span data-token="#pstd">&sigma;x</span>],
  ["std", <span data-token="#std">s&sigma;x</span>],
  ["xpreds", <span data-token="@xpredf">x&#770;</span>],
  ["ypreds", <span data-token="@ypredf">y&#770;</span>],
  ..."abcnr".split("").map(key => [key, <span data-token={"#"+key}>{key}</span>])
]);

const regFormulae = [
  ["lin", <span>y = a+bx</span>],
  ["inv", <span>y = a+bx<sup>-1</sup></span>],
  ["log", <span>y = a+blog<sub>e</sub>x</span>],
  ["exp1", <span>y = ax<sup>b</sup></span>],
  ["exp2", <span>y = ae<sup>bx</sup></span>],
  ["exp3", <span>y = ab<sup>x</sup></span>],
  ["quad", <span>y = a+bx+cx<sup>2</sup></span>]
];

const fnBtnData = [['mr-2', 1], ['flex-1 mr-2', 2, "rounded-tr-md"], ['', 23], ['flex-1 ml-2', 3, "rounded-tl-md"], ['ml-2', 4], ['mr-2', 5], ['mr-2', 6], ['mr-1', 7], ['ml-1', 8], ['ml-2', 9], ['ml-2', 10], ['mr-2', 11], ['mr-2', 12], ['mr-1', 13], ['ml-1', 14], ['ml-2', 15], ['ml-2', 16], ['mr-2', 17], ['mr-2', 18], ['mr-1', 19], ['ml-1', 20], ['ml-2', 21], ['ml-2', 22]];

const keysReducer = (state, action) => {
  const toggles = state.get("toggles");
  const isRegSd = toggles.reg || toggles.sd;
  switch(action.type) {
    case "multitoggles":
      return new Map([
        ...state,
        ["toggles", {
          ...toggles,
          ...action.states
        }]
      ]);
      
    case "toggleshift":
      return new Map([
        ["fnKeys", new Map(toggles.shift ? [
          ...fnMainKeys,
          ...(isRegSd ? rsMainKeys : [])]
          : [
            ...fnMainKeys,
            ...fnShiftKeys,
            ...(isRegSd ? rsShiftKeys : [])])],
        ["nmKeys", new Map([...nmMainKeys, toggles.shift ? [] : [18, ["y181", "INS"]]])],
        ["toggles", {
          ...toggles,
          shift: !toggles.shift,
          ...Object.fromEntries([
            "alpha", "hyp", "rcl", "sto", "error",
            "mode", "clear", "stat", "drg", "rst", "hist"
          ].map(key => [key, false])
          )
        }]
      ]);
      
    case "togglealpha":
      return new Map([
        ["fnKeys", new Map(toggles.alpha ? [
          ...fnMainKeys,
          ...(isRegSd ? rsMainKeys : [])
        ] : [
          ...fnMainKeys,
          ...alphaKeys,
        ])],
        ["nmKeys", new Map(nmMainKeys)],
        ["toggles", {
          ...toggles,
          alpha: !toggles.alpha,
          ...Object.fromEntries([
            "shift", "hyp", "rcl", "sto", "error",
            "mode", "clear", "stat", "drg", "rst", "hist"
          ].map(key => [key, false])
          )
        }]
      ]);
      
    case "togglehyp":
      return new Map([
        ["fnKeys", new Map(toggles.shift ? [
          ...fnMainKeys,
          ...fnShiftKeys,
          ...(toggles.hyp ? [] : hypShiftKeys),
          ...(isRegSd ? rsShiftKeys : [])
        ] : [
          ...fnMainKeys,
          ...(toggles.hyp ? [] : hypMainKeys),
          ...(isRegSd ? rsMainKeys : [])
        ])],
        ["nmKeys", state.get("nmKeys")],
        ["toggles", {
          ...toggles,
          hyp: !toggles.hyp,
          ...Object.fromEntries([
            "error", "mode", "clear", "stat", "drg", "rst", "hist"
          ].map(key => [key, false])
          )
        }]
      ]);
      
    case "togglercl-sto":
      return new Map([
        ["fnKeys", new Map(
          (function() {
            if(toggles.shift) {// button sto
              return toggles.sto ? [
                ...fnMainKeys,
                ...fnShiftKeys,
                ...(isRegSd ? rsShiftKeys : [])
              ] : [
                ...fnMainKeys,
                ...fnShiftKeys,
                ...(isRegSd ? rsShiftKeys : []),
                ...stoKeys
              ]
            } else {// button rcl
              return toggles.rcl ? [
                ...fnMainKeys,
                ...(isRegSd ? rsMainKeys : [])
              ] : [
                ...fnMainKeys,
                ...(isRegSd ? rsMainKeys : []),
                ...rclKeys,
              ]
            }
          })()
        )],
        ["nmKeys", state.get("nmKeys")],
        ["toggles", {
          ...toggles,
          ...(toggles.shift ?
            { sto: !toggles.sto } // button sto
            :
            { rcl: !toggles.rcl } // button rcl
          ),
          ...Object.fromEntries([
            "alpha", "hyp", "error", "mode",
            "clear", "stat", "drg", "rst", "hist"
          ].map(key => [key, false])
          )
        }]
      ]);
      
    case "reset":
      return action.button === "AC" ?
        new Map([
          ["fnKeys", new Map([
            ...fnMainKeys,
            ...(isRegSd ? rsMainKeys : [])
          ])],
          ["nmKeys", new Map(nmMainKeys)],
          ["toggles", {
            ...toggles,
            cursor: true,
            ...Object.fromEntries([
              "shift", "alpha", "hyp", "rcl", "sto", "error",
              "mode", "clear", "stat", "drg", "hist", "rst", "nav"
            ].map(key => [key, false])
            )
          }]
        ]) :
        initialKeysState;
      
    case "togglemode":
      return new Map([
        ...state,
        ["toggles", {
          ...toggles,
          mode: !toggles.mode,
          stat: false,
          hist: false,
          drg: false,
          rst: false,
          error: false,
        }]
      ]);
      
    case "togglecomp-reg-sd":
      return new Map([
        ["fnKeys", new Map(action.kind === "CMP" ? fnMainKeys : [...state.get("fnKeys"), ...rsMainKeys])],
        ["nmKeys", new Map(nmMainKeys)],
        ["toggles", {
          ...toggles,
          ...Object.fromEntries([
            ["cmp", false],
            ["reg", false],
            ["sd", false],
            [action.kind.toLowerCase(), true]
          ]),
          ...(action.kind === "CMP" && { alpha: false, hyp: false, rcl: false })
        }]
      ]);
      
    case "togglefix-sci-nrm":
      return new Map([
        ...state,
        ["toggles", {
          ...toggles,
          ...Object.fromEntries([
            ["fix", false],
            ["sci", false],
            ["nrm", false],
            [action.kind.toLowerCase(), true]
          ])
        }]
      ]);
      
    case "toggledeg-rad-grad":
      return new Map([
        ...state,
        ["toggles", {
          ...toggles,
          ...Object.fromEntries([
            ["deg", false],
            ["rad", false],
            ["grad", false],
            [action.kind.toLowerCase(), true]
          ])
        }]
      ]);
      
    default:
      throw new Error();
  }
};

const tokensReducer = (state, action) => {
  let tokenPopped;
  switch(action.type) {
    case "add":
      const { cursor, error, ins, mode, rst } = action.tgl;
      if (error || mode || rst) return state;
      
      const yTokens = ["y220", "y221"];
      if (yTokens.includes(action.token)) {
        if (yTokens.includes(state.left.slice(-1)[0])) {
          state.left.pop()
        }
        if (yTokens.includes(state.right.slice(-1)[0])) {
          state.right.pop()
        }
        while(true) {
          tokenPopped = state.right.pop();
          if(tokenPopped === undefined) break;
          state.left.push(tokenPopped);
        }
        state.left.push(action.token);
        return { ...state };
      }
      if(!cursor || !(state.left.length + state.right.length)) {
        return {
          left: [...(
            ["f10", "f11", "f20", "f21", "f40", "f70", "f80", "f81", "n90", "n100", "n140", "n150"]
            .includes(action.token) ? ["n190"] : []
            ), action.token],
          right: []
        };
      }
      state.left.push(action.token);
      if(ins && state.right.length) {
        state.right.pop();
      }
      return { ...state };

    case "delete":
      if(!state.left.length) return state;
      state.left.pop();
      return { ...state };

    case "navleft":
      tokenPopped = state.left.pop();
      if(tokenPopped === undefined) return state;
      state.right.push(tokenPopped);
      return { ...state };

    case "navright":
      tokenPopped = state.right.pop();
      if(tokenPopped === undefined) return state;
      state.left.push(tokenPopped);
      return { ...state };

    case "navtop":
      while(true) {
        tokenPopped = state.left.pop();
        if(tokenPopped === undefined) break;
        state.right.push(tokenPopped);
      }
      return { ...state };

    case "navbottom":
      while(true) {
        tokenPopped = state.right.pop();
        if(tokenPopped === undefined) break;
        state.left.push(tokenPopped);
      }
      return { ...state };

    case "tap":
      if(action.index < 0) return state;
      if(action.side === "left") {
        const maxIters = state.left.length - action.index;
        for(let iters = 0; iters < maxIters; iters++) {
          state.right.push(state.left.pop());
        }
        return { ...state };
      } else {
        const maxIters = action.index;
        for(let iters = -1; iters < maxIters; iters++) {
          state.left.push(state.right.pop());
        }
        return { ...state };
      }

    case "clear":
      return {
        left: [],
        right: []
      };

    default:
      throw new Error();
  }
};

export {
  initialKeysState,
  keyStyles,
  tokenInputs,
  regFormulae,
  fnBtnData,
  keysReducer,
  tokensReducer
};