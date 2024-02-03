import { useCallback } from "react";
import { keyStyles } from "./../utilities/declarations";

const Button = ({ map_id, nmk }) => {
  const nmkVal = nmk.get(map_id);
  return (
    <button
      className={`${keyStyles[nmkVal[0].slice(-1)]} h-[2em] rounded-md`}
      data-btn-id={nmkVal[0]}
    >
      {nmkVal[1]}
    </button>
  );
};

const NumsPad = ({ tgl, nmk, dpk, dpt, avs, api }) => {
  const eventDelegate = useCallback((event) => {
    event.stopPropagation();
    const btnId = event.target.closest("button").getAttribute("data-btn-id");
    if (btnId.startsWith("n")) {
      dpt({ type: "add", token: btnId, tgl: tgl });
      if(!tgl.cursor)
        dpk({type: "multitoggles", states: {cursor: true}});
    } else if (btnId.startsWith("y")) {
      switch (btnId.slice(1, -1)) {
        case "4":
          dpt({ type: "delete" });
          dpk({type: "multitoggles", states: {cursor: true}});
          break;
        case "5":
          api.updateVars({ Qf: "0" });
          dpk({ type: "reset", button: "AC" });
          dpt({ type: "clear" });
          break;
        case "18":
          dpk({type: "multitoggles", states: { ins: !tgl.ins, drg: false, rst: false }});
          break;
        case "20":
          api.retrieve("/main", avs.current);
          break;
        default:
          console.log(btnId);
      }
    }
  }, [tgl, dpt, dpk, api, avs]);

  return (
    <div
      className="grid gap-2 grid-rows-4 grid-cols-5 p-2 justify-center bg-gray-300 rounded-md"
      id="numspad"
      onClick={eventDelegate}
    >
      {Array.from({ length: 20 }, (_, key) => (
        <Button key={key} map_id={key + 1} nmk={nmk} />
      ))}
    </div>
  );
};

export default NumsPad;
