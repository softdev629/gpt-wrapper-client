const FullScreenLoader = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-[#00000088]">
      <div className="flex justify-center items-center">
        <div className="lds-dual-ring"></div>
      </div>
    </div>
  );
};

export default FullScreenLoader;
