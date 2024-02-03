import { rangeselector } from "./../utilities/screen.module.css";

const ModeMenu = ({ state, setState, tgl, regFormulae }) => {
  const isRegBtn = state?.btn === "REG";

  return (
    <div className="p-1">
      {state.open && (
        <div className="absolute z-40 w-[55%] h-[85%] top-2.5 right-2.5 bg-gray-200 rounded ring-2 ring-red-900">
          <span className="block text-center bg-red-900 text-gray-200">
            SET {isRegBtn ? "FORMULA" : "LEVEL"}
          </span>
          <button
            className="absolute px-1 top-0.5 right-2 text-gray-200 text-xs font-bold"
            data-btn-id="rng-exit"
          >
            X
          </button>
          <label htmlFor="range-input" className="block text-center">
            <span>{isRegBtn ? "f: " : "l = "}</span>
            {isRegBtn ? regFormulae[state.value < 7 ? state.value : 6][1] : state.value}
          </label>
          <input
            className={`block border-0 rounded bg-gray-200 ring-2 ring-gray-300 focus:outline-none px-1 text-center w-[8em] mx-auto ${rangeselector}`}
            type="range"
            value={state.value}
            id="range-input"
            max={isRegBtn ? 6 : 12}
            min={0}
            onChange={(e) => setState({ ...state, value: e.target.value })}
          />
          <button
            className="absolute bottom-0 right-0 px-2.5 py-0.5 bg-green-500 rounded"
            data-btn-id="rng-ok"
          >
            OK
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-y-1 gap-x-4">
        {[
          ["MODE", ["CMP", "SD", "REG"]],
          ["ANGLE", ["DEG", "RAD", "GRAD"]],
          ["PRECISION", ["FIX", "SCI", "NRM"]],
          ["DATA", ["STAT", "HIST"]],
        ].map(([cat, btns]) => (
          <div key={cat} className="">
            <span className="block text-sm text-red-800 border-b-2 mb-1 border-red-800">
              {cat}
            </span>
            <div className="grid grid-cols-3 gap-x-3">
              {btns.map((btn) => {
                const btnActive =
                  (btn === "CMP" && !tgl.reg && !tgl.sd) ||
                  (!["STAT", "HIST"].includes(btn) &&
                    tgl[btn.toLowerCase()]);
                const btnBgTxtColor = btnActive
                  ? "bg-red-800 text-gray-200"
                  : ["STAT", "HIST"].includes(btn)
                  ? "bg-blue-800 text-gray-200"
                  : "bg-gray-300 text-black";

                return (
                  <button
                    key={`${cat}_${btn}`}
                    data-btn-id={btn}
                    className={`text-xs rounded py-0.5 ${btnBgTxtColor}`}
                  >
                    {btn}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModeMenu;
