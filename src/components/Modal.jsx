const Modal = ({state, exitfn, okayfn, syncState}) => {
  const onExit = () => {
    exitfn();
    syncState(false);
  };
  const onOkay = () => {
    okayfn();
    syncState(false);
  };
  return state ?
    <>
      <div className="absolute z-50 flex flex-col items-center justify-center h-screen w-auto bg-transparent">
        <div className="bg-gray-100 rounded-md shadow-lg p-3 min-w-[250px] max-w-[350px]">
          {/*Header*/}
          <div className="pb-1">
            <h3 className="font-semibold">Confirm action</h3>
          </div>
          {/*Body*/}
          <div className="p-2 border-y-2">
            <p className="text-sm text-gray-600">
              This action will mess your system. 
              Are you sure to continue?
            </p>
          </div>
          {/*Footer*/}
          <div className="flex flex-row justify-end space-x-4 pt-2">
            <button className="text-sm text-gray-200 bg-red-700 px-2 py-1 rounded-md shadow-md" onClick={onExit}>Exit</button>
            <button className="text-sm text-white bg-emerald-700 px-2 py-1 rounded-md shadow-md" onClick={onOkay}>Okay</button>
          </div>
        </div>
      </div>
      <div className="absolute z-40 h-screen w-screen bg-gray-900 opacity-75"></div>
    </>
  :
    null
};

Modal.defaultProps = {
  state: false,
  exitfn: () => {},
  okayfn: () => {},
  syncState: () => {}
};

export default Modal;