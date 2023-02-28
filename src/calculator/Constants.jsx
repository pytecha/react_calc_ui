export const fnMainKeys = {
  // key: [token, ?input, ?label]
  "recp-fact": ["@expt-1", <sup>-1</sup>, "x⁻¹"],
  "comb-perm": ["@comb", "nCr"],
  "pol-rec-colon": ["@polar(", "Pol("],
  "cube-cbrt": ["@expt3", <sup>3</sup>, "x³"],
  "imp-prop": ["@frac", "ab/c"],
  "sqrt": ["@sqrt", "√"],
  "sqre": ["@expt2", <sup>2</sup>, "x²"],
  "expt-xrot": ["@expt", "^"],
  "log-10x": ["@log", "log"],
  "ln-ex-e": ["@ln", "ln"],
  "dash-a": ["-", "-", "(-)"],
  "deg-conv-b": ["@deci", <span><sup>o</sup>❜❜❜</span>],
  "hyp-c": ["hyp"],
  "sin-d": ["@sin", "sin"],
  "cos-e": ["@cos", "cos"],
  "tan-f": ["@tan", "tan"],
  "rcl-sto": ["RCL"],
  "eng-reng": ["ENG"],
  "lparen": ["("],
  "rparen-x": [")"],
  "comma-smcolon-y": [","],
  "ms-dt-cl": ["M+"]
}

export const nmMainKeys = {
  "seven": ["7"],
  "eight": ["8"],
  "nine": ["9"],
  "del-ins": ["DEL"],
  "ac-off": ["AC"],
  "four": ["4"],
  "five-stat": ["5"],
  "six": ["6"],
  "times": ["*", "×"],
  "divide": ["/", "÷"],
  "one": ["1"],
  "two": ["2"],
  "three": ["3"],
  "plus": ["+"],
  "minus": ["-"],
  "zero-rnd": ["0"],
  "dot-rand": ["."],
  "pi-x10x": ["*10@expt", "×10^", <span>×10<sup>x</sup></span>],
  "ans-drg": ["Ans"],
  "equal-perc": ["="]
}

export const fnShiftKeys = {
  "recp-fact": ["@fact", "!", "x!"],
  "comb-perm": ["@perm", "nPr"],
  "pol-rec-colon": ["@rect(", "Rec("],
  "cube-cbrt": ["@cbrt", "³√"],
  "imp-prop": ["d/c"],
  "expt-xrot": ["@xroot", <span><sup>ℵ</sup>√</span>, <span><sup>x</sup>√</span>],
  "log-10x": ["@powtx", "10^", <span>10<sup>x</sup></span>],
  "ln-ex-e": ["@powex", <span><em>e</em>^</span>, <span>e<sup>x</sup></span>],
  "deg-conv-b": ["←θ"],
  "sin-d": ["@asin", <span>sin<sup>-1</sup></span>],
  "cos-e": ["@acos", <span>cos<sup>-1</sup></span>],
  "tan-f": ["@atan", <span>tan<sup>-1</sup></span>],
  "rcl-sto": ["STO"],
  "eng-reng": ["←E"],
  "comma-smcolon-y": [";"],
  "ms-dt-cl": ["M-"]
}

export const nmShiftKeys = {
  "del-ins": ["INS"],
  "ac-off": ["OFF"],
  "zero-rnd": ["Rnd"],
  "dot-rand": ["@rand", "Ran#"],
  "pi-x10x": ["@pi", "π"],
  "ans-drg": ["DRG∇"],
  "equal-perc": ["@perc", "%"]
}

export const rclStoKeys = {
  "dash-a": ["@A", "A"],
  "deg-conv-b": ["@B", "B"],
  "hyp-c": ["@C", "C"],
  "sin-d": ["@D", "D"],
  "cos-e": ["@E", "E"],
  "tan-f": ["@F", "F"],
  "rparen-x": ["@X", "X"],
  "comma-smcolon-y": ["@Y", "Y"],
  "ms-dt-cl": ["@M", "M"]
}

export const alphaKeys = {
  "pol-rec-colon": [":"],
  "ln-ex-e": ["@e", <em>e</em>, "e"],
  ...rclStoKeys
}

export const hypMainKeys = {
  "sin-d": ["@sinh", "sinh"],
  "cos-e": ["@cosh", "cosh"],
  "tan-f": ["@tanh", "tanh"],
}

export const hypShiftKeys = {
  "sin-d": ["@asinh", <span style={{fontSize: "0.9em"}}>sinh<sup>-1</sup></span>],
  "cos-e": ["@acosh", <span style={{fontSize: "0.9em"}}>cosh<sup>-1</sup></span>],
  "tan-f": ["@atanh", <span style={{fontSize: "0.9em"}}>tanh<sup>-1</sup></span>],
}

export const regSdKeys = [
  {
    "pol-rec-colon": [";"],
    "ms-dt-cl": ["DT"]
  },
  {
    "pol-rec-colon": [","],
    "ms-dt-cl": ["CL"],
    "five-stat": ["STAT"]
  }
]

export const initialState = {
  fnKeys: fnMainKeys,
  nmKeys: nmMainKeys,
  toggles: {
    cursorActive: false,
    slotmActive: false,
    shiftActive: false,
    alphaActive: false,
    clearActive: false,
    powerActive: false,
    errorActive: false,
    modeActive: false,
    gradActive: false,
    histActive: false,
    statActive: false,
    drgActive: false,
    degActive: true,
    radActive: false,
    hypActive: false,
    insActive: false,
    rclActive: false,
    stoActive: false,
    regActive: false,
    fixActive: false,
    sciActive: false,
    nrmActive: true,
    navActive: false,
    sdActive: false
  }
};

export const stateClasses = {
  shiftActive: "text-[#FF8C02] bg-[#333]",
  alphaActive: "text-[rgb(255,133,154)] bg-[#333]",
  hypActive: "text-gray-200 bg-green-700",
  rclActive: "text-green-900 bg-gray-400",
  stoActive: "text-[#800000] bg-gray-400",
  regSdActive: "bg-purple-800 text-gray-100"
}
export const appConst = {
  A: 0,
  Ans: 0,
  B: 0,
  C: 0,
  D: 0,
  E: 0,
  F: 0,
  M: 0,
  X: 0,
  Y: 0
}

export const statsEntry = [
  // token, ?input
  ["A"],
  ["B"],
  ["C"],
  ["D"],
  ["E"],
  ["F"],
  ["M"],
  ["X"],
  ["Y"],
  ["a"],
  ["b"],
  ["c"],
  ["meanx", <span>x&#772;</span>],
  ["meany", <span>y&#772;</span>],
  ["n"],
  ["pstdx", <span>&sigma;x</span>],
  ["pstdy", <span>&sigma;y</span>],
  ["r"],
  ["stdx", <span>s&sigma;x</span>],
  ["stdy", <span>s&sigma;y</span>],
  ["sumfrx", <span>&Sigma;x<sup>4</sup></span>],
  ["sumtrx", <span>&Sigma;x<sup>3</sup></span>],
  ["sumtwx", <span>&Sigma;x<sup>2</sup></span>],
  ["sumtwxy", <span>&Sigma;x<sup>2</sup>y</span>],
  ["sumtwy", <span>&Sigma;y<sup>2</sup></span>],
  ["sumx", <span>&Sigma;x</span>],
  ["sumxy", <span>&Sigma;xy</span>],
  ["sumy", <span>&Sigma;y</span>],
  ["xpred", <span>x&#770;</span>],
  ["ypred", <span>y&#770;</span>]
];

export const RegFormulae = [
  ["lin",<span>y=a+bx</span>],
  ["inv",<span>y=a+bx<sup>-1</sup></span>],
  ["log",<span>y=a+blog<sub>e</sub>x</span>],
  ["exp1",<span>y=ax<sup>b</sup></span>],
  ["exp2",<span>y=ae<sup>bx</sup></span>],
  ["exp3",<span>y=ab<sup>x</sup></span>],
  ["quad",<span>y=a+bx+cx<sup>2</sup></span>]
];

const voidFunc = (...args) => undefined;
export const voidFuncs = [voidFunc, voidFunc, voidFunc, voidFunc]