// import React from "react";

// const Alert = ({
//   type = "info",
//   message,
//   title,
//   closable = false,
//   onClose,
//   className = "",
//   style = {},
// }) => {
//   if (!message) return null;

//   const getAlertClass = () => {
//     const baseClass = "alert";
//     const typeClass = `alert-${type}`;
//     return `${baseClass} ${typeClass} ${className}`.trim();
//   };

//   const getIcon = () => {
//     switch (type) {
//       case "success":
//         return "✓";
//       case "error":
//         return "✕";
//       case "warning":
//         return "⚠";
//       case "info":
//       default:
//         return "ℹ";
//     }
//   };

//   return (
//     <div className={getAlertClass()} style={style}>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "flex-start",
//           gap: "var(--spacing-sm)",
//         }}
//       >
//         {/* Ikon */}
//         <div
//           style={{
//             fontSize: "var(--text-lg)",
//             fontWeight: "bold",
//             flexShrink: 0,
//             marginTop: "2px",
//           }}
//         >
//           {getIcon()}
//         </div>

//         {/* Tartalom */}
//         <div style={{ flex: 1 }}>
//           {title && (
//             <div
//               style={{
//                 fontWeight: "600",
//                 marginBottom: "var(--spacing-xs)",
//               }}
//             >
//               {title}
//             </div>
//           )}
//           <div>
//             {typeof message === "string" ? message : JSON.stringify(message)}
//           </div>
//         </div>

//         {/* Bezárás gomb */}
//         {closable && onClose && (
//           <button
//             onClick={onClose}
//             style={{
//               background: "none",
//               border: "none",
//               fontSize: "var(--text-xl)",
//               cursor: "pointer",
//               padding: 0,
//               color: "currentColor",
//               opacity: 0.7,
//               flexShrink: 0,
//             }}
//             onMouseEnter={(e) => (e.target.style.opacity = 1)}
//             onMouseLeave={(e) => (e.target.style.opacity = 0.7)}
//             title="Bezárás"
//           >
//             ×
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// // Speciális alert típusok
// export const SuccessAlert = ({ message, ...props }) => (
//   <Alert type="success" message={message} {...props} />
// );

// export const ErrorAlert = ({ message, ...props }) => (
//   <Alert type="error" message={message} {...props} />
// );

// export const WarningAlert = ({ message, ...props }) => (
//   <Alert type="warning" message={message} {...props} />
// );

// export const InfoAlert = ({ message, ...props }) => (
//   <Alert type="info" message={message} {...props} />
// );

// export default Alert;
