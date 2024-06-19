"use  client"

// Import statements (assuming you have them)
import Navbar from "@/components/Navbar/navbar";
import Sidebar from "@/components/Sidebar/sidebar";
import { MdCelebration } from "react-icons/md";
import { BsStars } from "react-icons/bs";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// Interface for data props (optional)
interface DashboardProps {
    data?: any[]; // Array of data objects for rendering (optional)
    router: AppRouterInstance;
    // You can add more props based on your needs
    user: string | null;
    createEndpoint?: string;
    joinEndpoint: string;
    homeEndpoint: String;
    dashboardEndpoint: String;
    groupsEndpoint: String;
}

const Dashboard = ({user, router, createEndpoint, joinEndpoint, homeEndpoint, dashboardEndpoint, groupsEndpoint }: DashboardProps) => {
    // Remove unnecessary state and context usage
    return (
        <>
            <Sidebar router={router} homeEndpoint={homeEndpoint} dashboardEndpoint={dashboardEndpoint} groupsEndpoint={groupsEndpoint}/>
            <Navbar user={user ? user : "guest" } />
            <main className="ml-[22%] mt-[5%]">
                {/* Title section */}
                <div className="flex items-center space-x-2">
                    <p className="text-[#21133F]">Welcome</p>
                    <MdCelebration className="text-xl text-[#6E00F7]" />
                </div>
                <h1 className="text-[#21133F] font-bold text-[35px]">
                    {"What do you have in mind?"}  {/* Display title if provided, otherwise default */}
                </h1>

                {/* Data section*/}
                <div className="bg-[#6E00F7] w-[500px] py-10 px-5 rounded-3xl mt-8" onClick={() => router?.push(`${createEndpoint}`)}>
                    <h1 className="text-white font-bold text-[45px]">
                        Create your first{" "}
                        <span className="text-[#97DDDD] flex items-center space-x-2">
                            group <BsStars />
                        </span>
                    </h1>
                    <p className="text-white w-[350px]">
                        Create your debut group on Owujupe. Let us kickstart this savings
                        journey together!
                    </p>
                </div>
                <div className="bg-[#97DDDD] w-[500px] py-10 px-5 rounded-3xl mt-8" onClick={() => router?.push(`${joinEndpoint}`)}>
                    <h1 className="text-[#21133F] font-bold text-[45px]">
                        Join your first{" "}
                        <span className="text-white flex items-center space-x-2">
                            group <BsStars />
                        </span>
                    </h1>
                    <p className="text-[#21133F] w-[350px]">
                        Start saving up for rainy days. Let us kickstart this savings
                        journey together!
                    </p>
                </div>
            </main>
        </>
    );
};

export default Dashboard;