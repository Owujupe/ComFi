"use client"

interface GroupsProps {
    groupDetails: [];
}

const Groups = ({groupDetails}: GroupsProps) => {
    

    return(
        <>
            <div>Groups</div>
            <div>
                ({
                    groupDetails.map((group,index) => (
                        <div key={index}>
                            hello
                        </div>
                    ))
                })
            </div>
        </>
    )
}

export default Groups;