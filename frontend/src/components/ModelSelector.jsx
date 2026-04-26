

// // // frontend/src/components/ModelSelector.jsx
// // export default function ModelSelector({ model, setModel }) {
// //   return (
// //     <select
// //       className="model-select"
// //       value={model}
// //       onChange={(e) => setModel(e.target.value)}
// //     >
// //       <optgroup label="🚀 Auto">
// //         <option value="auto">Auto (Groq Fast)</option>
// //       </optgroup>

// //       <optgroup label="☁️ Groq Cloud">
// //         <option value="groq-fast">Groq Fast — Llama 3.1 8B</option>
// //         <option value="groq-large">Groq Large — Llama 3.3 70B</option>
// //         <option value="groq-mixtral">Groq Mixtral — Mistral Saba 24B</option>
// //       </optgroup>
// //     </select>
// //   );
// // }
// // frontend/src/components/ModelSelector.jsx
// export default function ModelSelector({ model, setModel }) {
//   return (
//     <select
//       className="model-select"
//       value={model}
//       onChange={(e) => setModel(e.target.value)}
//     >
//       <optgroup label="🚀 Auto">
//         <option value="auto">Auto (Groq Fast)</option>
//       </optgroup>

//       <optgroup label="☁️ Groq Cloud">
//         <option value="groq-fast">Llama 3.1 8B — Fast</option>
//         <option value="groq-large">Llama 3.3 70B — Powerful</option>
//         <option value="groq-qwen">Qwen 3 32B — Alibaba</option>
//         <option value="groq-llama4">Llama 4 Scout — Latest</option>
//       </optgroup>
//     </select>
//   );
// }

// src/components/ModelSelector.jsx
// Model selection is now handled inside the chat sidebar.
// This component is kept if needed in other contexts.
export default function ModelSelector({ model, setModel }) {
  return (
    <select
      className="sidebar-model-select"
      value={model}
      onChange={(e) => setModel(e.target.value)}
    >
      <optgroup label="Auto">
        <option value="auto">Auto (Groq Fast)</option>
      </optgroup>
      <optgroup label="Groq Cloud">
        <option value="groq-fast">Llama 3.1 8B — Fast</option>
        <option value="groq-large">Llama 3.3 70B — Powerful</option>
        <option value="groq-qwen">Qwen 3 32B — Alibaba</option>
        <option value="groq-llama4">Llama 4 Scout — Latest</option>
      </optgroup>
    </select>
  );
}