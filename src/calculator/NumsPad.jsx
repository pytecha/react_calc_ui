import {
	useContext
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

let _toggles, _dispatchExprTokenState;
export default ({
	props: [nmKeys, dispatchKeyState, dispatchExprTokenState, fetchApi, setAnswer]
}) => {
	const toggles = useContext(StatesContext);

	const handleAcOff = () => {
		if (toggles.shiftActive) {
			dispatchKeyState({
				type: "togglepower",
				state: false
			});
			dispatchExprTokenState({
				type: "clear"
			});
		} else {
			dispatchKeyState({
				type: "togglepower",
				button: "acoff"
			});
			dispatchExprTokenState({
				type: "clear"
			});
			setAnswer("0");
		}
	};

	const handleDelIns = () => {
		if (toggles.shiftActive) dispatchKeyState({
			type: "multitoggles",
			states: {
			  insActive: !toggles.insActive
			}
		});
		else dispatchExprTokenState({
			type: "delete"
		});
	};

	const handleEqualPerc = () => {
		if (toggles.shiftActive) dispatchExprTokenState({
			type: "add",
			token: "@perc",
			input: "%",
			ins: toggles.insActive
		});
		else fetchApi({
			endpoint: "main"
		});
	};

	const handleAnsDrg = () => {
		if (toggles.shiftActive) dispatchKeyState({
		  type: "multitoggles",
			states: {
			  drgActive: !toggles.drgActive
			}
		});
		else dispatchExprTokenState({
			type: "add",
			token: "@Ans",
			input: "Ans",
			ins: toggles.insActive
		});
	};

	const handleZeroRnd = () => {
		if (toggles.shiftActive) fetchApi({
			endpoint: "conversion",
			kind: "round"
		});
		else dispatchExprTokenState({
			type: "add",
			token: "0",
			input: "0",
			ins: toggles.insActive
		});
	};

	const handleFiveStat = () => {
		if (toggles.shiftActive && (toggles.regActive || toggles.sdActive)) dispatchKeyState({
		  type: "multitoggles",
			states: {
			  statActive: !toggles.statActive
			}
		});
		else dispatchExprTokenState({
			type: "add",
			token: "5",
			input: "5",
			ins: toggles.insActive
		});
	};

	const handleDrg = (token1, input1, token2) => {
		if (toggles.drgActive) {
			dispatchExprTokenState({
				type: "add",
				token: token1,
				input: <sup>{input1}</sup>,
				ins: toggles.insActive
			});
			dispatchKeyState({
			  type: "multitoggles",
  			states: {
  			  drgActive: !toggles.drgActive
  			}
			})
		} else dispatchExprTokenState({
			type: "add",
			token: token2,
			input: token2,
			ins: toggles.insActive
		});
	}

	_toggles = toggles;
	_dispatchExprTokenState = dispatchExprTokenState;

	return (
		<div className="grid gap-2 grid-rows-4 grid-cols-5 p-2 justify-center bg-gray-300 rounded-md" id="numspad">
			<Button props={nmKeys["seven"]} />
			<Button props={nmKeys["eight"]} />
			<Button props={nmKeys["nine"]} />
			<Button
				props={nmKeys["del-ins"]}
				effects={{ shiftins: true }}
				func={handleDelIns}
			/>
			<Button
				props={nmKeys["ac-off"]}
				cls="bg-red-900 text-gray-200"
				func={handleAcOff}
				effects={{ shift: true }}
			/>
			<Button props={nmKeys["four"]} />
			<Button props={nmKeys["five-stat"]} func={handleFiveStat} effects={{ shift: true, regsd: true }} />
			<Button props={nmKeys["six"]} />
			<Button props={nmKeys["times"]} />
			<Button props={nmKeys["divide"]} />
			<Button props={nmKeys["one"]} func={() => handleDrg("@deg", "d", "1")} />
			<Button props={nmKeys["two"]} func={() => handleDrg("@rad", "r", "2")} />
			<Button props={nmKeys["three"]} func={() => handleDrg("@grad", "g", "3")} />
			<Button props={nmKeys["plus"]} />
			<Button props={nmKeys["minus"]} />
			<Button props={nmKeys["zero-rnd"]} func={handleZeroRnd} effects={{ shift: true }} />
			<Button props={nmKeys["dot-rand"]} effects={{ shift: true }} />
			<Button props={nmKeys["pi-x10x"]} effects={{ shift: true }} />
			<Button props={nmKeys["ans-drg"]} func={handleAnsDrg} effects={{ shift: true }} />
			<Button props={nmKeys["equal-perc"]} func={handleEqualPerc} effects={{ shift: true }} />
		</div>
	)
}

const defaultClasses = "bg-[#333333] text-gray-200";

const getStateClasses = (effects = {}) => {
	return (effects.shift && effects.regsd && !(_toggles.regActive || _toggles.sdActive) && _toggles.shiftActive) ? defaultClasses :
		(effects.shift && _toggles.shiftActive) ? stateClasses.shiftActive :
			(effects.shiftins && _toggles.shiftActive) ? "bg-[#FF8C02] text-[#333333]" :
				(effects.shiftins && !_toggles.shiftActive) ? "bg-red-900 text-gray-300" : defaultClasses
};

const Button = ({ cls, props: [token, input, label], effects, func }) => {
	return (
		<button
			className={`py-2 rounded-md ${_toggles.powerActive && "active:bg-gray-400"} ${getStateClasses(effects)} ${cls}`}
			onClick={func || function () { return _dispatchExprTokenState({ type: "add", token: token, input: input || token, ins: _toggles.insActive }) }}
		>
			{label || input || token}
		</button>
	)
};