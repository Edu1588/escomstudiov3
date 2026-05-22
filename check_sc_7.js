
      document.addEventListener("DOMContentLoaded", () => {
        const style = document.createElement("style");
        style.textContent = `
          @property --hover-angle {
            syntax: '<angle>';
            initial-value: 0deg;
            inherits: false;
          }
          @keyframes rotate-border {
            to { --hover-angle: 360deg; }
          }
          button {
            position: relative;
            z-index: 1;
            overflow: hidden;
            transform: translateZ(0); /* force render layer */
          }
          button::before {
            content: "";
            position: absolute;
            inset: -2px;
            z-index: -1;
            border-radius: inherit;
            background: conic-gradient(from var(--hover-angle), transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%);
            animation: rotate-border 3s linear infinite;
            opacity: 0;
            transition: opacity 0.5s ease;
          }
          button:hover::before {
             opacity: 1;
          }
          button::after {
            content: "";
            position: absolute;
            inset: 1px; /* border thickness */
            z-index: -1;
            border-radius: inherit;
            background: inherit;
            background-color: inherit;
          }
        `;
        document.head.appendChild(style);
        
        // Ensure all buttons have explicit background class if they don't have one so inner mask works
        document.querySelectorAll("button").forEach(b => {
            if (!b.className.includes("bg-")) {
               b.classList.add("bg-zinc-950"); // fallback
            }
        });
      });
    