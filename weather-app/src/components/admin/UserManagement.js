// import React, { useState, useEffect } from "react";
// import DataTable from "react-data-table-component";
// import { adminAPI, apiUtils } from "../../services/api";

// const UserManagement = ({ onAlert, setLoading }) => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [tableLoading, setTableLoading] = useState(true);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [toggledClearRows, setToggleClearRows] = useState(false);

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   useEffect(() => {
//     // Keresési szűrő alkalmazása
//     if (searchTerm) {
//       const filtered = users.filter((user) =>
//         user.email.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredUsers(filtered);
//     } else {
//       setFilteredUsers(users);
//     }
//   }, [users, searchTerm]);

//   const loadUsers = async () => {
//     try {
//       setTableLoading(true);
//       const response = await adminAPI.getUsers();
//       setUsers(response.data);
//     } catch (error) {
//       onAlert(apiUtils.getErrorMessage(error), "error");
//     } finally {
//       setTableLoading(false);
//     }
//   };

//   const handleStatusToggle = async (userId, currentStatus, email) => {
//     const newStatus = !currentStatus;
//     const action = newStatus ? "aktiválni" : "deaktiválni";

//     if (!window.confirm(`Biztosan szeretné ${action} ${email} felhasználót?`)) {
//       return;
//     }

//     try {
//       setLoading(true);
//       await adminAPI.updateUserStatus(userId, newStatus);

//       // Helyi state frissítése
//       setUsers((prevUsers) =>
//         prevUsers.map((user) =>
//           user.id === userId
//             ? { ...user, is_active: newStatus ? "1" : "0" }
//             : user
//         )
//       );

//       onAlert(
//         `${email} felhasználó sikeresen ${
//           newStatus ? "aktiválva" : "deaktiválva"
//         }`,
//         "success"
//       );
//     } catch (error) {
//       onAlert(apiUtils.getErrorMessage(error), "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteUser = async (userId, email) => {
//     if (
//       !window.confirm(
//         `Biztosan törölni szeretné ${email} felhasználót? Ez a művelet visszavonhatatlan!`
//       )
//     ) {
//       return;
//     }

//     try {
//       setLoading(true);
//       await adminAPI.deleteUser(userId);

//       // Helyi state frissítése
//       setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

//       onAlert(`${email} felhasználó sikeresen törölve`, "success");
//     } catch (error) {
//       onAlert(apiUtils.getErrorMessage(error), "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBulkDelete = async () => {
//     if (selectedRows.length === 0) {
//       onAlert("Válasszon ki legalább egy felhasználót", "warning");
//       return;
//     }

//     if (
//       !window.confirm(
//         `Biztosan törölni szeretné a kiválasztott ${selectedRows.length} felhasználót? Ez a művelet visszavonhatatlan!`
//       )
//     ) {
//       return;
//     }

//     try {
//       setLoading(true);
//       const deletePromises = selectedRows.map((user) =>
//         adminAPI.deleteUser(user.id)
//       );
//       await Promise.all(deletePromises);

//       // Helyi state frissítése
//       const deletedIds = selectedRows.map((user) => user.id);
//       setUsers((prevUsers) =>
//         prevUsers.filter((user) => !deletedIds.includes(user.id))
//       );

//       // Kijelölés törlése
//       setSelectedRows([]);
//       setToggleClearRows(!toggledClearRows);

//       onAlert(
//         `${selectedRows.length} felhasználó sikeresen törölve`,
//         "success"
//       );
//     } catch (error) {
//       onAlert(apiUtils.getErrorMessage(error), "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("hu-HU", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   // DataTable oszlopok
//   const columns = [
//     {
//       name: "Email",
//       selector: (row) => row.email,
//       sortable: true,
//       grow: 2,
//       cell: (row) => (
//         <div
//           style={{
//             fontWeight: "500",
//             color: "var(--text-primary)",
//           }}
//         >
//           {row.email}
//         </div>
//       ),
//     },
//     {
//       name: "Szerepkör",
//       selector: (row) => row.role,
//       sortable: true,
//       center: true,
//       cell: (row) => (
//         <span
//           style={{
//             padding: "4px 8px",
//             borderRadius: "4px",
//             fontSize: "12px",
//             fontWeight: "500",
//             background:
//               row.role === "admin"
//                 ? "var(--error-color)"
//                 : "var(--primary-color)",
//             color: "white",
//           }}
//         >
//           {row.role === "admin" ? "Admin" : "Felhasználó"}
//         </span>
//       ),
//     },
//     {
//       name: "Státusz",
//       selector: (row) => row.is_active,
//       sortable: true,
//       center: true,
//       cell: (row) => (
//         <button
//           onClick={() =>
//             handleStatusToggle(row.id, row.is_active === "1", row.email)
//           }
//           style={{
//             padding: "4px 12px",
//             borderRadius: "20px",
//             border: "none",
//             fontSize: "12px",
//             fontWeight: "500",
//             cursor: "pointer",
//             background:
//               row.is_active === "1"
//                 ? "var(--success-color)"
//                 : "var(--secondary-color)",
//             color: "white",
//             transition: "all 0.2s",
//           }}
//           title={
//             row.is_active === "1"
//               ? "Kattintson a deaktiváláshoz"
//               : "Kattintson az aktiváláshoz"
//           }
//         >
//           {row.is_active === "1" ? "Aktív" : "Inaktív"}
//         </button>
//       ),
//     },
//     {
//       name: "Regisztráció",
//       selector: (row) => row.created_at,
//       sortable: true,
//       cell: (row) => (
//         <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
//           {formatDate(row.created_at)}
//         </div>
//       ),
//     },
//     {
//       name: "Műveletek",
//       center: true,
//       cell: (row) => (
//         <div style={{ display: "flex", gap: "8px" }}>
//           <button
//             onClick={() => handleDeleteUser(row.id, row.email)}
//             style={{
//               padding: "6px 12px",
//               borderRadius: "4px",
//               border: "none",
//               background: "var(--error-color)",
//               color: "white",
//               fontSize: "12px",
//               cursor: "pointer",
//               transition: "all 0.2s",
//             }}
//             title="Felhasználó törlése"
//           >
//             Törlés
//           </button>
//         </div>
//       ),
//     },
//   ];

//   // DataTable testreszabás
//   const customStyles = {
//     headCells: {
//       style: {
//         backgroundColor: "var(--bg-secondary)",
//         color: "var(--text-primary)",
//         fontSize: "14px",
//         fontWeight: "600",
//         padding: "16px",
//       },
//     },
//     cells: {
//       style: {
//         padding: "16px",
//         fontSize: "14px",
//       },
//     },
//     rows: {
//       style: {
//         "&:hover": {
//           backgroundColor: "var(--bg-secondary)",
//           cursor: "pointer",
//         },
//       },
//     },
//   };

//   return (
//     <div>
//       {/* Fejléc és keresés */}
//       <div className="card">
//         <div className="card-header">
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               flexWrap: "wrap",
//               gap: "var(--spacing-md)",
//             }}
//           >
//             <h2 className="card-title">
//               Felhasználók kezelése ({filteredUsers.length})
//             </h2>

//             <div
//               style={{
//                 display: "flex",
//                 gap: "var(--spacing-md)",
//                 alignItems: "center",
//               }}
//             >
//               {/* Keresés */}
//               <input
//                 type="text"
//                 placeholder="Keresés email cím alapján..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 style={{
//                   padding: "8px 16px",
//                   border: "1px solid var(--border-color)",
//                   borderRadius: "var(--border-radius)",
//                   fontSize: "14px",
//                   minWidth: "250px",
//                 }}
//               />

//               {/* Tömeges törlés */}
//               {selectedRows.length > 0 && (
//                 <button
//                   onClick={handleBulkDelete}
//                   className="btn btn-danger btn-sm"
//                   style={{ whiteSpace: "nowrap" }}
//                 >
//                   Kijelöltek törlése ({selectedRows.length})
//                 </button>
//               )}

//               {/* Frissítés */}
//               <button
//                 onClick={loadUsers}
//                 className="btn btn-outline btn-sm"
//                 style={{ whiteSpace: "nowrap" }}
//               >
//                 Frissítés
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="card-body" style={{ padding: 0 }}>
//           <DataTable
//             columns={columns}
//             data={filteredUsers}
//             progressPending={tableLoading}
//             pagination
//             paginationPerPage={10}
//             paginationRowsPerPageOptions={[5, 10, 20, 50]}
//             selectableRows
//             selectedRows={selectedRows}
//             onSelectedRowsChange={({ selectedRows }) =>
//               setSelectedRows(selectedRows)
//             }
//             clearSelectedRows={toggledClearRows}
//             customStyles={customStyles}
//             noDataComponent={
//               <div
//                 style={{
//                   padding: "40px",
//                   textAlign: "center",
//                   color: "var(--text-secondary)",
//                 }}
//               >
//                 {searchTerm
//                   ? `Nincs találat "${searchTerm}" keresésre`
//                   : "Nincsenek felhasználók"}
//               </div>
//             }
//             progressComponent={
//               <div style={{ padding: "40px" }}>
//                 <div
//                   className="loading-spinner"
//                   style={{ margin: "0 auto" }}
//                 ></div>
//               </div>
//             }
//           />
//         </div>
//       </div>

//       {/* Statisztikák */}
//       <div className="card" style={{ marginTop: "var(--spacing-lg)" }}>
//         <div className="card-header">
//           <h3 className="card-title">Felhasználói statisztikák</h3>
//         </div>
//         <div className="card-body">
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//               gap: "var(--spacing-lg)",
//             }}
//           >
//             <div
//               style={{
//                 padding: "var(--spacing-lg)",
//                 background: "var(--bg-secondary)",
//                 borderRadius: "var(--border-radius)",
//                 textAlign: "center",
//               }}
//             >
//               <div
//                 style={{
//                   fontSize: "var(--text-2xl)",
//                   fontWeight: "bold",
//                   color: "var(--primary-color)",
//                   marginBottom: "var(--spacing-sm)",
//                 }}
//               >
//                 {users.length}
//               </div>
//               <div style={{ color: "var(--text-secondary)" }}>
//                 Összes felhasználó
//               </div>
//             </div>

//             <div
//               style={{
//                 padding: "var(--spacing-lg)",
//                 background: "var(--bg-secondary)",
//                 borderRadius: "var(--border-radius)",
//                 textAlign: "center",
//               }}
//             >
//               <div
//                 style={{
//                   fontSize: "var(--text-2xl)",
//                   fontWeight: "bold",
//                   color: "var(--success-color)",
//                   marginBottom: "var(--spacing-sm)",
//                 }}
//               >
//                 {users.filter((user) => user.is_active === "1").length}
//               </div>
//               <div style={{ color: "var(--text-secondary)" }}>
//                 Aktív felhasználók
//               </div>
//             </div>

//             <div
//               style={{
//                 padding: "var(--spacing-lg)",
//                 background: "var(--bg-secondary)",
//                 borderRadius: "var(--border-radius)",
//                 textAlign: "center",
//               }}
//             >
//               <div
//                 style={{
//                   fontSize: "var(--text-2xl)",
//                   fontWeight: "bold",
//                   color: "var(--error-color)",
//                   marginBottom: "var(--spacing-sm)",
//                 }}
//               >
//                 {users.filter((user) => user.role === "admin").length}
//               </div>
//               <div style={{ color: "var(--text-secondary)" }}>
//                 Adminisztrátorok
//               </div>
//             </div>

//             <div
//               style={{
//                 padding: "var(--spacing-lg)",
//                 background: "var(--bg-secondary)",
//                 borderRadius: "var(--border-radius)",
//                 textAlign: "center",
//               }}
//             >
//               <div
//                 style={{
//                   fontSize: "var(--text-2xl)",
//                   fontWeight: "bold",
//                   color: "var(--warning-color)",
//                   marginBottom: "var(--spacing-sm)",
//                 }}
//               >
//                 {users.filter((user) => user.is_active === "0").length}
//               </div>
//               <div style={{ color: "var(--text-secondary)" }}>
//                 Inaktív felhasználók
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserManagement;
