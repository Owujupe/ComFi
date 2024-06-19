"use client"

import Groups from "@/components/groups";
import { useEffect, useState } from "react";


const BlockchainGroups = () => {
    const [groupInfo, setGroupInfo] = useState([]);

    useEffect(() => {
        const getGroupDetails = async () => {
            // calling the backend to fetch group details based on user
        }

        getGroupDetails();
    })


    return(
        <>
            <Groups groupDetails={groupInfo}/>
        </>
    )
}

// Mock function to simulate backend call
const fetchGroupDetailsFromBackend = async (): Promise<[]> => {
    return [
        { id: '1', name: 'Group A' },
        { id: '2', name: 'Group B' },
        { id: '2' },
    ];
};

export default BlockchainGroups;