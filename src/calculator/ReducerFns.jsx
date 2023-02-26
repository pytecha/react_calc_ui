import {
	fnMainKeys, nmMainKeys, fnShiftKeys, nmShiftKeys,
	alphaKeys, rclStoKeys, regSdKeys,
	hypMainKeys, hypShiftKeys, initialState
}
	from "./Constants";

const STO = {
	"rcl-sto": ["", "STO"]
};

export const keysReducer = (state, action) => {
	const {
		toggles
	} = state;
	if (!toggles.powerActive && action.button !== "poweron") return state;
	const isRegSd = toggles.regActive || toggles.sdActive;
	switch (action.type) {
	  case "multitoggles":
	    return {
	      ...state,
	      toggles: {
	        ...toggles,
	        ...action.states
	      }
	    }
		case "toggleshift":
			return {
				...state,
				fnKeys: toggles.shiftActive ? {
					...fnMainKeys,
					...(isRegSd ? regSdKeys[0] : {})
				} : {
					...fnMainKeys,
					...fnShiftKeys,
					...(isRegSd ? regSdKeys[1] : {})
				},
				nmKeys: toggles.shiftActive ? {
					...nmMainKeys,
					...(isRegSd ? regSdKeys[0] : {})
				} : {
					...nmMainKeys,
					...nmShiftKeys,
					...(isRegSd ? regSdKeys[1] : {})
				},
				toggles: {
					...toggles,
					shiftActive: !toggles.shiftActive,
					alphaActive: false,
					hypActive: false,
					rclActive: false,
					stoActive: false,
					errorActive: false,
					modeActive: false,
					clearActive: false,
					statActive: false,
					drgActive: false,
					cursorActive: true,
					histActive: false,
				}
			}
		case "togglealpha":
			return {
				...state,
				fnKeys: toggles.alphaActive ? {
					...fnMainKeys,
					...(isRegSd ? regSdKeys[0] : {})
				} : {
					...fnMainKeys,
					...alphaKeys
				},
				nmKeys: nmMainKeys,
				toggles: {
					...toggles,
					alphaActive: !toggles.alphaActive,
					shiftActive: false,
					hypActive: false,
					rclActive: false,
					stoActive: false,
					errorActive: false,
					modeActive: false,
					clearActive: false,
					statActive: false,
					drgActive: false,
					cursorActive: true,
					histActive: false,
				}
			}
		case "togglehyp":
			return {
				...state,
				fnKeys: toggles.shiftActive ? {
					...fnMainKeys,
					...fnShiftKeys,
					...(toggles.hypActive ? {} : hypShiftKeys),
					...(isRegSd ? regSdKeys[1] : {})
				} : {
					...fnMainKeys,
					...(toggles.hypActive ? {} : hypMainKeys),
					...(isRegSd ? regSdKeys[0] : {})
				},
				toggles: {
					...toggles,
					hypActive: !toggles.hypActive,
					errorActive: false,
					modeActive: false,
					clearActive: false,
					statActive: false,
					drgActive: false,
					cursorActive: true,
					histActive: false,
				}
			}
		case "togglerclorsto":
			return {
				...state,
				...(toggles.shiftActive ? // button sto
				  {
				    fnKeys: toggles.stoActive ? {
    					...fnMainKeys,
    					...fnShiftKeys,
    					...(isRegSd ? regSdKeys[1] : {}),
    					...STO
    				} : {
    					...fnMainKeys,
    					...fnShiftKeys,
    					...(isRegSd ? {
      					  ...regSdKeys[0],
      					  "pol-rec-colon": "❟"
    					  } : {}
    					),
    					...rclStoKeys,
    					...STO
    				}
				  }
				    : // button rcl
				  {
				    fnKeys: toggles.rclActive ? {
    					...fnMainKeys,
    					...(isRegSd ? regSdKeys[0] : {})
    				} : {
    					...fnMainKeys,
    					...(isRegSd ? {
      					  ...regSdKeys[1],
      					  "pol-rec-colon": ";"
    					  } : {}
    					),
    					...rclStoKeys,
    				}
				  }
				),
				toggles: {
					...toggles,
					...(toggles.shiftActive ?
					  {stoActive: !toggles.stoActive} // button sto
					    :
					  {rclActive: !toggles.rclActive} // button rcl
					 ),
					alphaActive: false,
					hypActive: false,
					errorActive: false,
					modeActive: false,
					clearActive: false,
					statActive: false,
					drgActive: false,
					cursorActive: true,
					histActive: false,
				}
			}
		case "togglepower":
			if (toggles.powerActive && (action.state || action.button == "acoff")) {
				return {
					...state,
					fnKeys: {
						...fnMainKeys,
						...(isRegSd ? regSdKeys[0] : {})
					},
					nmKeys: nmMainKeys,
					toggles: {
						...toggles,
						shiftActive: false,
						alphaActive: false,
						clearActive: false,
						errorActive: false,
						modeActive: false,
					  statActive: false,
						hypActive: false,
						rclActive: false,
						stoActive: false,
						navActive: false,
						drgActive: false,
						cursorActive: true,
					  histActive: false,
					}
				}
			} else {
  			return action.state ? {
  				...state,
  				fnKeys: {
  					...fnMainKeys,
  					...(isRegSd ? regSdKeys[0] : {})
  				},
  				toggles: {
  					...toggles,
  					powerActive: action.state,
  					cursorActive: true
  				}
  			} : initialState;
			}
		case "togglemodeorclear":
			return {
				...state,
				toggles: {
					...toggles,
					...(toggles.shiftActive ?
					  {clearActive: !toggles.clearActive}
					    :
					  {modeActive: !toggles.modeActive}
					 ),
					errorActive: false,
					statActive: false,
					histActive: false,
				}
			}
		case "toggleregsd":
			return {
				...state,
				toggles: {
					...toggles,
					alphaActive: false,
					hypActive: false,
					rclActive: false,
					...(action.kind === "reg" ?
						{
							regActive: true,
							sdActive: false
						} : action.kind === "sd" ?
							{
								sdActive: true,
								regActive: false
							} :
							{
								sdActive: false,
								regActive: false
							}
					)
				}
			}
		case "togglefixscinrm":
			return {
				...state,
				toggles: {
					...toggles,
					...(
						action.kind === "FIX" ?
							{
								fixActive: true,
								sciActive: false,
								nrmActive: false
							} : action.kind === "SCI" ?
								{
									fixActive: false,
									sciActive: true,
									nrmActive: false
								} :
								{
									fixActive: false,
									sciActive: false,
									nrmActive: true
								}
					)
				}
			}
		case "toggledegrad":
			return {
				...state,
				toggles: {
					...toggles,
					...(
						action.kind === "DEG" ?
							{
								degActive: true,
								radActive: false,
								gradActive: false
							} : action.kind === "RAD" ?
								{
									degActive: false,
									radActive: true,
									gradActive: false
								} :
								{
									degActive: false,
									radActive: false,
									gradActive: true
								}
					)
				}
			}
		default:
			throw new Error();
	}
};

export const exprsTokensReducer = (state, action) => {
	const {
		exprs, tokens
	} = state
	let exprPopped, tokenPopped;
	switch (action.type) {
		case "add":
			exprs.left.push(action.input)
			tokens.left.push(action.token)
			if (action.ins && exprs.right.length) {
				exprs.right.pop()
				tokens.right.pop()
			}
			return {
				exprs: {
					left: exprs.left,
					right: exprs.right
				},
				tokens: {
					left: tokens.left,
					right: tokens.right
				}
			}
		case "delete":
			if (!exprs.left.length) return state
			exprs.left.pop()
			tokens.left.pop()
			return {
				exprs: {
					left: exprs.left,
					right: exprs.right
				},
				tokens: {
					left: tokens.left,
					right: tokens.right
				}
			}
		case "navleft":
			exprPopped = exprs.left.pop()
			tokenPopped = tokens.left.pop()
			if (exprPopped === undefined) return state
			exprs.right.push(exprPopped)
			tokens.right.push(tokenPopped)
			return {
				exprs: {
					left: exprs.left,
					right: exprs.right
				},
				tokens: {
					left: tokens.left,
					right: tokens.right
				}
			}
		case "navright":
			exprPopped = exprs.right.pop()
			tokenPopped = tokens.right.pop()
			if (exprPopped === undefined) return state
			exprs.left.push(exprPopped)
			tokens.left.push(tokenPopped)
			return {
				exprs: {
					left: exprs.left,
					right: exprs.right
				},
				tokens: {
					left: tokens.left,
					right: tokens.right
				}
			}
		case "navtop":
			while (true) {
				exprPopped = exprs.left.pop()
				tokenPopped = tokens.left.pop()
				if (exprPopped === undefined) break
				exprs.right.push(exprPopped)
				tokens.right.push(tokenPopped)
			}
			return {
				exprs: {
					left: [],
					right: exprs.right
				},
				tokens: {
					left: [],
					right: tokens.right
				}
			}
		case "navbottom":
			while (true) {
				exprPopped = exprs.right.pop()
				tokenPopped = tokens.right.pop()
				if (exprPopped === undefined) break
				exprs.left.push(exprPopped)
				tokens.left.push(tokenPopped)
			}
			return {
				exprs: {
					left: exprs.left,
					right: []
				},
				tokens: {
					left: tokens.left,
					right: []
				}
			}
		case "clear":
			return {
				exprs: {
					left: [],
					right: []
				},
				tokens: {
					left: [],
					right: []
				}
			}
		default:
			throw new Error()
	}
};