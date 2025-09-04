// import React, { useState, useEffect } from "react";
// import { adminAPI, apiUtils } from "../../services/api";

// const PopularityStats = ({ onAlert, setLoading }) => {
//   const [stats, setStats] = useState([]);
//   const [loading, setStatsLoading] = useState(true);

//   useEffect(() => {
//     loadStats();
//   }, []);

//   const loadStats = async () => {
//     try {
//       setStatsLoading(true);
//       const response = await adminAPI.getPopularityStats();
//       setStats(response.data);
//     } catch (error) {
//       onAlert(apiUtils.getErrorMessage(error), "error");
//     } finally {
//       setStatsLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{ padding: "40px", textAlign: "center" }}>
//         <div className="loading-spinner" style={{ margin: "0 auto" }}></div>
//         <p style={{ marginTop: "16px", color: "var(--text-secondary)" }}>
//           Statisztikák betöltése...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="card">
//         <div className="card-header">
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <h2 className="card-title">Népszerű városok ({stats.length})</h2>
//             <button onClick={loadStats} className="btn btn-outline btn-sm">
//               Frissítés
//             </button>
//           </div>
//         </div>

//         <div className="card-body">
//           {stats.length === 0 ? (
//             <div style={{ textAlign: "center", padding: "40px" }}>
//               <div style={{ fontSize: "4rem", marginBottom: "16px" }}>📊</div>
//               <h3 style={{ marginBottom: "8px" }}>Még nincsenek adatok</h3>
//               <p style={{ color: "var(--text-secondary)" }}>
//                 A statisztikák akkor jelennek meg, amikor a felhasználók
//                 hozzáadják kedvenc városaikat.
//               </p>
//             </div>
//           ) : (
//             <>
//               {/* Top 3 kiemelt */}
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//                   gap: "var(--spacing-lg)",
//                   marginBottom: "var(--spacing-xl)",
//                 }}
//               >
//                 {stats.slice(0, 3).map((city, index) => (
//                   <div
//                     key={city.id}
//                     style={{
//                       padding: "var(--spacing-lg)",
//                       borderRadius: "var(--border-radius-lg)",
//                       textAlign: "center",
//                       background:
//                         index === 0
//                           ? "linear-gradient(135deg, #fbbf24, #f59e0b)" // Gold
//                           : index === 1
//                           ? "linear-gradient(135deg, #9ca3af, #6b7280)" // Silver
//                           : "linear-gradient(135deg, #cd7c2f, #a16207)", // Bronze
//                       color: "white",
//                       position: "relative",
//                       overflow: "hidden",
//                     }}
//                   >
//                     <div
//                       style={{
//                         fontSize: "2rem",
//                         marginBottom: "var(--spacing-sm)",
//                       }}
//                     >
//                       {index === 0 ? "🏆" : index === 1 ? "🥈" : "🥉"}
//                     </div>
//                     <h3
//                       style={{
//                         fontSize: "var(--text-lg)",
//                         marginBottom: "var(--spacing-sm)",
//                       }}
//                     >
//                       {city.name}
//                     </h3>
//                     <p
//                       style={{
//                         opacity: 0.9,
//                         fontSize: "var(--text-sm)",
//                         marginBottom: "var(--spacing-md)",
//                       }}
//                     >
//                       {city.country}
//                     </p>
//                     <div
//                       style={{
//                         fontSize: "var(--text-2xl)",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       {city.favorite_count} kedvelő
//                     </div>
//                     <div
//                       style={{
//                         position: "absolute",
//                         top: "var(--spacing-sm)",
//                         right: "var(--spacing-sm)",
//                         background: "rgba(255,255,255,0.2)",
//                         borderRadius: "50%",
//                         width: "30px",
//                         height: "30px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         fontSize: "var(--text-lg)",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       #{index + 1}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Teljes lista táblázatban */}
//               <div style={{ overflowX: "auto" }}>
//                 <table
//                   style={{
//                     width: "100%",
//                     borderCollapse: "collapse",
//                     fontSize: "var(--text-sm)",
//                   }}
//                 >
//                   <thead>
//                     <tr
//                       style={{
//                         backgroundColor: "var(--bg-secondary)",
//                         borderBottom: "2px solid var(--border-color)",
//                       }}
//                     >
//                       <th
//                         style={{
//                           padding: "var(--spacing-md)",
//                           textAlign: "left",
//                           fontWeight: "600",
//                         }}
//                       >
//                         Helyezés
//                       </th>
//                       <th
//                         style={{
//                           padding: "var(--spacing-md)",
//                           textAlign: "left",
//                           fontWeight: "600",
//                         }}
//                       >
//                         Város
//                       </th>
//                       <th
//                         style={{
//                           padding: "var(--spacing-md)",
//                           textAlign: "left",
//                           fontWeight: "600",
//                         }}
//                       >
//                         Ország
//                       </th>
//                       <th
//                         style={{
//                           padding: "var(--spacing-md)",
//                           textAlign: "center",
//                           fontWeight: "600",
//                         }}
//                       >
//                         Kedvelők száma
//                       </th>
//                       <th
//                         style={{
//                           padding: "var(--spacing-md)",
//                           textAlign: "center",
//                           fontWeight: "600",
//                         }}
//                       >
//                         Népszerűség
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {stats.map((city, index) => {
//                       const maxFavorites = Math.max(
//                         ...stats.map((s) => parseInt(s.favorite_count))
//                       );
//                       const percentage = Math.round(
//                         (city.favorite_count / maxFavorites) * 100
//                       );

//                       return (
//                         <tr
//                           key={city.id}
//                           style={{
//                             borderBottom: "1px solid var(--border-color)",
//                             "&:hover": {
//                               backgroundColor: "var(--bg-secondary)",
//                             },
//                           }}
//                         >
//                           <td
//                             style={{
//                               padding: "var(--spacing-md)",
//                               fontWeight: "600",
//                             }}
//                           >
//                             <div
//                               style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: "var(--spacing-sm)",
//                               }}
//                             >
//                               <span
//                                 style={{
//                                   background:
//                                     index < 3
//                                       ? "var(--primary-color)"
//                                       : "var(--secondary-color)",
//                                   color: "white",
//                                   borderRadius: "50%",
//                                   width: "24px",
//                                   height: "24px",
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                   fontSize: "12px",
//                                   fontWeight: "bold",
//                                 }}
//                               >
//                                 {index + 1}
//                               </span>
//                               {index < 3 && (
//                                 <span style={{ fontSize: "16px" }}>
//                                   {index === 0
//                                     ? "🏆"
//                                     : index === 1
//                                     ? "🥈"
//                                     : "🥉"}
//                                 </span>
//                               )}
//                             </div>
//                           </td>
//                           <td
//                             style={{
//                               padding: "var(--spacing-md)",
//                               fontWeight: "500",
//                             }}
//                           >
//                             {city.name}
//                           </td>
//                           <td
//                             style={{
//                               padding: "var(--spacing-md)",
//                               color: "var(--text-secondary)",
//                             }}
//                           >
//                             {city.country}
//                           </td>
//                           <td
//                             style={{
//                               padding: "var(--spacing-md)",
//                               textAlign: "center",
//                               fontWeight: "600",
//                               color: "var(--primary-color)",
//                             }}
//                           >
//                             {city.favorite_count}
//                           </td>
//                           <td
//                             style={{
//                               padding: "var(--spacing-md)",
//                               textAlign: "center",
//                             }}
//                           >
//                             <div
//                               style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: "var(--spacing-sm)",
//                                 justifyContent: "center",
//                               }}
//                             >
//                               <div
//                                 style={{
//                                   width: "60px",
//                                   height: "8px",
//                                   backgroundColor: "var(--bg-secondary)",
//                                   borderRadius: "4px",
//                                   overflow: "hidden",
//                                 }}
//                               >
//                                 <div
//                                   style={{
//                                     width: `${percentage}%`,
//                                     height: "100%",
//                                     backgroundColor:
//                                       index < 3
//                                         ? "var(--success-color)"
//                                         : "var(--primary-color)",
//                                     borderRadius: "4px",
//                                     transition: "width 0.3s ease",
//                                   }}
//                                 ></div>
//                               </div>
//                               <span
//                                 style={{
//                                   fontSize: "12px",
//                                   color: "var(--text-secondary)",
//                                   minWidth: "35px",
//                                 }}
//                               >
//                                 {percentage}%
//                               </span>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Összefoglaló statisztikák */}
//               <div
//                 style={{
//                   marginTop: "var(--spacing-xl)",
//                   padding: "var(--spacing-lg)",
//                   backgroundColor: "var(--bg-secondary)",
//                   borderRadius: "var(--border-radius)",
//                   display: "grid",
//                   gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
//                   gap: "var(--spacing-lg)",
//                   textAlign: "center",
//                 }}
//               >
//                 <div>
//                   <div
//                     style={{
//                       fontSize: "var(--text-2xl)",
//                       fontWeight: "bold",
//                       color: "var(--primary-color)",
//                     }}
//                   >
//                     {stats.length}
//                   </div>
//                   <div
//                     style={{
//                       fontSize: "var(--text-sm)",
//                       color: "var(--text-secondary)",
//                     }}
//                   >
//                     Követett városok
//                   </div>
//                 </div>

//                 <div>
//                   <div
//                     style={{
//                       fontSize: "var(--text-2xl)",
//                       fontWeight: "bold",
//                       color: "var(--success-color)",
//                     }}
//                   >
//                     {stats.reduce(
//                       (sum, city) => sum + parseInt(city.favorite_count),
//                       0
//                     )}
//                   </div>
//                   <div
//                     style={{
//                       fontSize: "var(--text-sm)",
//                       color: "var(--text-secondary)",
//                     }}
//                   >
//                     Összes kedvelés
//                   </div>
//                 </div>

//                 <div>
//                   <div
//                     style={{
//                       fontSize: "var(--text-2xl)",
//                       fontWeight: "bold",
//                       color: "var(--warning-color)",
//                     }}
//                   >
//                     {stats.length > 0
//                       ? Math.round(
//                           stats.reduce(
//                             (sum, city) => sum + parseInt(city.favorite_count),
//                             0
//                           ) / stats.length
//                         )
//                       : 0}
//                   </div>
//                   <div
//                     style={{
//                       fontSize: "var(--text-sm)",
//                       color: "var(--text-secondary)",
//                     }}
//                   >
//                     Átlag kedvelés/város
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PopularityStats;
