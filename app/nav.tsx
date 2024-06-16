// "use client";
// import { useEffect, useContext } from "react";
// import { LogInContext } from "@/components/";
// import Link from "next/link";
// export default function NavBar() {
//   const { account, connectProvider } = useContext(LogInContext);
//   useEffect(() => {
//     connectProvider();
//   }, []);
//   return (
//     <nav className="w-full">
//       <div className="z-10 w-full items-center justify-between font-mono text-sm lg:flex">
//         <div className="fixed bottom-0 left-0 flex flex-row h-48 w-full items-end justify-between from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:bg-none">
//           <p className="fixed left-0 top-0 flex w-full justify-center border-b bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:p-4">
//             <Link
//               className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
//               href="/joinPool"
//             >
//               Join A Pool
//             </Link>
//           </p>
//           <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
//             <Link
//               className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
//               href="/poolDetails/0"
//             >
//               Fetch Details of Participated Pool
//             </Link>
//           </p>
//           <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
//             <Link
//               className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
//               href="/createPool"
//             >
//               Create A New Pool
//             </Link>
//           </p>
//           <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
//             {account ? (
//               "Connected"
//             ) : (
//               <button
//                 type="submit"
//                 onClick={connectProvider}
//                 className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
//               >
//                 Connect Wallet
//               </button>
//             )}
//           </p>
//         </div>
//       </div>
//     </nav>
//   );
// }
