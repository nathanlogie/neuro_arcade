import {Banner} from "../../components/Banner";
import {MobileBanner} from "../../components/Banner";
import {motion} from "framer-motion";
import {getAllUsers, updateStatus} from "../../backendRequests";
import React, {useEffect, useState} from "react";
import styles from "../../styles/App.module.css";
import table from "../../styles/components/Table.module.css";
import {createTheme, ThemeProvider} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {NavBar} from "../../components/NavBar";
import {Button} from "../../components/Button";
import {FaPlus} from "react-icons/fa6";
import {MdBlock} from "react-icons/md";
import {ImCross} from "react-icons/im";

/**
 * Page for admins only
 * Lets admins see all users and approve new ones
 */
export function AllUsers() {
    const [users, setUsers] = useState([]);

    let nav_left = <Button name={"user account"} link={"/user_account"} orientation={"left"} direction={"left"} />;

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
        {field: "email", width: 175, renderHeader: () => <strong>Email</strong>},
        {field: "status", width: 150, renderHeader: () => <strong>Status</strong>},
        {
            field: "actions",
            width: 250,
            renderHeader: () => <strong>Actions</strong>,
            renderCell: (params) => {
                const user = params.row;
                if (user.status === "approved") {
                    return (
                        <>
                            <motion.button
                                className={table.Revoke}
                                onClick={() => changeUserStatus(user, "pending")}
                                whileHover={{scale: 1.1}}
                                whileTap={{scale: 0.9}}
                            >
                                Revoke
                                <div>
                                    <ImCross />
                                </div>
                            </motion.button>
                            <motion.button
                                className={table.Block}
                                onClick={() => changeUserStatus(user, "blocked")}
                                whileHover={{scale: 1.1}}
                                whileTap={{scale: 0.9}}
                            >
                                Block
                                <div>
                                    <MdBlock />
                                </div>
                            </motion.button>
                        </>
                    );
                } else if (user.status === "pending") {
                    return (
                        <>
                            <motion.button
                                className={table.Approve}
                                onClick={() => changeUserStatus(user, "approved")}
                                whileHover={{scale: 1.1}}
                                whileTap={{scale: 0.9}}
                            >
                                Approve
                                <div>
                                    <FaPlus />
                                </div>
                            </motion.button>
                            <motion.button
                                className={table.Block}
                                onClick={() => changeUserStatus(user, "blocked")}
                                whileHover={{scale: 1.1}}
                                whileTap={{scale: 0.9}}
                            >
                                Block
                                <div>
                                    <MdBlock />
                                </div>
                            </motion.button>
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
            <Banner size={"big"} left={nav_left} />
            <MobileBanner size={"big"} />
            <NavBar left={nav_left} />
            <motion.div
                className={styles.MainBlock}
                id={styles["big"]}
                initial={{opacity: 0, x: 100}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: 100}}
            >
                <div className={styles.DataBlock} id={styles["big"]}>
                    <div className={table.TableContainer} id={table["allUsers"]}>
                        <h2>All Users</h2>
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
                                    width: "100%"
                                }}
                                rows={rows}
                                columns={columns}
                                disableRowSelectionOnClick
                            />
                        </ThemeProvider>
                    </div>
                </div>
                <div className={styles.MobileBannerBuffer} />
            </motion.div>
        </>
    );
}
