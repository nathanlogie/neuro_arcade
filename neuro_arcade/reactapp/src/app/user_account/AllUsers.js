import {Banner} from "../../components/Banner";
import {MobileBanner} from "../../components/Banner";
import {motion} from "framer-motion";
import {getAllUsers, updateStatus} from "../../backendRequests";
import React, {useEffect, useState} from "react";
import styles from "../../styles/components/Table.module.css";
import {createTheme, ThemeProvider} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";

/**
 * Page for admins only
 * Lets admins see all users and approve new ones
 */
export function AllUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getAllUsers().then((usersResponse) => {
            setUsers(usersResponse);
        });
    }, []);

    async function changeUserStatus(user, newStatus) {
        // todo optimise this so that it only fetches users that are changed
        await updateStatus(user.username, newStatus)
            .then(() =>
                getAllUsers()
                    .then((data) => setUsers(data))
                    .catch((error) => console.log(error))
            )
            .catch((error) => {
                console.log("Error occurred while changing status:");
                console.log(error);
            });
    }

    const columns = [
        {field: "username", width: 150, renderHeader: () => <strong>Username</strong>},
        {field: "email", width: 150, renderHeader: () => <strong>Email</strong>},
        {field: "status", width: 150, renderHeader: () => <strong>Status</strong>},
        {
            field: "actions",
            headerName: "Actions",
            width: 200,
            renderCell: (params) => {
                const user = params.row;
                if (user.status === "approved") {
                    return (
                        <>
                            <button onClick={() => changeUserStatus(user, "pending")}>Revoke Approval</button>
                            <button onClick={() => changeUserStatus(user, "blocked")}>Block User</button>
                        </>
                    );
                } else if (user.status === "pending") {
                    return (
                        <>
                            <button onClick={() => changeUserStatus(user, "approved")}>Approve User</button>
                            <button onClick={() => changeUserStatus(user, "blocked")}>Block User</button>
                        </>
                    );
                } else if (user.status === "blocked") {
                    return <button onClick={() => changeUserStatus(user, "pending")}>Unblock User</button>;
                }
            }
        }
    ];

    const rows = users.map(function (user, index) {
        return {
            id: index + 1,
            username: user.username,
            email: user.email,
            status: user.status
        };
    });

    const table_theme = createTheme({
        palette: {
            mode: "dark"
        }
    });

    return (
        <>
            <Banner size={"big"} />
            <MobileBanner size={"big"} />

            <motion.div
                className={styles.MainBlock}
                id={styles["big"]}
                initial={{opacity: 0, x: 100}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: 100}}
            >
                <div className={styles.Content} id={styles["small"]}>
                    <div className={styles.Title}>
                        <h1>ALL USERS</h1>
                    </div>
                    <div className={styles.ContentBlock}>
                        <ThemeProvider theme={table_theme}>
                            <DataGrid
                                sx={{
                                    boxShadow: 2,
                                    border: 2,
                                    color: "white",
                                    borderColor: "rgba(0,0,0,0)",
                                    "& .MuiDataGrid-cell:hover": {
                                        color: "white"
                                    },
                                    height: "100%",
                                    width: "50%"
                                }}
                                rows={rows}
                                columns={columns}
                                disableRowSelectionOnClick
                            />
                        </ThemeProvider>
                    </div>
                </div>
            </motion.div>
            <div className={styles.MobileBannerBuffer} />
        </>
    );
}
