import { useState, useCallback } from "react";
import { TextIcon, PowerOn, Arrow } from "./../utilities/icons";

const styles = {
  boxShadow: "inset -2px -2px 1px 1px rgba(0, 0, 0, 0.3), inset 2px 2px 1px 1px rgba(0, 0, 0, 0.3)"
};
const classes = "flex justify-between w-[27.5%] bg-black bg-opacity-30 py-1 rounded-2xl";

const Controls = ({ tgl, dpk, dpt, api }) => {
  const [colors, setColors] = useState(new Map(
    ["left", "top", "right", "bottom"].map(value => [value, "hsl(216, 12.2%, 83.9%)&maroon"])
  ));

  const eventDelegate = useCallback((event) => {
    event.stopPropagation();
    const btnId = event.target.closest("button").getAttribute("data-btn-id");
    if (btnId === "poweron") {
      dpk({type: "multitoggles", states: {rst: true, error: false, mode: false, drg: false, stat: false, hist: false}});
    } else if (["shift", "alpha", "mode"].includes(btnId)) {
      dpk({ type: `toggle${btnId}` });
    } else if (["left", "top", "right", "bottom"].includes(btnId)) {
      setColors(prevColors => new Map([...prevColors, [btnId, "hsl(215, 13.8%, 34.1%)&maroon"]]));
      setTimeout(() => setColors(prevColors => new Map([...prevColors, [btnId, "hsl(216, 12.2%, 83.9%)&maroon"]])), 100);
      dpk({
        type: "multitoggles",
        states: { cursor: true, error: false, nav: true }
      });
      dpt({ type: `nav${btnId}` });
      setTimeout(() => dpk({type: "multitoggles", states: { nav: false }}), 2000);
    }
  }, [dpk, dpt]);

  return (
    <div className="relative flex justify-between py-3" onClick={eventDelegate}>
      <div className={`${classes}`} style={styles}>
        <button data-btn-id="shift">
          <TextIcon text="S" fillStroke="#FF8C02" fillStroke2={tgl.shift ? "lightgreen" : "#333"} />
        </button>
        <button data-btn-id="alpha">
          <TextIcon text="A" fillStroke="rgb(255, 133, 154)" fillStroke2={tgl.alpha ? "lightgreen" : "#333"} />
        </button>
      </div>
      <div className="absolute flex top-0 left-[32.5%] w-[35%] h-[150%]">
        <div className="relative flex flex-col justify-around w-[80%] h-[75%] m-auto rounded-xl bg-black bg-opacity-30" style={styles}>
          <button data-btn-id="top" className="self-center mb-2"><Arrow colors={colors.get("top")} rotate={90} /></button>
          <button data-btn-id="bottom" className="self-center"><Arrow colors={colors.get("bottom")} rotate={-90} /></button>
        </div>
        <button data-btn-id="left" className="absolute top-[27.75%] left-0"><Arrow colors={colors.get("left")} rotate={0} /></button>
        <button data-btn-id="right" className="absolute top-[27.75%] right-0"><Arrow colors={colors.get("right")} rotate={180} /></button>
      </div>
      <div className={`${classes}`} style={styles}>
        <button data-btn-id="mode">
          <TextIcon text="M" fillStroke="slateblue" fillStroke2={tgl.mode ? "lightgreen" : "#333"} />
        </button>
        <button data-btn-id="poweron">
          <PowerOn/>
        </button>
      </div>
    </div>
  );
};

export default Controls;
