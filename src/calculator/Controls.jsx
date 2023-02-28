import {
	useState, useContext
}
	from "react";
import {
	StatesContext
}
	from "./Contexts";
import TextIcon, {
	PowerOn, Arrow
}
	from "./Icons";

export default function Controls({
	props: [dispatchKeyState, dispatchExprTokenState, setAnswer]
}) {
	const {
		shiftActive, alphaActive, clearActive, powerActive, modeActive, cursorActive, errorActive
	} = useContext(StatesContext);

	const defaultColors = "hsl(216, 12.2%, 83.9%)&maroon";

	const altColor = "hsl(215, 13.8%, 34.1%)";

	const [colors, setColors] = useState(new Map([
		["left", defaultColors],
		["top", defaultColors],
		["right", defaultColors],
		["bottom", defaultColors]
	]));

	const styles = {
		"boxShadow": "inset -2px -2px 1px 1px rgba(0, 0, 0, 0.3), inset 2px 2px 1px 1px rgba(0, 0, 0, 0.3)"
	};

	const classes = "flex justify-between w-[27.5%] bg-black bg-opacity-30 py-1 rounded-2xl";

	const navigate = (side) => {
		if (powerActive) {
			setColors(new Map([...colors, [side, `${altColor}&maroon&${altColor}`]]));
			
			const timeoutId1 = setTimeout(() => {
				setColors(new Map([...colors, [side, defaultColors]]));
				clearTimeout(timeoutId1);
			}, 100);
			
		  if (!cursorActive && !errorActive && ["top", "bottom"].includes(side)) {
  			dispatchKeyState({
  				type: "multitoggles",
  				states: {
  				  histActive: true
  				}
  			});
  			return;
		  }
			
			dispatchKeyState({
				type: "multitoggles",
				states: {
				  cursorActive: true,
				  errorActive: false,
				  navActive: true,
				}
			});
			
			dispatchExprTokenState({
				type: `nav${side}`,
				button: "nav"
			});
			
			const timeoutId2 = setTimeout(() => {
				dispatchKeyState({
					type: "multitoggles",
					states: {
					  navActive: false
					}
				});
				clearTimeout(timeoutId2);
			}, 2000);
		}
	};

	return (
		<div className="relative flex justify-between py-3">
			<div className={`${classes}`} style={styles}>
				<button className="" onClick={() => dispatchKeyState({ type: "toggleshift" })}>
					<TextIcon text="S" fillStroke="#FF8C02" fillStroke2={shiftActive ? "lightgreen" : "#333"} />
				</button>
				<button className="" onClick={() => dispatchKeyState({ type: "togglealpha" })}>
					<TextIcon text="A" fillStroke="rgb(255,133,154)" fillStroke2={alphaActive ? "lightgreen" : "#333"} />
				</button>
			</div>
			<div className="absolute flex top-0 left-[32.5%] w-[35%] h-[150%]">
				<div className="relative flex flex-col justify-around w-[80%] h-[75%] m-auto rounded-xl bg-black bg-opacity-30" style={styles}>
				  <button className="self-center mb-2" onClick={() => navigate("top")}><Arrow colors={colors.get("top")} rotate={90} /></button>
				  <button className="self-center" onClick={() => navigate("bottom")}><Arrow colors={colors.get("bottom")} rotate={-90} /></button>
				</div>
				<button className="absolute top-[27.75%] left-0" onClick={() => navigate("left")}><Arrow colors={colors.get("left")} rotate={0} /></button>
				<button className="absolute top-[27.75%] right-0" onClick={() => navigate("right")}><Arrow colors={colors.get("right")} rotate={180} /></button>
			</div>
			<div className={`${classes}`} style={styles}>
				<button className="" onClick={() => dispatchKeyState({ type: "togglemodeorclear" })}>
					{shiftActive ?
						<TextIcon text="X" fillStroke="#c3195d" fillStroke2={clearActive ? "lightgreen" : "#333"} />
						:
						<TextIcon text="M" fillStroke="slateblue" fillStroke2={modeActive ? "lightgreen" : "#333"} />
					}
				</button>
				<button className="" onClick={() => {
					dispatchKeyState({ type: "togglepower", state: true, button: "poweron" });
					dispatchExprTokenState({ type: "clear" })
					setAnswer("0")
				}
				}>
					<PowerOn stroke={powerActive ? "green" : "maroon"} />
				</button>
			</div>
		</div>
	);
};