import {
	useRef, useContext
}
	from "react";
import {
	StatesContext
}
	from "./Contexts";
import {
	stateClasses
}
	from "./Constants";

let _toggles, _dispatchExprTokenState, _fetchApi, _handleRcl;

export default ({
	props: [fnKeys, dispatchKeyState, dispatchExprTokenState, fetchApi, handleRcl, manageAppRefs]
}) => {
	// fetchApi -> fetchApiExtend
	const toggles = useContext(StatesContext);
	const eng = useRef(-1);

	const handleImpProp = () => {
		if (toggles.shiftActive) fetchApi({
			endpoint: "conversion",
			kind: "frac"
		});
		// else if (!toggles.cursorActive) {} // get proper frac
		else dispatchExprTokenState({
			type: "add",
			token: "@frac",
			input: <span style={{display: "inline-block", transform: "rotateY(-180deg)"}}>∟</span>,
			ins: toggles.insActive
		});
	};

	const handleHypC = () => {
		if (toggles.alphaActive) dispatchExprTokenState({
			type: "add",
			token: "@C",
			input: "C",
			ins: toggles.insActive
		});
		else if (toggles.rclActive || toggles.stoActive) {
			toggles.rclActive ? handleRcl("C") : fetchApi({
				endpoint: "main",
				sto: "C"
			});
		} else dispatchKeyState({
			type: "togglehyp"
		});
	};

	const handleDegConvB = () => {
		if (toggles.alphaActive) dispatchExprTokenState({
			type: "add",
			token: "@B",
			input: "B",
			ins: toggles.insActive
		});
		else if (toggles.rclActive || toggles.stoActive) {
			toggles.rclActive ? handleRcl("B") : fetchApi({
				endpoint: "main",
				sto: "B"
			});
		} else if (toggles.shiftActive || !toggles.cursorActive) fetchApi({
			endpoint: "conversion",
			kind: "time"
		});
		else dispatchExprTokenState({
			type: "add",
			token: "@deci",
			input: "⁰",
			ins: toggles.insActive
		});
	};

	const handleMsDtCl = () => {
		if (toggles.alphaActive) dispatchExprTokenState({
			type: "add",
			token: "@M",
			input: "M",
			ins: toggles.insActive
		}); // alpha & M
		else if (toggles.rclActive || toggles.stoActive) { // (rcl || sto) & M
			toggles.rclActive ? handleRcl("M") : fetchApi({
				endpoint: "main",
				sto: "M"
			});
		} else if (toggles.shiftActive && (toggles.regActive || toggles.sdActive)) manageAppRefs({}); // CL
		else if (toggles.shiftActive) fetchApi({
			endpoint: "main",
			sto: "M-"
		}); // M-
		else if (toggles.regActive) fetchApi({
			endpoint: "regression"
		}); // reg & DT
		else if (toggles.sdActive) fetchApi({
			endpoint: "deviation"
		}); // sd & DT
		else fetchApi({
			endpoint: "main",
			sto: "M+"
		}); // M+
	};

	const handleEngReng = () => {
		if (toggles.shiftActive) {
			eng.current += (eng.current === -1 ? 1 : 3);
			fetchApi({
				endpoint: "conversion",
				kind: "eng",
				dp: eng.current
			});
			if (eng.current === 12) {
				eng.current = -1;
			}
		} else {
			eng.current -= (eng.current === -1 ? -1 : 3);
			fetchApi({
				endpoint: "conversion",
				kind: "eng",
				dp: eng.current
			});
			if (eng.current === -12) {
				eng.current = -1;
			}
		}
	};

	_toggles = toggles;
	_dispatchExprTokenState = dispatchExprTokenState;
	_fetchApi = fetchApi;
	_handleRcl = handleRcl;

	return (
		<div className="grid grid-rows-4 grid-cols-6 px-2 pb-2 mb-4 justify-center bg-gray-300 rounded-md" id="funcspad">
			<Button cls="mr-2" props={fnKeys["recp-fact"]} />
			<div className="block bg-[#333333]">
				<div className="flex bg-gray-300 rounded-tr-md">
					<Button cls="flex-1 mr-2" props={fnKeys["comb-perm"]} />
				</div>
			</div>
			<div className="col-span-2 bg-[#333333] rounded-b-md"></div>
			<div className="block bg-[#333333]">
				<div className="flex bg-gray-300 rounded-tl-md">
					<Button cls="flex-1 ml-2" props={fnKeys["pol-rec-colon"]} effects={{ alpha: true }} />
				</div>
			</div>
			<Button cls="ml-2" props={fnKeys["cube-cbrt"]} />
			<Button cls="mr-2" props={fnKeys["imp-prop"]} func={handleImpProp} />
			<Button cls="mr-2" props={fnKeys["sqrt"]} effects={{ noshift: true }} />
			<Button cls="mr-1" props={fnKeys["sqre"]} effects={{ noshift: true }} />
			<Button cls="ml-1" props={fnKeys["expt-xrot"]} />
			<Button cls="ml-2" props={fnKeys["log-10x"]} />
			<Button cls="ml-2" props={fnKeys["ln-ex-e"]} effects={{ alpha: true }} />
			<Button cls="mr-2" props={fnKeys["dash-a"]} effects={{ noshift: true, alpha: true, rclsto: true }} />
			<Button cls="mr-2" props={fnKeys["deg-conv-b"]} func={handleDegConvB} effects={{ alpha: true, rclsto: true }} />
			<Button cls="mr-1" props={fnKeys["hyp-c"]} func={handleHypC} effects={{ noshift: true, alpha: true, rclsto: true }} />
			<Button cls="ml-1" props={fnKeys["sin-d"]} effects={{ hyp: true, alpha: true, rclsto: true }} />
			<Button cls="ml-2" props={fnKeys["cos-e"]} effects={{ hyp: true, alpha: true, rclsto: true }} />
			<Button cls="ml-2" props={fnKeys["tan-f"]} effects={{ hyp: true, alpha: true, rclsto: true }} />
			<Button cls="mr-2" props={fnKeys["rcl-sto"]} func={() => dispatchKeyState({ type: "togglerclorsto" })} />
			<Button cls="mr-2" props={fnKeys["eng-reng"]} func={handleEngReng} />
			<Button cls="mr-1" props={fnKeys["lparen"]} effects={{ noshift: true }} />
			<Button cls="ml-1" props={fnKeys["rparen-x"]} effects={{ noshift: true, alpha: true, rclsto: true }} />
			<Button cls="ml-2" props={fnKeys["comma-smcolon-y"]} effects={{ alpha: true, rclsto: true }} />
			<Button
				cls="ml-2"
				props={fnKeys["ms-dt-cl"]}
				func={handleMsDtCl}
				effects={{ shift: true, alpha: true, rclsto: true, regsd: true }}
			/>
		</div>
	);
};

const Button = ({ cls, props: [token, input, label], effects, func }) => {
	return (
		<button
			className={`mt-2 py-1 rounded-md ${_toggles.powerActive && "active:bg-gray-400"} ${getStateClasses(effects)} ${cls}`}
			onClick={func || function () {
				if (_toggles.rclActive || _toggles.stoActive) {
					if ("ABCDEFMXY".includes(input)) {
						if (_toggles.stoActive) {
							_fetchApi({ endpoint: "main", sto: input })
							return
						}
						_handleRcl(input)
						return
					}
				}
				_dispatchExprTokenState({ type: "add", token: token, input: input || token, ins: _toggles.insActive })
			}}
		>
			{label || input || token}
		</button>
	);
};

const defaultClasses = "bg-[#333333] text-gray-200";

const getStateClasses = (effects = {}) => {
	return !_toggles.powerActive ? "bg-[#333333] text-gray-200" :
		(effects.hyp && _toggles.hypActive) ? stateClasses.hypActive :
			(effects.rclsto && _toggles.rclActive) ? stateClasses.rclActive :
				(effects.rclsto && _toggles.stoActive) ? stateClasses.stoActive :
					(effects.alpha && _toggles.alphaActive) ? stateClasses.alphaActive :
						(effects.regsd && (_toggles.regActive || _toggles.sdActive) && _toggles.shiftActive) ? "bg-[#FF8C02] text-[#333333]" :
							(effects.regsd && (_toggles.regActive || _toggles.sdActive) && !_toggles.shiftActive) ? stateClasses.regSdActive :
								(!effects.noshift && effects.regsd && _toggles.shiftActive && (_toggles.regActive || _toggles.sdActive)) ? `${stateClasses.shiftActive} bg-gray-400 text-[#800000]` :
									(!effects.noshift && _toggles.shiftActive) ? stateClasses.shiftActive : defaultClasses;
};