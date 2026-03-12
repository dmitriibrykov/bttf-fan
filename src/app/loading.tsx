import { Oval } from "react-loader-spinner";

export default function CharactersLoading() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <Oval
        height={80}
        width={80}
        color="#eb7010"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#eb7010"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
}
